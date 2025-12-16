/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const { createClient } = require('@supabase/supabase-js');

let SUPABASE_URL = process.env.SUPABASE_URL;
let SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// Fallback: try to read src/.env if env vars aren't set
if ((!SUPABASE_URL || !SUPABASE_KEY) && fs.existsSync(path.join(__dirname, '..', 'src', '.env'))) {
  const raw = fs.readFileSync(path.join(__dirname, '..', 'src', '.env'), 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(.*))\s*$/i);
    if (m) {
      const key = m[1];
      const val = m[2] ?? m[3] ?? (m[4] ? m[4].trim() : '');
      if (key === 'SUPABASE_URL' && !SUPABASE_URL) SUPABASE_URL = val;
      if ((key === 'SUPABASE_SERVICE_KEY' || key === 'SUPABASE_ANON_KEY') && !SUPABASE_KEY) SUPABASE_KEY = val;
    }
  });
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables or include them in src/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ensureBucket(bucket) {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets.find((b) => b.name === bucket)) {
      console.log(`Creating bucket: ${bucket}`);
      const { error } = await supabase.storage.createBucket(bucket, { public: true });
      if (error) throw error;
    }
  } catch (err) {
    console.warn('Could not list/create buckets, proceeding to attempt upload (bucket might exist already):', err.message || err);
  }
}

async function run() {
  const imagesDir = path.join(__dirname, '..', 'src', 'app', 'components', 'img');
  const files = fs.readdirSync(imagesDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (!files.length) {
    console.log('No images found in', imagesDir);
    return;
  }

  const bucket = 'messages';
  await ensureBucket(bucket);

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const ext = path.extname(file).slice(1);
    const contentType = mime.getType(filePath) || `image/${ext}`;
    const key = `messages/${Date.now()}-${file}`;

    const fileBuffer = fs.readFileSync(filePath);

    console.log('Uploading', file, 'as', key);
    const { error: uploadError } = await supabase.storage.from(bucket).upload(key, fileBuffer, { contentType, upsert: false });
    if (uploadError) {
      console.error('Upload error for', file, uploadError.message || uploadError);
      continue;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(key);
    const publicUrl = publicData?.publicUrl;
    if (!publicUrl) {
      console.warn('Could not get public URL for', key);
      continue;
    }

    // Insert a message row
    const name = path.basename(file, path.extname(file)).replace(/[_-]/g, ' ');
    const message = `Photo: ${name}`;

    const { data, error } = await supabase.from('messages').insert([{ name, message, photo: publicUrl }]).select();
    if (error) {
      console.error('Insert error for', file, error.message || error);
    } else {
      console.log('Inserted message for', file, (data && data[0] && data[0].id) || 'ok');
    }
  }

  console.log('Seeding completed');
}

run().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});

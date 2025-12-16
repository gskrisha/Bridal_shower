/**
 * Seed script to upload images from `src/app/components/img` to Supabase Storage
 * and insert a message row for each uploaded image.
 *
 * Usage:
 * SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/seedSupabaseMessages.js
 */

const fs = require('fs');
const path = require('path');
const mime = require('mime');

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function ensureBucket(bucket) {
  const { data: buckets } = await supabase.storage.getBuckets();
  if (!buckets.find((b) => b.name === bucket)) {
    console.log(`Creating bucket: ${bucket}`);
    const { error } = await supabase.storage.createBucket(bucket, { public: true });
    if (error) throw error;
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

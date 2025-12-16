/* Test Supabase connectivity using credentials from src/.env (if present)
 * This script will not print secret keys. It reports whether listing buckets
 * and querying the `messages` table succeed.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function parseEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(.*))\s*$/i);
      if (m) {
        env[m[1]] = m[2] ?? m[3] ?? (m[4] ? m[4].trim() : '');
      }
    }
    return env;
  } catch (err) {
    return {};
  }
}

(async () => {
  const envPath = path.join(__dirname, '..', 'src', '.env');
  const env = parseEnvFile(envPath);

  const SUPABASE_URL = process.env.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('No SUPABASE_URL or SUPABASE_SERVICE_KEY found in environment or src/.env');
    process.exit(1);
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log('Attempting to list storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError.message || bucketsError);
    } else {
      console.log('Buckets found:', Array.isArray(buckets) ? buckets.map((b) => b.name).join(', ') : String(buckets));
    }

    console.log('Attempting to fetch a few rows from `messages` table...');
    const { data, error } = await supabase.from('messages').select('id,name,created_at,photo').limit(5).order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to query messages table:', error.message || error);
    } else {
      console.log('Messages rows fetched:', Array.isArray(data) ? data.length : 0);
      if (Array.isArray(data) && data.length) {
        console.log('Sample rows (id,name,created_at):');
        data.forEach((r) => console.log(` - ${r.id} | ${r.name} | ${r.created_at}`));
      }
    }

    console.log('Supabase connectivity test completed.');
  } catch (err) {
    console.error('Unexpected error during supabase test:', err.message || err);
    process.exit(1);
  }
})();

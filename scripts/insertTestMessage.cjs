/* Insert a test message into Supabase using service key in src/.env */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function readEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const env = {};
    raw.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?/i);
      if (m) env[m[1]] = m[2] || '';
    });
    return env;
  } catch (err) {
    return {};
  }
}

async function run() {
  const env = readEnvFile(path.join(__dirname, '..', 'src', '.env'));
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in src/.env');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log('Inserting test message...');
  const { data, error } = await supabase.from('messages').insert([{ name: 'Node Service Test', message: 'Inserted via test script at ' + new Date().toISOString() }]).select();
  if (error) {
    console.error('Insert error', error.message || error);
    process.exit(1);
  }
  console.log('Inserted:', data && data[0] && data[0].id);

  const { data: rows, error: fetchErr } = await supabase.from('messages').select('id,name,created_at,photo').order('created_at', { ascending: false }).limit(5);
  if (fetchErr) {
    console.error('Fetch error', fetchErr.message || fetchErr);
    process.exit(1);
  }
  console.log('Recent rows:');
  rows.forEach((r) => console.log(` - ${r.id} | ${r.name} | ${r.created_at}`));
}

run().catch((err) => console.error('Unexpected error', err));

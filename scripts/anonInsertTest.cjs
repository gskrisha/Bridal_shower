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
  const env = readEnvFile(path.join(__dirname, '..', '.env'));
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log('Attempting anon insert...');
  const { data, error } = await supabase.from('messages').insert([{ name: 'Anon Client Test', message: 'Testing anon insert from script ' + new Date().toISOString() }]).select();
  if (error) {
    console.error('Anon insert failed:', error.message || error);
    process.exit(1);
  }
  console.log('Anon insert succeeded, id:', data && data[0] && data[0].id);
}

run().catch((err) => console.error('Unexpected', err));
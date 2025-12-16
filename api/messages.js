const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'messages.json');

const supabaseHeaders = (key) => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
});

let supabaseClient = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY)) {
    supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY);
  }
} catch (e) {
  // supabase-js may not be installed in every environment — handled gracefully
  supabaseClient = null;
}

async function readLocal() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

async function writeLocal(arr) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2));
}

module.exports = async (req, res) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

  if (req.method === 'GET') {
    try {
      // Prefer using supabase client when available for consistent behavior
      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data || []);
      }

      if (SUPABASE_URL && SUPABASE_KEY) {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.desc`, {
          headers: supabaseHeaders(SUPABASE_KEY),
        });
        const data = await r.json();
        return res.status(200).json(data);
      }

      const local = await readLocal();
      return res.status(200).json(local.reverse());
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body && Object.keys(req.body).length ? req.body : JSON.parse(await getRawBody(req));
      const { name, message, photo, id } = body;

      // If this is an update request (id provided) and photo is present, update the existing row
      if (id && photo) {
        console.debug('[api/messages] update request for id', id, 'photo:', typeof photo === 'string' ? (photo.length > 100 ? '[dataURL]' : photo) : !!photo);
        let photoUrl = photo;

        if (typeof photo === 'string' && photo.startsWith('data:')) {
          // upload data URL to storage
          const match = photo.match(/^data:(.+);base64,(.+)$/);
          if (match) {
            const contentType = match[1];
            const base64Data = match[2];
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = contentType.split('/')[1] || 'png';
            const filename = `messages/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error: uploadError } = await supabaseClient.storage.from('messages').upload(filename, buffer, { contentType, upsert: false });
            if (!uploadError) {
              const { data: publicData } = supabaseClient.storage.from('messages').getPublicUrl(filename);
              if (publicData && publicData.publicUrl) {
                photoUrl = publicData.publicUrl;
              }
            } else {
              console.warn('Supabase storage upload failed (update)', uploadError);
            }
          }
        }

        try {
          const { data: updated, error: upErr } = await supabaseClient.from('messages').update({ photo: photoUrl }).eq('id', id).select();
          if (upErr) return res.status(500).json({ error: upErr.message });
          return res.status(200).json(updated && updated[0] ? updated[0] : updated);
        } catch (uErr) {
          console.error('[api/messages] update error', uErr);
          return res.status(500).json({ error: 'Failed to update photo' });
        }
      }

      if (!name || !message) return res.status(400).json({ error: 'name and message required' });
      // If Supabase client is configured, try to upload the photo to storage and insert record
      if (supabaseClient) {
        let photoUrl = photo;

        // If photo is a data URL, parse and upload to storage
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          const match = photo.match(/^data:(.+);base64,(.+)$/);
          if (match) {
            const contentType = match[1];
            const base64Data = match[2];
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = contentType.split('/')[1] || 'png';
            const filename = `messages/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error: uploadError } = await supabaseClient.storage.from('messages').upload(filename, buffer, { contentType, upsert: false });
            if (!uploadError) {
              const { data: publicData } = supabaseClient.storage.from('messages').getPublicUrl(filename);
              if (publicData && publicData.publicUrl) {
                photoUrl = publicData.publicUrl;
              }
            } else {
              console.warn('Supabase storage upload failed', uploadError);
            }
          }
        }

        const { data, error } = await supabaseClient.from('messages').insert([{ name, message, photo: photoUrl }]).select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }

      const arr = await readLocal();
      const id = Date.now();
      const newMsg = { id, name, message, photo, created_at: new Date().toISOString() };
      arr.push(newMsg);
      await writeLocal(arr);
      return res.status(201).json(newMsg);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save message' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

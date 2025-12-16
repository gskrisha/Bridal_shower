
  # Bridal Shower Celebration Website

  This is a code bundle for Bridal Shower Celebration Website. The original project is available at https://www.figma.com/design/fQqzesV02GXcIstcmxgDHV/Bridal-Shower-Celebration-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Messages backend & Vercel deployment

  This project includes a small serverless API at `/api/messages` to GET and POST messages. In production (Vercel) the function uses Supabase; locally it falls back to `data/messages.json`.

  Quick setup:

  1. Create a Supabase project and a table named `messages` with columns:
    - `id` (uuid or bigint primary key)
    - `name` (text)
    - `message` (text)
    - `photo` (text, optional — can hold a base64 data URL)
    - `created_at` (timestamp with time zone, default now())

  2. Note your Supabase URL and Service Role Key (or anon key). In Vercel set the environment variables:
    - `SUPABASE_URL` (e.g. https://xyz.supabase.co)
    - `SUPABASE_SERVICE_KEY` (Service Role key with write access)

  4. (Optional but recommended) Create a Supabase Storage bucket named `messages` and set it to public (or use signed URLs).
    - The serverless API will upload message photos to this bucket and save the public URL in the `photo` column.
    - If you don't provide a storage bucket or the upload fails, the API will still insert messages and may store base64 strings (not recommended for production).

  3. Deploy to Vercel (the `api/` folder contains serverless functions). You can run `vercel dev` locally to test serverless functions and `npm run vercel-dev` (if you have the Vercel CLI).

  Notes:
 - The form sends optional uploaded images as base64 data URLs. For production storage, we recommend using Supabase Storage and saving the storage URL in the `photo` column.
 - The `MessageCards` component fetches `/api/messages` and updates automatically when a new message is posted.
 
 Database setup & seeding
 
 1. Create the `messages` table using the SQL in `sql/create_messages_table.sql` (Supabase SQL editor is the easiest place to run it).
 
 2. Ensure you've created a Supabase Storage bucket called `messages` (public or accessible via signed URLs).
 
 3. Export these environment variables locally and in Vercel:
    - `SUPABASE_URL` e.g. `https://xxxx.supabase.co`
    - `SUPABASE_SERVICE_KEY` (service role key with write access) or `SUPABASE_ANON_KEY` for read-only.
 
 4. For client-side realtime and direct uploads (dev & production), set Vite-compatible env vars (recommended):
    - `VITE_SUPABASE_URL` (same as `SUPABASE_URL`)
    - `VITE_SUPABASE_ANON_KEY` (the public anon key — safe for client read + limited uploads)

    - Locally create a file named `.env` at the project root and add these VITE values (or copy `.env.example`).
    - In Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Project Settings -> Environment Variables.
 
 5. To upload all local photos and create message rows from them run:
    - `SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npm run seed:messages`
 
 The seed script will (attempt to) create the `messages` bucket if it doesn't exist, upload images from `src/app/components/img`, and insert rows into the `messages` table containing `name`, `message` and `photo` (public URL).

Client-side (development) setup

To let the browser upload images directly to Supabase Storage and to allow realtime updates:

1. Add these env vars in your Vercel project settings (or `.env` for local dev):
  - `VITE_SUPABASE_URL` (same as `SUPABASE_URL` but for client)
  - `VITE_SUPABASE_ANON_KEY` (anon public key; safe for client read + storage uploads if rules allow)

2. Ensure your Storage bucket `messages` has appropriate permissions. Using public bucket makes reads easy; for uploads you can configure RLS/policies or allow uploads from anon key depending on your security model.

Now the `MessageForm` will upload selected photos directly to the `messages` storage bucket and then POST the public URL to `/api/messages`. `MessageCards` also listens for realtime INSERT events and will show new messages instantly.
  
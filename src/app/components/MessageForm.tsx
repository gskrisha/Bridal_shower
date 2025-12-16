import { motion, useInView } from "framer-motion";
import { useRef, useState } from 'react';
import { Upload, Heart } from 'lucide-react';
import supabase from '../../lib/supabaseClient';

export function MessageForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare photo: if a file is selected and client supabase is available,
    // upload directly to Supabase Storage to avoid base64 payloads.
    const inputEl = document.getElementById('photo') as HTMLInputElement | null;
    const file = inputEl?.files?.[0];
    let photoUrl: string | undefined = undefined;
    // if upload to client-side storage fails, keep the original file to send to server API
    let serverSideFile: File | undefined = undefined;

    if (file && supabase) {
      // create a safe filename
      const ext = file.name.split('.').pop() || 'png';
      const filename = `messages/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      try {
        const { error: uploadError } = await supabase.storage.from('messages').upload(filename, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('messages').getPublicUrl(filename);
        photoUrl = publicData?.publicUrl;
        console.debug('[MessageForm] client storage upload success, photoUrl=', photoUrl);
      } catch (err) {
        console.error('Upload to Supabase storage failed, will send file to server for upload', err);
        serverSideFile = file;
      }
    }

    // helper: convert a File to a data URL for server upload
    const fileToDataUrl = (f: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(f);
    });

    try {
      // If client supabase is available, insert directly to DB (works during `vite dev`)
      if (supabase) {
        const { data, error } = await supabase.from('messages').insert([{ name: formData.name, message: formData.message, photo: photoUrl }]).select();
        if (error) {
          // If client insert failed (eg: RLS/permission), try server API fallback which uses service key to upload and insert
          console.warn('Supabase client insert failed, falling back to server API', error);

          const payload: any = { ...formData, photo: photoUrl };
          if (serverSideFile) payload.photo = await fileToDataUrl(serverSideFile);

          const r = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!r.ok) throw new Error('Server fallback failed');

          const inserted = await r.json();
          // Normalise to a single row (supabase rest returns arrays)
          const insertedRow = Array.isArray(inserted) ? inserted[0] : inserted;
          console.debug('[MessageForm] server fallback inserted row', insertedRow);
          setIsSuccess(true);
          window.dispatchEvent(new CustomEvent('messages:updated', { detail: insertedRow }));
        } else {
          setIsSuccess(true);
          // If we have his newly inserted row, dispatch it as detail so listeners can optimistically prepend
          const insertedRow = Array.isArray(data) ? data[0] : data;
          console.debug('[MessageForm] client insert returned row', insertedRow);

          // If the inserted row does not include a photo but we have a photoUrl from the upload,
          // request the server to update the row using service key (server can upload or accept URL)
          if (!insertedRow.photo && photoUrl) {
            try {
              const u = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: insertedRow.id, photo: photoUrl }),
              });
              if (u.ok) {
                const updated = await u.json();
                console.debug('[MessageForm] server updated inserted row with photo', updated);
                window.dispatchEvent(new CustomEvent('messages:updated', { detail: updated }));
              } else {
                console.warn('[MessageForm] server update photo failed', await u.text());
              }
            } catch (upErr) {
              console.error('[MessageForm] failed to request server photo update', upErr);
            }
          }

          window.dispatchEvent(new CustomEvent('messages:updated', { detail: insertedRow }));
        }
      } else {
        const payload: any = { ...formData, photo: photoUrl };
        // If we have a file that wasn't uploaded client-side, convert to data URL for server upload
        if (file && !photoUrl) payload.photo = await fileToDataUrl(file);

        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Failed to send');

        // Attempt to read the inserted row from the response and dispatch it
        const inserted = await res.json().catch(() => null);
        const insertedRow = Array.isArray(inserted) ? inserted[0] : inserted;
        console.debug('[MessageForm] server POST inserted row', insertedRow);
        setIsSuccess(true);
        window.dispatchEvent(new CustomEvent('messages:updated', { detail: insertedRow }));
      }
    } catch (err: any) {
      console.error('Send failed', err);
      setErrorMessage(err?.message || String(err));
    } finally {
      setIsSubmitting(false);
      // Reset form after a short delay
      setTimeout(() => {
        setFormData({ name: '', message: '' });
        setFileName('');
        setIsSuccess(false);
        setErrorMessage(null);
      }, 2000);
    }
  };

  return (
    <section ref={ref} className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-10 right-10 text-7xl opacity-10">💌</div>
      <div className="absolute bottom-10 left-10 text-7xl opacity-10">✉️</div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="text-6xl inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💌
          </motion.span>
          <h2 className="text-blue-700">
            Send Your Love
          </h2>
        </motion.div>

        <motion.p
          className="text-center text-blue-600 mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Share your warm wishes and memories for the beautiful bride 💙
        </motion.p>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-blue-200"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="text-blue-800 mb-3 flex items-center gap-2">
                <span>👤</span>
                <span>Your Name</span>
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-blue-50/50 text-blue-900"
                placeholder="Enter your name"
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="text-blue-800 mb-3 flex items-center gap-2">
                <span>✍️</span>
                <span>Your Message</span>
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-5 py-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-colors resize-none bg-blue-50/50 text-blue-900"
                placeholder="Share your heartfelt wishes for Lamia..."
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="photo" className="text-blue-800 mb-3 flex items-center gap-2">
                <span>📷</span>
                <span>Upload Photo (Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer transition-all bg-blue-50/50 hover:bg-blue-100/50 group"
                >
                  <Upload className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-700 font-medium">
                    {fileName || 'Choose a photo to share'}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-5 rounded-2xl text-white text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                isSuccess
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:shadow-2xl'
              }`}
              whileHover={!isSubmitting && !isSuccess ? { scale: 1.03, y: -2 } : {}}
              whileTap={!isSubmitting && !isSuccess ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Sending your love...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Heart className="w-6 h-6 fill-current" />
                  <span>Message Sent! 💙</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">💙</span>
                  <span>Send Love</span>
                  <span className="text-2xl">💙</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Backend connection note */}
          <motion.p
            className="text-xs text-blue-500 text-center mt-6 italic bg-blue-50 py-2 px-4 rounded-full inline-block w-full"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
          </motion.p>

          {/* Error / success feedback */}
          {errorMessage ? (
            <div className="mt-4 text-center text-sm text-red-600">{errorMessage}</div>
          ) : null}
        </motion.div>
        
        {/* Additional message */}
        <motion.p
          className="text-center mt-8 text-blue-600 italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          Your words will make her day even more special! ✨
        </motion.p>
      </div>
    </section>
  );
}
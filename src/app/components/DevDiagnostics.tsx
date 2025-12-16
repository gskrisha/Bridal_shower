import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Eye, EyeOff, X } from 'lucide-react';

export function DevDiagnostics() {
  const [visible, setVisible] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('pending');
  const [supabaseStatus, setSupabaseStatus] = useState<string>(supabase ? 'available' : 'missing');
  const viteUrl = import.meta.env.VITE_SUPABASE_URL ? true : false;
  const viteAnon = import.meta.env.VITE_SUPABASE_ANON_KEY ? true : false;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/messages');
        if (!mounted) return;
        if (!res.ok) setApiStatus(`error ${res.status}`);
        else setApiStatus('ok');
      } catch (err: any) {
        if (!mounted) return;
        setApiStatus(String(err?.message || err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed top-4 left-4 z-9999 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        style={{ zIndex: 9999 }}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      {/* Diagnostics panel */}
      {visible && (
        <div style={{ position: 'fixed', top: 8, left: 60, zIndex: 9998 }}>
          <div className="bg-white/90 backdrop-blur px-3 py-2 rounded shadow text-xs border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div><strong className="text-blue-700">Dev Diagnostics</strong></div>
              <button
                onClick={() => setVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
            <div>API: <span className={`font-mono ${apiStatus === 'ok' ? 'text-green-600' : 'text-red-600'}`}>{apiStatus}</span></div>
            <div>Supabase client: <span className={`font-mono ${supabaseStatus === 'available' ? 'text-green-600' : 'text-yellow-600'}`}>{supabaseStatus}</span></div>
            <div className="pt-1 text-xxs text-slate-600">
              <div>VITE_URL: <span className={`font-mono ${viteUrl ? 'text-green-600' : 'text-red-600'}`}>{viteUrl ? '✓' : '✗'}</span></div>
              <div>VITE_ANON: <span className={`font-mono ${viteAnon ? 'text-green-600' : 'text-red-600'}`}>{viteAnon ? '✓' : '✗'}</span></div>
            </div>
            {!viteUrl || !viteAnon ? (
              <div className="mt-1 text-xs text-yellow-700 border-t pt-1">
                Create <code>.env</code> file with VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
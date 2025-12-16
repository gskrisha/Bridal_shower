
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Global error handlers to surface runtime errors in the DOM (helps with white-screen debugging)
  function reportErrorToDOM(msg: string) {
    try {
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = `<div style="padding:24px;font-family:Inter,system-ui,Arial;background:#fff;color:#111"><h2 style=\"color:#b91c1c\">Runtime error</h2><pre style=\"white-space:pre-wrap;max-width:900px;overflow:auto\">${msg}</pre></div>`;
      }
    } catch (err) {
      // ignore
    }
  }

  window.addEventListener('error', (ev) => {
    console.error('Global error captured', ev.error || ev.message);
    reportErrorToDOM(String(ev.error?.stack || ev.message || ev.error));
  });
  window.addEventListener('unhandledrejection', (ev) => {
    console.error('Unhandled promise rejection', ev.reason);
    reportErrorToDOM(String(ev.reason?.stack || ev.reason || ev));
  });

  try {
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (err: any) {
    console.error('Render error', err);
    reportErrorToDOM(String(err?.stack || err));
  }
  
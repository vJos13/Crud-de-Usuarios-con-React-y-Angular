import { useEffect, useRef, useState } from 'react';
import { Code2, ExternalLink, RefreshCw, TerminalSquare } from 'lucide-react';
import { AngularLogo } from '../components/Logos.jsx';
import { ANGULAR_URL } from '../config.js';

// Muestra la aplicación Angular real (puerto 4200) dentro del panel.
// Se comunica con ella por postMessage: le envía el tema y recibe su altura.
function AngularCrud({ theme }) {
  const frameRef = useRef(null);
  const [status, setStatus] = useState('checking'); // checking | up | down
  const [height, setHeight] = useState(640);
  const [initialTheme] = useState(theme);
  const [attempt, setAttempt] = useState(0);

  // ¿Está corriendo el servidor de Angular?
  useEffect(() => {
    setStatus('checking');
    fetch(ANGULAR_URL, { mode: 'no-cors' })
      .then(() => setStatus('up'))
      .catch(() => setStatus('down'));
  }, [attempt]);

  // La app Angular avisa su altura para que el iframe no tenga scroll propio
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin === ANGULAR_URL && e.data?.type === 'crud-height') setHeight(e.data.height);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Si cambia el tema del panel, se lo enviamos a Angular
  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ type: 'theme', theme }, ANGULAR_URL);
  }, [theme]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1><AngularLogo style={{ width: 28, height: 28 }} /> CRUD con Angular</h1>
          <p className="page-sub"><Code2 /> Componentes standalone, signals, servicios e HttpClient · <code>angular-frontend/src/app</code></p>
        </div>
        <span className="chip angular">Angular 22 · :4200</span>
      </div>

      <div className="embed-bar">
        <span>
          Esta sección es la <strong>aplicación Angular real</strong> corriendo en su propio servidor e incrustada en el
          panel. Usa la misma API que React.
        </span>
        <a className="btn sm" href={ANGULAR_URL} target="_blank" rel="noreferrer">
          <ExternalLink /> Abrir aparte
        </a>
      </div>

      {status === 'down' ? (
        <div className="card embed-down">
          <TerminalSquare style={{ width: 32, height: 32, color: 'var(--muted)' }} />
          <h2>El servidor de Angular no está encendido</h2>
          <p>Inícialo en una terminal y vuelve a intentarlo:</p>
          <p><code>cd angular-frontend && npm start</code></p>
          <button className="btn primary" onClick={() => setAttempt((n) => n + 1)}>
            <RefreshCw /> Reintentar
          </button>
        </div>
      ) : status === 'up' ? (
        <iframe
          ref={frameRef}
          className="embed-frame"
          style={{ height }}
          src={`${ANGULAR_URL}/?embed=1&theme=${initialTheme}`}
          title="CRUD de usuarios hecho con Angular"
          onLoad={() => frameRef.current?.contentWindow?.postMessage({ type: 'theme', theme }, ANGULAR_URL)}
        />
      ) : (
        <p className="card empty">Conectando con Angular…</p>
      )}
    </>
  );
}

export default AngularCrud;

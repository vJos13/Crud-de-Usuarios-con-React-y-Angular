import { useEffect, useState } from 'react';
import { Menu, Moon, Plus, Sun } from 'lucide-react';
import { API_BASE } from '../../config.js';

// Comprueba cada 15 s si el backend responde
function useApiStatus() {
  const [online, setOnline] = useState(null);
  useEffect(() => {
    let alive = true;
    const check = () =>
      fetch(API_BASE)
        .then((r) => alive && setOnline(r.ok))
        .catch(() => alive && setOnline(false));
    check();
    const id = setInterval(check, 15000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  return online;
}

function Topbar({ theme, onToggleTheme, onOpenMenu }) {
  const online = useApiStatus();
  const label = online === null ? 'Comprobando API…' : online ? 'API conectada' : 'API desconectada';

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onOpenMenu} aria-label="Abrir menú">
        <Menu />
      </button>
      <span className="status-pill" role="status">
        <span className={`dot ${online === null ? '' : online ? 'on' : 'off'}`} />
        {label}
        <code className="hide-sm">{API_BASE.replace('http://', '')}</code>
      </span>
      <span className="topbar-spacer" />
      <a className="btn primary" href="#/react">
        <Plus /> <span className="hide-sm">Nuevo usuario</span>
      </a>
      <button
        className="icon-btn"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </button>
    </header>
  );
}

export default Topbar;

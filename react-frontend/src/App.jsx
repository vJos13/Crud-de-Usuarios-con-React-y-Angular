import { useState } from 'react';
import Footer from './components/layout/Footer.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useTheme } from './hooks/useTheme.js';
import AngularCrud from './pages/AngularCrud.jsx';
import ApiDocs from './pages/ApiDocs.jsx';
import Comparison from './pages/Comparison.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ReactCrud from './pages/ReactCrud.jsx';

const PAGES = {
  inicio: Dashboard,
  react: ReactCrud,
  angular: AngularCrud,
  comparativa: Comparison,
  api: ApiDocs,
};

// Componente raíz: estructura del panel (barra lateral + contenido)
function App() {
  const route = useHashRoute(Object.keys(PAGES), 'inicio');
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const Page = PAGES[route];

  return (
    <div className="shell">
      <Sidebar route={route} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className={`backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      <div className="main">
        <Topbar theme={theme} onToggleTheme={toggle} onOpenMenu={() => setMenuOpen(true)} />
        <main className="content">
          <Page theme={theme} />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;

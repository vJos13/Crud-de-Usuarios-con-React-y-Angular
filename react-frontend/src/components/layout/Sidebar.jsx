import { GitCompareArrows, LayoutDashboard, Server, UsersRound } from 'lucide-react';
import { AngularLogo, ReactLogo } from '../Logos.jsx';

// Secciones de la barra lateral, agrupadas
export const NAV = [
  { group: 'General', items: [{ id: 'inicio', label: 'Inicio', icon: LayoutDashboard }] },
  {
    group: 'CRUD de usuarios',
    items: [
      { id: 'react', label: 'CRUD React', icon: ReactLogo, tag: 'react' },
      { id: 'angular', label: 'CRUD Angular', icon: AngularLogo, tag: 'angular' },
    ],
  },
  {
    group: 'Documentación',
    items: [
      { id: 'comparativa', label: 'React vs Angular', icon: GitCompareArrows },
      { id: 'api', label: 'API REST y BD', icon: Server },
    ],
  },
];

function Sidebar({ route, open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Navegación principal">
      <a className="brand" href="#/inicio" onClick={onNavigate}>
        <span className="brand-logo"><UsersRound /></span>
        <span>
          <strong>Gestión de Usuarios</strong>
          <span>React · Angular · Node.js</span>
        </span>
      </a>

      <nav className="nav">
        {NAV.map((section) => (
          <div key={section.group} style={{ display: 'contents' }}>
            <p className="nav-group">{section.group}</p>
            {section.items.map(({ id, label, icon: Icon, tag }) => (
              <a
                key={id}
                href={`#/${id}`}
                className={route === id ? 'active' : ''}
                aria-current={route === id ? 'page' : undefined}
                onClick={onNavigate}
              >
                <Icon />
                {label}
                {tag && <span className={`tag ${tag}`}>{tag === 'react' ? ':5173' : ':4200'}</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <strong>Desarrollo de Aplicaciones Web</strong>
        Guía práctica · Semana 13
      </div>
    </aside>
  );
}

export default Sidebar;

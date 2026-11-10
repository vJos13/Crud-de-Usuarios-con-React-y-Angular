import { useMemo } from 'react';
import {
  ArrowRight, AtSign, Blocks, Braces, Clock, Container, Database, FileCode2, FormInput,
  GitBranch, Layers, ListChecks, Radio, Route, ServerCog, ShieldCheck, Sparkles, Syringe, Users, Zap,
} from 'lucide-react';
import { AngularLogo, ReactLogo } from '../components/Logos.jsx';
import { useUsers } from '../hooks/useUsers.js';
import { computeStats, formatDate } from '../utils/stats.js';

const FRAMEWORKS = [
  {
    id: 'react',
    name: 'React',
    version: 'React 19 · Vite 7 · JavaScript (JSX)',
    Logo: ReactLogo,
    desc: 'Biblioteca de componentes. La interfaz se describe con funciones que devuelven JSX y se vuelve a renderizar cuando cambia el estado.',
    concepts: [
      { icon: Blocks, title: 'Componentes funcionales', text: 'UserForm y UserList son funciones; el padre les pasa datos por props.' },
      { icon: Zap, title: 'Hooks: useState y useEffect', text: 'Guardan usuarios, formulario y mensajes; useEffect carga datos al montar.' },
      { icon: Sparkles, title: 'Hook personalizado', text: 'useUsers() encapsula la llamada a la API y el estado de carga.' },
      { icon: Layers, title: 'Estado derivado con useMemo', text: 'Las estadísticas y el filtro de búsqueda se recalculan solo si cambian los datos.' },
      { icon: Route, title: 'Callbacks hacia el padre', text: 'onSave, onEdit y onDelete suben las acciones de los hijos a la página.' },
    ],
    files: ['hooks/useUsers.js', 'services/userService.js', 'components/UserForm.jsx', 'components/UserList.jsx'],
  },
  {
    id: 'angular',
    name: 'Angular',
    version: 'Angular 22 · TypeScript · Angular CLI',
    Logo: AngularLogo,
    desc: 'Framework completo y tipado. Separa la lógica (clase TypeScript), la vista (plantilla HTML) y los servicios inyectables.',
    concepts: [
      { icon: Blocks, title: 'Componentes standalone', text: '@Component declara sus propios imports, sin NgModule.' },
      { icon: Radio, title: 'Signals y computed()', text: 'signal() guarda el estado; computed() deriva estadísticas y la búsqueda.' },
      { icon: Syringe, title: 'Inyección de dependencias', text: 'UserService y FormBuilder se obtienen con inject().' },
      { icon: GitBranch, title: 'HttpClient + RxJS', text: 'Cada petición devuelve un Observable al que el componente se suscribe.' },
      { icon: FormInput, title: 'Reactive Forms', text: 'FormBuilder y Validators (required, email) validan el formulario.' },
    ],
    files: ['user/user.ts', 'user/user.html', 'user/user.service.ts', 'user/user.model.ts'],
  },
];

const STACK = [
  { icon: ServerCog, title: 'Node.js + Express 5', text: 'API REST en /api/users con rutas, controladores y modelos.' },
  { icon: Database, title: 'mssql', text: 'Pool de conexiones y consultas parametrizadas contra inyección SQL.' },
  { icon: Container, title: 'SQL Server 2022', text: 'Base miapp_sql, tabla Users, corriendo en Docker.' },
  { icon: ShieldCheck, title: 'CORS + validación', text: 'Solo acepta localhost; valida nombre, correo y duplicados.' },
];

function Dashboard() {
  const { users, loading, error } = useUsers();
  const stats = useMemo(() => computeStats(users), [users]);
  const show = (v) => (loading ? '…' : error ? '—' : v);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Panel general</h1>
          <p className="page-sub"><Clock /> Un mismo backend, dos frameworks frontend · datos en vivo desde SQL Server</p>
        </div>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="hero-grid">
        <section className="card">
          <h2 className="card-title">¿Cómo está construida la aplicación?</h2>
          <p className="card-sub">Los dos frontends hacen las mismas operaciones CRUD contra la misma API.</p>
          <div className="flow">
            <div className="flow-col">
              <div className="flow-node"><strong><ReactLogo style={{ color: 'var(--react)' }} /> React</strong><span>:5173</span></div>
              <div className="flow-node"><strong><AngularLogo /> Angular</strong><span>:4200</span></div>
            </div>
            <div className="flow-arrow"><ArrowRight /></div>
            <div className="flow-node dark"><strong><Braces /> API Express</strong><span>:3001/api/users</span></div>
            <div className="flow-arrow"><ArrowRight /></div>
            <div className="flow-node"><strong><FileCode2 /> mssql</strong><span>@name, @email</span></div>
            <div className="flow-arrow"><ArrowRight /></div>
            <div className="flow-node"><strong><Database /> SQL Server</strong><span>miapp_sql.Users</span></div>
          </div>
          <p className="flow-note">
            Los frontends envían peticiones HTTP con JSON (<code>GET</code>, <code>POST</code>, <code>PUT</code>,{' '}
            <code>DELETE</code>). Express las recibe, el controlador valida los datos y el modelo ejecuta la
            consulta en SQL Server. Así se pueden comparar React y Angular con exactamente la misma lógica de negocio.
          </p>
        </section>

        <aside className="ink-panel" aria-label="Estadísticas">
          <div className="ink-row">
            <div>
              <p className="stat-label">Usuarios registrados</p>
              <p className="stat-value">{show(stats.total)}</p>
            </div>
            <span className="stat-icon"><Users /></span>
          </div>
          <div className="ink-row">
            <div>
              <p className="stat-label">Dominios de correo distintos</p>
              <p className="stat-value">{show(stats.domains)}</p>
            </div>
            <span className="stat-icon"><AtSign /></span>
          </div>
          <div className="ink-row">
            <div style={{ minWidth: 0 }}>
              <p className="stat-label">Último registro</p>
              <p className="stat-value">{show(stats.latest?.name ?? '—')}</p>
              <p className="stat-label" style={{ margin: '4px 0 0' }}>{formatDate(stats.latest?.created_at)}</p>
            </div>
            <span className="stat-icon"><ListChecks /></span>
          </div>
        </aside>
      </div>

      <h2 className="section-title">Cómo aplicamos cada framework</h2>
      <div className="fw-grid">
        {FRAMEWORKS.map(({ id, name, version, Logo, desc, concepts, files }) => (
          <article key={id} className="card fw-card">
            <div className="fw-head">
              <span className={`fw-logo ${id}`}><Logo /></span>
              <div>
                <h2>{name}</h2>
                <p>{version}</p>
              </div>
              <span className={`chip ${id}`} style={{ marginLeft: 'auto' }}>{id === 'react' ? ':5173' : ':4200'}</span>
            </div>
            <p className="fw-desc">{desc}</p>
            <ul className="concepts">
              {concepts.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="c-icon"><Icon /></span>
                  <div><strong>{title}</strong><span>{text}</span></div>
                </li>
              ))}
            </ul>
            <div className="files">{files.map((f) => <code key={f}>{f}</code>)}</div>
            <a className="btn primary" href={`#/${id}`}>Abrir CRUD {name} <ArrowRight /></a>
          </article>
        ))}
      </div>

      <h2 className="section-title">Backend compartido</h2>
      <div className="stack-grid">
        {STACK.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card stack-card">
            <Icon />
            <strong>{title}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;

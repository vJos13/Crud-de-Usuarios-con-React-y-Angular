import { GitCompareArrows } from 'lucide-react';
import { AngularLogo, ReactLogo } from '../components/Logos.jsx';

// Cómo resolvimos lo mismo en cada framework
const ROWS = [
  ['Lenguaje', 'JavaScript con JSX (HTML dentro de JS)', 'TypeScript + plantilla HTML separada'],
  ['Componente', 'Función que devuelve JSX: function UserList()', 'Clase con el decorador @Component (standalone)'],
  ['Estado', 'useState([])', 'signal<User[]>([])'],
  ['Estado derivado', 'useMemo(() => computeStats(users))', 'computed(() => …)'],
  ['Carga inicial', 'useEffect(() => reload(), [])', 'ngOnInit() { this.loadUsers() }'],
  ['Peticiones HTTP', 'fetch() con async/await en userService.js', 'HttpClient + Observables (RxJS) en UserService'],
  ['Servicios / DI', 'Se importan como módulos ES', 'inject(UserService) — inyección de dependencias'],
  ['Formularios', 'Controlados: value + onChange', 'Reactive Forms: FormBuilder + Validators'],
  ['Listas', 'users.map(u => <tr key={u.id}>)', '@for (user of users(); track user.id)'],
  ['Condicionales', 'cond && <p/> o ternario', '@if / @else en la plantilla'],
  ['Comunicación', 'Props y callbacks (onSave, onEdit…)', 'Plantilla enlazada a la clase: (click), [disabled]'],
  ['Herramienta', 'Vite (npm run dev)', 'Angular CLI (ng serve)'],
];

const SNIPPETS = [
  {
    title: 'Cargar usuarios desde la API',
    react: {
      file: 'hooks/useUsers.js',
      code: `const [users, setUsers] = useState([]);

const reload = useCallback(async () => {
  setLoading(true);
  try {
    setUsers(await getUsers());
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => { reload(); }, [reload]);`,
    },
    angular: {
      file: 'user/user.ts',
      code: `users = signal<User[]>([]);
private userService = inject(UserService);

ngOnInit() { this.loadUsers(); }

loadUsers() {
  this.loading.set(true);
  this.userService.getUsers().subscribe({
    next: (data) => this.users.set(data),
    complete: () => this.loading.set(false),
  });
}`,
    },
  },
  {
    title: 'Mostrar la lista en la tabla',
    react: {
      file: 'components/UserList.jsx',
      code: `<tbody>
  {filtered.map((user) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <button onClick={() => onEdit(user)}>
          Editar
        </button>
      </td>
    </tr>
  ))}
</tbody>`,
    },
    angular: {
      file: 'user/user.html',
      code: `<tbody>
  @for (user of filtered(); track user.id) {
    <tr>
      <td>{{ user.name }}</td>
      <td>{{ user.email }}</td>
      <td>
        <button (click)="edit(user)">
          Editar
        </button>
      </td>
    </tr>
  }
</tbody>`,
    },
  },
  {
    title: 'Búsqueda (estado derivado)',
    react: {
      file: 'components/UserList.jsx',
      code: `const [query, setQuery] = useState('');

const filtered = useMemo(() => {
  const q = query.toLowerCase();
  return users.filter((u) =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q));
}, [users, query]);`,
    },
    angular: {
      file: 'user/user.ts',
      code: `query = signal('');

filtered = computed(() => {
  const q = this.query().toLowerCase();
  return this.users().filter((u) =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q));
});`,
    },
  },
];

function Comparison() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>React vs Angular</h1>
          <p className="page-sub"><GitCompareArrows /> Las mismas funciones del CRUD resueltas con cada framework</p>
        </div>
      </div>

      <div className="card table-card" style={{ marginBottom: 28 }}>
        <div className="table-scroll" style={{ paddingTop: 12 }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th><span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><ReactLogo style={{ width: 16, color: '#58c4dc' }} /> React</span></th>
                <th><span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><AngularLogo style={{ width: 16 }} /> Angular</span></th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([concept, react, angular]) => (
                <tr key={concept}>
                  <td>{concept}</td>
                  <td className="muted">{react}</td>
                  <td className="muted">{angular}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {SNIPPETS.map(({ title, react, angular }) => (
        <section key={title}>
          <h2 className="section-title">{title}</h2>
          <div className="code-grid">
            <div className="card code-card">
              <div className="code-head">
                <span className="chip react">React</span><code>{react.file}</code>
              </div>
              <pre className="code">{react.code}</pre>
            </div>
            <div className="card code-card">
              <div className="code-head">
                <span className="chip angular">Angular</span><code>{angular.file}</code>
              </div>
              <pre className="code">{angular.code}</pre>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export default Comparison;

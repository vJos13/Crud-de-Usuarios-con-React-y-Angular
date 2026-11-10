import { useMemo, useState } from 'react';
import { Code2 } from 'lucide-react';
import { ReactLogo } from '../components/Logos.jsx';
import StatsStrip from '../components/StatsStrip.jsx';
import UserForm from '../components/UserForm.jsx';
import UserList from '../components/UserList.jsx';
import { useUsers } from '../hooks/useUsers.js';
import * as userService from '../services/userService.js';
import { computeStats } from '../utils/stats.js';

// Página con el CRUD completo hecho en React
function ReactCrud() {
  const { users, loading, error, reload } = useUsers();
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }
  const stats = useMemo(() => computeStats(users), [users]);

  // Crear / Actualizar
  const handleSave = async (data) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, data);
        setMessage({ type: 'ok', text: 'Usuario actualizado' });
        setEditingUser(null);
      } else {
        await userService.createUser(data);
        setMessage({ type: 'ok', text: 'Usuario creado' });
      }
      await reload();
      return true;
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  // Eliminar
  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
    try {
      await userService.deleteUser(user.id);
      if (editingUser?.id === user.id) setEditingUser(null);
      setMessage({ type: 'ok', text: `${user.name} fue eliminado` });
      await reload();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const alert = message ?? (error ? { type: 'error', text: error } : null);

  return (
    <>
      <div className="page-head">
        <div>
          <h1><ReactLogo style={{ width: 26, height: 26, color: 'var(--react)' }} /> CRUD con React</h1>
          <p className="page-sub"><Code2 /> Componentes funcionales, hooks y fetch · <code>react-frontend/src</code></p>
        </div>
        <span className="chip react">React 19 · :5173</span>
      </div>

      {alert && (
        <p className={`alert ${alert.type}`} role="status">
          {alert.text}
          {message && <button className="close" aria-label="Cerrar" onClick={() => setMessage(null)}>×</button>}
        </p>
      )}

      <StatsStrip stats={stats} loading={loading} />

      <div className="crud-grid">
        <UserForm editingUser={editingUser} onSave={handleSave} onCancel={() => setEditingUser(null)} />
        <UserList
          users={users}
          loading={loading}
          editingId={editingUser?.id}
          onEdit={setEditingUser}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default ReactCrud;

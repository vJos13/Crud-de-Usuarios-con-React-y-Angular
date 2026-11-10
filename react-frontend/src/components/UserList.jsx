import { useMemo, useState } from 'react';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { formatDate, initials } from '../utils/stats.js';

// Tabla de usuarios con búsqueda (estado derivado con useMemo)
function UserList({ users, loading, editingId, onEdit, onDelete }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <div className="card table-card">
      <div className="table-toolbar">
        <div>
          <h2 className="card-title">Usuarios</h2>
          <span className="muted" style={{ fontSize: '.8rem' }}>
            {loading ? 'Cargando…' : `${filtered.length} de ${users.length}`}
          </span>
        </div>
        <label className="search">
          <Search />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                 placeholder="Buscar por nombre o correo" aria-label="Buscar usuarios" />
        </label>
      </div>

      {loading ? (
        <p className="empty">Cargando usuarios…</p>
      ) : users.length === 0 ? (
        <p className="empty">Aún no hay usuarios. Crea el primero con el formulario.</p>
      ) : filtered.length === 0 ? (
        <p className="empty">Ningún usuario coincide con “{query}”.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className={editingId === user.id ? 'editing' : ''}>
                  <td className="muted">#{user.id}</td>
                  <td>
                    <span className="user-cell">
                      <span className="avatar">{initials(user.name)}</span>
                      {user.name}
                    </span>
                  </td>
                  <td className="muted">{user.email}</td>
                  <td className="muted">{formatDate(user.created_at)}</td>
                  <td>
                    <span className="row-actions">
                      <button className="btn sm" onClick={() => onEdit(user)} aria-label={`Editar a ${user.name}`}>
                        <Pencil /> Editar
                      </button>
                      <button className="btn sm ghost-danger" onClick={() => onDelete(user)} aria-label={`Eliminar a ${user.name}`}>
                        <Trash2 /> Eliminar
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;

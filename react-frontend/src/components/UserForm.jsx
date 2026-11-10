import { useEffect, useState } from 'react';
import { Save, UserPlus } from 'lucide-react';

const EMPTY = { name: '', email: '' };

// Formulario controlado para crear o editar un usuario
function UserForm({ editingUser, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  // Al elegir un usuario para editar, se cargan sus datos en el formulario
  useEffect(() => {
    setForm(editingUser ? { name: editingUser.name, email: editingUser.email } : EMPTY);
  }, [editingUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSave(form);
    setSaving(false);
    if (ok && !editingUser) setForm(EMPTY);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2 className="card-title">{editingUser ? `Editar usuario #${editingUser.id}` : 'Nuevo usuario'}</h2>
      <p className="card-sub" style={{ marginBottom: 4 }}>
        {editingUser ? 'Modifica los datos y guarda los cambios.' : 'Se guardará en SQL Server a través de la API.'}
      </p>

      <label htmlFor="name">Nombre</label>
      <input id="name" name="name" value={form.name} onChange={handleChange}
             required maxLength={100} placeholder="Ej. Ana Torres" autoComplete="off" />

      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
             required maxLength={150} placeholder="ana@example.com" autoComplete="off" />

      <div className="form-actions">
        {editingUser && (
          <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        )}
        <button type="submit" className="btn primary" disabled={saving}>
          {editingUser ? <Save /> : <UserPlus />}
          {saving ? 'Guardando…' : editingUser ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
      <p className="form-hint">Estado del formulario con <code>useState</code></p>
    </form>
  );
}

export default UserForm;

import { useState } from 'react';
import { Play, Server, ShieldCheck } from 'lucide-react';
import { API_BASE } from '../config.js';

const ENDPOINTS = [
  { method: 'GET', path: '/api/users', action: 'Listar todos los usuarios', status: '200' },
  { method: 'GET', path: '/api/users/:id', action: 'Obtener un usuario', status: '200 · 404' },
  { method: 'POST', path: '/api/users', action: 'Crear usuario', status: '201 · 400 · 409' },
  { method: 'PUT', path: '/api/users/:id', action: 'Actualizar usuario', status: '200 · 400 · 404 · 409' },
  { method: 'DELETE', path: '/api/users/:id', action: 'Eliminar usuario', status: '204 · 404' },
];

const COLUMNS = [
  ['id', 'INT IDENTITY', 'Clave primaria autoincremental'],
  ['name', 'NVARCHAR(100)', 'Obligatorio'],
  ['email', 'NVARCHAR(150)', 'Obligatorio y único'],
  ['created_at', 'DATETIME2', 'Fecha de registro (por defecto, la actual)'],
];

const MODEL_CODE = `// backend/models/userModel.js
await pool.request()
  .input('name',  sql.NVarChar(100), name)
  .input('email', sql.NVarChar(150), email)
  .query(\`INSERT INTO Users (name, email)
          OUTPUT INSERTED.*
          VALUES (@name, @email)\`);`;

function ApiDocs() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const tryIt = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      setResult(`HTTP ${res.status}\n\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>API REST y base de datos</h1>
          <p className="page-sub"><Server /> Express en <code>{API_BASE}</code> · SQL Server <code>miapp_sql</code></p>
        </div>
      </div>

      <div className="card table-card" style={{ marginBottom: 28 }}>
        <div className="table-toolbar">
          <div>
            <h2 className="card-title">Endpoints</h2>
            <span className="muted" style={{ fontSize: '.8rem' }}>Cuerpo de POST y PUT: {'{ "name": "...", "email": "..." }'}</span>
          </div>
          <button className="btn primary" onClick={tryIt} disabled={loading}>
            <Play /> {loading ? 'Consultando…' : 'Probar GET /api/users'}
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Método</th><th>Ruta</th><th>Acción</th><th>Respuestas</th></tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr key={e.method + e.path}>
                  <td><span className={`method ${e.method.toLowerCase()}`}>{e.method}</span></td>
                  <td><code>{e.path}</code></td>
                  <td>{e.action}</td>
                  <td className="muted" style={{ textAlign: 'right' }}>{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result && <pre className="code" style={{ maxHeight: 320 }}>{result}</pre>}
      </div>

      <div className="code-grid">
        <div className="card table-card">
          <div className="table-toolbar">
            <div>
              <h2 className="card-title">Tabla dbo.Users</h2>
              <span className="muted" style={{ fontSize: '.8rem' }}>backend/database/script.sql</span>
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Columna</th><th>Tipo</th><th>Detalle</th></tr></thead>
              <tbody>
                {COLUMNS.map(([col, type, detail]) => (
                  <tr key={col}>
                    <td><code>{col}</code></td>
                    <td className="muted">{type}</td>
                    <td className="muted" style={{ whiteSpace: 'normal', textAlign: 'right' }}>{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card code-card">
          <div className="code-head">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck style={{ width: 16 }} /> Consultas parametrizadas
            </span>
            <code>mssql</code>
          </div>
          <pre className="code">{MODEL_CODE}</pre>
          <p className="card-sub" style={{ padding: '14px 16px', margin: 0 }}>
            Los valores viajan como parámetros (<code>@name</code>, <code>@email</code>) y no se pegan dentro del
            texto SQL, así se evita la inyección SQL.
          </p>
        </div>
      </div>
    </>
  );
}

export default ApiDocs;

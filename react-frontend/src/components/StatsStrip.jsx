import { AtSign, Clock, Users } from 'lucide-react';
import { formatDate } from '../utils/stats.js';

// Franja oscura con las estadísticas calculadas de los usuarios
function StatsStrip({ stats, loading }) {
  const value = (v) => (loading ? '…' : v);
  return (
    <div className="stats">
      <div className="stat">
        <div>
          <p className="stat-label">Usuarios registrados</p>
          <p className="stat-value">{value(stats.total)}</p>
        </div>
        <span className="stat-icon"><Users /></span>
      </div>
      <div className="stat">
        <div>
          <p className="stat-label">Dominios de correo</p>
          <p className="stat-value">{value(stats.domains)}</p>
        </div>
        <span className="stat-icon"><AtSign /></span>
      </div>
      <div className="stat">
        <div style={{ minWidth: 0 }}>
          <p className="stat-label">Último registro</p>
          <p className="stat-value" title={stats.latest?.name}>
            {value(stats.latest ? stats.latest.name : '—')}
          </p>
        </div>
        <span className="stat-icon" title={formatDate(stats.latest?.created_at)}><Clock /></span>
      </div>
    </div>
  );
}

export default StatsStrip;

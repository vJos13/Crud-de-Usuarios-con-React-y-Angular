// Funciones puras para calcular estadísticas a partir de la lista de usuarios

export function computeStats(users) {
  const domains = new Set(users.map((u) => u.email.split('@')[1]));
  const latest = users.reduce(
    (acc, u) => (!acc || new Date(u.created_at) > new Date(acc.created_at) ? u : acc),
    null
  );
  return { total: users.length, domains: domains.size, latest };
}

export function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

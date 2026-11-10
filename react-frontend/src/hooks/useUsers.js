import { useCallback, useEffect, useState } from 'react';
import { getUsers } from '../services/userService.js';

// Hook personalizado: encapsula la carga de usuarios desde la API
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await getUsers());
      setError(null);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'No hay conexión con el backend (puerto 3001)' : err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { users, loading, error, reload };
}

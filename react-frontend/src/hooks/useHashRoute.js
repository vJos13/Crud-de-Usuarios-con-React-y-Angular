import { useEffect, useState } from 'react';

// Enrutador mínimo basado en el hash de la URL (#/react, #/angular, ...)
export function useHashRoute(validRoutes, fallback) {
  const read = () => {
    const route = window.location.hash.replace(/^#\/?/, '');
    return validRoutes.includes(route) ? route : fallback;
  };
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

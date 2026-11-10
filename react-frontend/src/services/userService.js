// Comunicación con la API REST del backend
import { API_BASE } from '../config.js';

const API_URL = `${API_BASE}/api/users`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const getUsers = () => request(API_URL);

export const createUser = (user) =>
  request(API_URL, { method: 'POST', body: JSON.stringify(user) });

export const updateUser = (id, user) =>
  request(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(user) });

export const deleteUser = (id) =>
  request(`${API_URL}/${id}`, { method: 'DELETE' });

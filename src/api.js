const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function api(path, { method = 'GET', body, token } = {}) {
  const savedToken = token || localStorage.getItem('notes-token') || localStorage.getItem('token');
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Can’t reach the API. Start the backend and check its MongoDB connection.');
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const message = result?.message || (response.status >= 500
      ? 'The API is unavailable. Check that the backend is running and MongoDB is connected.'
      : `Request failed (${response.status})`);
    throw new Error(message);
  }
  return result;
}

export const toList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

export const formatDate = (value) =>
  new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(value),
  );

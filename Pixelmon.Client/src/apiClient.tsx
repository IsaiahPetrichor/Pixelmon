const apiBaseUrl = import.meta.env.VITE_API_URL;
const authTokenKey = import.meta.env.VITE_AUTH_STORAGE_KEY;
const refreshTokenKey = `${authTokenKey}_refresh`;

let refreshRequest: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = sessionStorage.getItem(refreshTokenKey);
  if (!refreshToken) return false;

  const response = await fetch(`${apiBaseUrl}/AdminAuth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return false;

  const result: { token: string; refreshToken: string } = await response.json();
  sessionStorage.setItem(authTokenKey, result.token);
  sessionStorage.setItem(refreshTokenKey, result.refreshToken);
  return true;
}

export async function authenticatedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const request = () => {
    const headers = new Headers(init.headers);
    const token = sessionStorage.getItem(authTokenKey);
    if (token) headers.set('Authorization', `Bearer ${token}`);

    return fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  };

  const response = await request();
  if (response.status !== 401 || path === '/AdminAuth/refresh') return response;
  refreshRequest ??= refreshAccessToken().finally(() => {
    refreshRequest = null;
  });
  if (!(await refreshRequest)) return response;
  return await request();
}

export function storeAuthTokens(token: string, refreshToken: string) {
  sessionStorage.setItem(authTokenKey, token);
  sessionStorage.setItem(refreshTokenKey, refreshToken);
}

export function clearAuthTokens() {
  sessionStorage.removeItem(authTokenKey);
  sessionStorage.removeItem(refreshTokenKey);
}

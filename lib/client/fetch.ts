/*
  Lightweight client-side fetch helpers that rely on httpOnly cookies for auth.
  For unsafe methods, automatically send the x-csrf-token header from document.cookie (csrf_token).
*/

type JsonValue = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  [key: string]: any;
}

function getCsrfTokenFromCookies(cookieName: string = 'csrf_token'): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${encodeURIComponent(cookieName)}=`));
  if (!match) return null;
  const [, value] = match.split('=');
  try {
    return value ? decodeURIComponent(value) : null;
  } catch {
    return value || null;
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => ({})) : await response.text().catch(() => '');
  if (!response.ok) {
    const err: ApiResponse = typeof body === 'object' ? body : { success: false, error: { code: 'HTTP_ERROR', message: String(body || response.statusText) } };
    return err as ApiResponse<T>;
  }
  return (typeof body === 'object' ? body : { data: body }) as ApiResponse<T>;
}

function baseHeaders(isJson: boolean): HeadersInit {
  const headers: HeadersInit = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  return headers;
}

function csrfHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getCsrfTokenFromCookies();
  if (token) {
    return { ...headers, 'x-csrf-token': token } as HeadersInit;
  }
  return headers;
}

export async function apiGet<T = any>(url: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...(init.headers || {}), ...baseHeaders(false) },
    ...init,
  });
  return handleResponse<T>(resp);
}

export async function apiPost<T = any>(url: string, body?: JsonValue, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const isJson = body !== undefined && typeof body !== 'string' && !(body instanceof FormData);
  const requestBody = body instanceof FormData ? body : 
                     isJson ? JSON.stringify(body) : 
                     body !== undefined ? (body as BodyInit) : null;
  const resp = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: csrfHeaders({ ...(init.headers || {}), ...baseHeaders(isJson) }),
    body: requestBody,
    ...init,
  });
  return handleResponse<T>(resp);
}

export async function apiPut<T = any>(url: string, body?: JsonValue, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const isJson = body !== undefined && typeof body !== 'string' && !(body instanceof FormData);
  const requestBody = body instanceof FormData ? body : 
                     isJson ? JSON.stringify(body) : 
                     body !== undefined ? (body as BodyInit) : null;
  const resp = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: csrfHeaders({ ...(init.headers || {}), ...baseHeaders(isJson) }),
    body: requestBody,
    ...init,
  });
  return handleResponse<T>(resp);
}

export async function apiPatch<T = any>(url: string, body?: JsonValue, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const isJson = body !== undefined && typeof body !== 'string' && !(body instanceof FormData);
  const requestBody = body instanceof FormData ? body : 
                     isJson ? JSON.stringify(body) : 
                     body !== undefined ? (body as BodyInit) : null;
  const resp = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: csrfHeaders({ ...(init.headers || {}), ...baseHeaders(isJson) }),
    body: requestBody,
    ...init,
  });
  return handleResponse<T>(resp);
}

export async function apiDelete<T = any>(url: string, body?: JsonValue, init: RequestInit = {}): Promise<ApiResponse<T>> {
  const isJson = body !== undefined && typeof body !== 'string' && !(body instanceof FormData);
  const requestBody = body instanceof FormData ? body : 
                     isJson ? JSON.stringify(body) : 
                     body !== undefined ? (body as BodyInit) : null;
  const resp = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: csrfHeaders({ ...(init.headers || {}), ...baseHeaders(isJson) }),
    body: requestBody,
    ...init,
  });
  return handleResponse<T>(resp);
}

// Ensure a CSRF token cookie exists for unsafe requests (use in login/register pages)
export async function ensureCsrfCookie(): Promise<string | null> {
  const existing = getCsrfTokenFromCookies();
  if (existing) return existing;
  const res = await apiGet<{ token: string }>('/api/auth/csrf');
  if (res && (res as any).data?.token) return (res as any).data.token;
  return getCsrfTokenFromCookies();
}

// (Removed duplicated client fetch helpers to avoid duplicate symbol errors.)


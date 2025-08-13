import { NextRequest, NextResponse } from 'next/server';

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  cookieHeader.split(';').forEach(part => {
    const [k, ...rest] = part.trim().split('=');
    out[k ? decodeURIComponent(k) : ''] = decodeURIComponent(rest.join('='));
  });
  return out;
}

export function generateCsrfToken(): string {
  // 128-bit random token
  const buf = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    (crypto as Crypto).getRandomValues(buf);
  } else {
    for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: { headerName?: string; cookieName?: string }
) {
  const headerName = options?.headerName || 'x-csrf-token';
  const cookieName = options?.cookieName || 'csrf_token';

  return async (request: NextRequest): Promise<NextResponse> => {
    const method = request.method.toUpperCase();
    const cookies = parseCookies(request.headers.get('cookie'));
    const cookieToken = cookies[cookieName];

    // For unsafe methods, require header token to match cookie token
    if ([ 'POST', 'PUT', 'PATCH', 'DELETE' ].includes(method)) {
      const headerToken = request.headers.get(headerName) || '';
      if (!cookieToken || !headerToken || headerToken !== cookieToken) {
        return NextResponse.json(
          {
            success: false,
            error: { code: 'CSRF_INVALID', message: 'Invalid or missing CSRF token' }
          },
          { status: 403 }
        );
      }
      return handler(request);
    }

    // For safe methods, pass-through
    return handler(request);
  };
}


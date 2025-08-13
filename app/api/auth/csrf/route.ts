// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/security/csrf';

export async function GET(_request: NextRequest) {
  const token = generateCsrfToken();
  const resp = NextResponse.json({ success: true, data: { token } });
  try {
    resp.cookies.set('csrf_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });
  } catch {}
  return resp;
}


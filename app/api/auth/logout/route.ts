// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  const resp = NextResponse.json({ success: true, message: 'Logged out' });
  try {
    resp.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    resp.cookies.set('csrf_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    // Clear the auth status cookie
    resp.cookies.set('auth_status', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
  } catch {}
  return resp;
}


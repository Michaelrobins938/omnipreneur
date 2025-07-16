import { NextApiRequest, NextApiResponse } from 'next';
import { login, generateToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting for auth endpoints
    const rateLimitResult = await rateLimit(req, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5 // Stricter limit for auth
    });

    if (!rateLimitResult.success) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Attempt login
    const result = await login(email, password);

    if (!result.user) {
      return res.status(401).json({ 
        error: result.error || 'Invalid credentials',
        attempts: rateLimitResult.remaining
      });
    }

    // Generate JWT token
    const token = generateToken(result.user);

    // Set HTTP-only cookie for security
    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
      `user_id=${result.user.id}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    ]);

    // Return user data (without sensitive information)
    const userData = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      subscription: result.user.subscription,
      usage: result.user.usage
    };

    return res.status(200).json({
      success: true,
      user: userData,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 
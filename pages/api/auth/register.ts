import { NextApiRequest, NextApiResponse } from 'next';
import { register, generateToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting for auth endpoints
    const rateLimitResult = await rateLimit(req, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3 // Very strict limit for registration
    });

    if (!rateLimitResult.success) {
      return res.status(429).json({ error: 'Too many registration attempts. Please try again later.' });
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    // Attempt registration
    const result = await register({ email, password, name });

    if (!result.user) {
      return res.status(400).json({ 
        error: result.error || 'Registration failed',
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

    return res.status(201).json({
      success: true,
      user: userData,
      token,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration API error:', error);
    return res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' && typeof error === 'object' && error && 'message' in error ? (error as any).message : undefined
    });
  }
} 
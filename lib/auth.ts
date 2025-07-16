import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'premium';
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    expiresAt: Date;
    features: string[];
  };
  usage: {
    rewrites: number;
    contentPieces: number;
    bundles: number;
    affiliateLinks: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  user: User | null;
  error?: string;
}

// JWT Secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function auth(req: NextApiRequest): Promise<User | null> {
  try {
    const token = extractToken(req);
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await getUserById(decoded.userId);
    
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { user: null, error: 'Invalid credentials' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { user: null, error: 'Invalid credentials' };
    }

    return { user };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

export async function register(userData: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      return { user: null, error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email: userData.email,
      name: userData.name,
      role: 'user',
      subscription: {
        plan: 'free',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        features: ['basic_rewrite', 'basic_content']
      },
      usage: {
        rewrites: 0,
        contentPieces: 0,
        bundles: 0,
        affiliateLinks: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save user to database
    await saveUser(newUser);

    return { user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { user: null, error: 'Registration failed' };
  }
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function extractToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Database functions (placeholder - replace with actual database)
async function getUserById(id: string): Promise<User | null> {
  // TODO: Replace with actual database query
  const mockUser: User = {
    id,
    email: 'user@example.com',
    name: 'Test User',
    role: 'user',
    subscription: {
      plan: 'pro',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      features: ['unlimited_rewrite', 'unlimited_content', 'bundle_builder', 'affiliate_portal']
    },
    usage: {
      rewrites: 150,
      contentPieces: 75,
      bundles: 12,
      affiliateLinks: 8
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return mockUser;
}

async function getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  // TODO: Replace with actual database query
  const mockUser = {
    id: 'user-123',
    email,
    name: 'Test User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK6', // "password"
    role: 'user' as const,
    subscription: {
      plan: 'pro' as const,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      features: ['unlimited_rewrite', 'unlimited_content', 'bundle_builder', 'affiliate_portal']
    },
    usage: {
      rewrites: 150,
      contentPieces: 75,
      bundles: 12,
      affiliateLinks: 8
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return mockUser;
}

async function saveUser(user: User): Promise<void> {
  // TODO: Replace with actual database save
  console.log('Saving user:', user);
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Middleware for protecting routes
export function requireAuth(handler: Function) {
  return async (req: NextApiRequest, res: any) => {
    const user = await auth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Add user to request
    (req as any).user = user;
    return handler(req, res);
  };
}

// Check subscription limits
export async function checkUsageLimit(user: User, feature: string): Promise<boolean> {
  const limits = {
    free: {
      rewrites: 10,
      contentPieces: 5,
      bundles: 1,
      affiliateLinks: 3
    },
    pro: {
      rewrites: 1000,
      contentPieces: 500,
      bundles: 50,
      affiliateLinks: 100
    },
    enterprise: {
      rewrites: -1, // unlimited
      contentPieces: -1,
      bundles: -1,
      affiliateLinks: -1
    }
  };

  const plan = user.subscription.plan;
  const limit = limits[plan][feature as keyof typeof limits.free];
  const currentUsage = user.usage[feature as keyof typeof user.usage];

  return limit === -1 || currentUsage < limit;
}

// Update usage
export async function updateUsage(userId: string, feature: string): Promise<void> {
  // TODO: Replace with actual database update
  console.log(`Updating usage for user ${userId}, feature: ${feature}`);
} 
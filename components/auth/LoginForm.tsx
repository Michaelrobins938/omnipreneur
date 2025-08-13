'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { apiPost, ensureCsrfCookie } from '@/lib/client/fetch';

interface LoginFormProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await ensureCsrfCookie();
      const res = await apiPost<{ user: any }>(
        '/api/auth/login',
        { email, password }
      );

      if (!res || res.success === false) {
        const message = (res && res.error?.message) || res.error || 'Login failed';
        throw new Error(message);
      }

      const user = (res.data as any)?.user || (res as any).user;
      if (!user) throw new Error('Login failed - please check your credentials');

      if (onSuccess) onSuccess(user);

      const redirect = searchParams?.get('redirect');
      router.push(redirect && redirect.startsWith('/') ? redirect : '/dashboard');

    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-md mx-auto p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-zinc-400 mt-2">Sign in to your Omnipreneur account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-zinc-400">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/auth/register')}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </Card>
  );
} 
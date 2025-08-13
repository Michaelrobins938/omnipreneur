import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-925 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Omnipreneur AI Suite
          </h1>
          <p className="text-zinc-400">
            Unlock the power of AI-driven entrepreneurship
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
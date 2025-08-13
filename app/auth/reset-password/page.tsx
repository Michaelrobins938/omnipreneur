'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Lock,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: ''
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setValidating(false);
      setErrors(prev => ({ ...prev, general: 'Invalid reset link. Please request a new password reset.' }));
    }
  }, [searchParams]);

  const validateToken = async (tokenValue: string) => {
    try {
      const response = await fetch('/api/auth/reset-password/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenValue })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setIsValidToken(true);
      } else {
        setErrors(prev => ({ ...prev, general: result.error?.message || 'Invalid or expired reset token' }));
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to validate reset token' }));
    } finally {
      setValidating(false);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous errors
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
    
    // Real-time validation
    if (field === 'password') {
      const passwordError = validatePassword(value);
      if (passwordError) {
        setErrors(prev => ({ ...prev, password: passwordError }));
      }
    }
    
    if (field === 'confirmPassword' || (field === 'password' && formData.confirmPassword)) {
      const passwordToCheck = field === 'password' ? value : formData.password;
      const confirmPasswordToCheck = field === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPasswordToCheck && passwordToCheck !== confirmPasswordToCheck) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;
    
    // Validate form
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = formData.password !== formData.confirmPassword ? 'Passwords do not match' : '';
    
    if (passwordError || confirmPasswordError) {
      setErrors(prev => ({
        ...prev,
        password: passwordError,
        confirmPassword: confirmPasswordError
      }));
      return;
    }
    
    setLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=Password reset successful. Please log in with your new password.');
        }, 3000);
      } else {
        setErrors(prev => ({ ...prev, general: result.error?.message || 'Failed to reset password' }));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to reset password. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /(?=.*[a-z])/.test(password),
      /(?=.*[A-Z])/.test(password),
      /(?=.*\d)/.test(password),
      /(?=.*[@$!%*?&])/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;
    
    if (strength < 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (strength < 4) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-925 to-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-zinc-400">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-925 to-zinc-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Password Reset Successfully!
          </h1>
          
          <p className="text-zinc-400 mb-6">
            Your password has been updated. You can now log in with your new password.
          </p>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm">
              Redirecting to login page in a few seconds...
            </p>
          </div>
          
          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-925 to-zinc-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Invalid Reset Link
          </h1>
          
          <p className="text-zinc-400 mb-6">
            {errors.general || 'This password reset link is invalid or has expired.'}
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/forgot-password"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Request New Reset Link
            </Link>
            
            <Link
              href="/auth/login"
              className="block w-full px-6 py-3 border border-zinc-600 hover:border-zinc-500 text-zinc-300 font-semibold rounded-lg transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-925 to-zinc-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Reset Your Password
          </h1>
          
          <p className="text-zinc-400">
            Enter your new password below
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${
                    errors.password ? 'border-red-500' : 'border-zinc-600'
                  }`}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Password Strength</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength.level === 'strong' ? 'text-green-400' :
                      passwordStrength.level === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ 
                        width: `${
                          passwordStrength.level === 'strong' ? 100 :
                          passwordStrength.level === 'medium' ? 66 : 33
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 bg-zinc-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-zinc-600'
                  }`}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-zinc-300 mb-3">Password Requirements:</h4>
              <ul className="space-y-2">
                {[
                  { check: formData.password.length >= 8, text: 'At least 8 characters' },
                  { check: /(?=.*[a-z])/.test(formData.password), text: 'One lowercase letter' },
                  { check: /(?=.*[A-Z])/.test(formData.password), text: 'One uppercase letter' },
                  { check: /(?=.*\d)/.test(formData.password), text: 'One number' },
                  { check: /(?=.*[@$!%*?&])/.test(formData.password), text: 'One special character (@$!%*?&)' }
                ].map((requirement, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className={`w-4 h-4 mr-2 ${
                      requirement.check ? 'text-green-400' : 'text-zinc-500'
                    }`} />
                    <span className={requirement.check ? 'text-zinc-300' : 'text-zinc-500'}>
                      {requirement.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!errors.password || !!errors.confirmPassword || !formData.password || !formData.confirmPassword}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
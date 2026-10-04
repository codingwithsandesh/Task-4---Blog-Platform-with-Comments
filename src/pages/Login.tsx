import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      showToast('Logged in successfully! Welcome back.', 'success');
      navigate(redirectPath);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Sign in to manage your articles, drafts, and join discussions.
        </p>
      </div>

      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        {/* Demo Account Quick-Fill Card */}
        <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
            <span>Quick Test Accounts (Indian Edition Seed):</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo('aarav.sharma@blogsphere.in')}
              className="text-left px-3 py-1.5 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200/80 transition-colors flex items-center justify-between"
            >
              <span className="text-stone-800 font-medium">Aarav Sharma (Principal Architect / Admin)</span>
              <span className="text-[10px] text-stone-500 font-mono">Fill</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('ananya.deshmukh@blogsphere.in')}
              className="text-left px-3 py-1.5 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200/80 transition-colors flex items-center justify-between"
            >
              <span className="text-stone-800 font-medium">Ananya Deshmukh (DPI Researcher)</span>
              <span className="text-[10px] text-stone-500 font-mono">Fill</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-stone-500">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-semibold text-stone-900 hover:underline">
          Create free account
        </Link>
      </div>
    </div>
  );
};

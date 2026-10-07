import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Lock, Mail, Eye, EyeOff, Shield, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.name}!`);

      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@velvetbrew.com');
      setPassword('admin123');
      toast('Demo Admin credentials filled!', { icon: '👑' });
    } else {
      setEmail('sarah.jenkins@example.com');
      setPassword('customer123');
      toast('Demo Customer credentials filled!', { icon: '☕' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-gold-500/20 shadow-2xl space-y-6 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20">
            <Coffee className="w-6 h-6 text-coffee-950 stroke-[2.2]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Welcome to Velvet Brew
          </h1>
          <p className="text-xs text-cream-300">Sign in to manage orders, reservations & privileges</p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3 bg-coffee-900/80 rounded-2xl border border-coffee-800 space-y-2">
          <p className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider text-center">
            ⚡ Instant Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="px-3 py-1.5 rounded-lg bg-gold-500/15 border border-gold-500/30 text-gold-300 hover:bg-gold-500/25 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Fill Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('customer')}
              className="px-3 py-1.5 rounded-lg bg-coffee-800 border border-coffee-700 text-cream-200 hover:bg-coffee-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Fill Customer</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-400 hover:text-cream-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-cream-300">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-gold-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

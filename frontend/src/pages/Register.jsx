import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      toast.success(`Welcome to Velvet Brew, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-gold-500/20 shadow-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20">
            <Coffee className="w-6 h-6 text-coffee-950 stroke-[2.2]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Create an Account
          </h1>
          <p className="text-xs text-cream-300">
            Join the Velvet Brew community for order tracking & exclusive tastings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marcus Vance"
                className="w-full pl-10 pr-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="marcus@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Password (min 6 chars) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
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

          <div>
            <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Creating Profile...</span>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-cream-300">
          <span>Already have an account? </span>
          <Link to="/login" className="text-gold-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

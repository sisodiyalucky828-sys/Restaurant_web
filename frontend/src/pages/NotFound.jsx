import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-500/20 max-w-md w-full space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-coffee-900 border border-coffee-800 flex items-center justify-center mx-auto text-gold-400">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-5xl font-bold text-gold-400">404</h1>
          <h2 className="font-serif text-xl font-bold text-cream-50">Page Not Found</h2>
          <p className="text-xs text-cream-300">
            Looks like this brew didn't steep right. The page you are looking for doesn't exist or has moved.
          </p>
        </div>
        <div>
          <Link to="/" className="btn-gold text-xs uppercase px-6 py-2.5 inline-flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cafe Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

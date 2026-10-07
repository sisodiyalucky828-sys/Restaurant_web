import React from 'react';

const Badge = ({ status, type = 'status', className = '' }) => {
  const getStatusStyles = (st) => {
    switch (st?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'confirmed':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'preparing':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'ready':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'completed':
      case 'paid':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'admin':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/40 font-semibold';
      case 'customer':
        return 'bg-coffee-700/40 text-cream-200 border-coffee-600/30';
      default:
        return 'bg-coffee-800 text-cream-200 border-coffee-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
      {status}
    </span>
  );
};

export default Badge;

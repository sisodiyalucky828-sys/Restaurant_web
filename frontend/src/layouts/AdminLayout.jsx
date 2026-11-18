import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Users,
  ArrowLeft,
  LogOut,
  Coffee,
  Menu as MenuIcon,
  X,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Menu Management', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Reservations', path: '/admin/reservations', icon: Calendar },
    { name: 'User Directory', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0E0804] text-cream-100 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-coffee-950/95 border-r border-coffee-800/80 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Admin Brand */}
          <div className="flex items-center justify-between pb-6 border-b border-coffee-800/70">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-cream-50 leading-tight">
                  Lucky <span className="text-gold-400">Admin</span>
                </h1>
                <p className="text-[10px] text-cream-400 tracking-wider uppercase">Management Suite</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-cream-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30 shadow-sm'
                      : 'text-cream-300 hover:text-white hover:bg-coffee-900/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-gold-400/80" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-coffee-800/70 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs text-cream-300 hover:text-white hover:bg-coffee-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gold-400" />
            <span>Visit Customer Website</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-coffee-950/80 backdrop-blur-md border-b border-coffee-800/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-cream-300 hover:text-white hover:bg-coffee-900"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <span className="text-xs text-cream-400 hidden sm:inline">
              Store status: <span className="text-emerald-400 font-semibold">● Open & Serving</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-coffee-800 flex items-center justify-center text-xs font-bold text-gold-400 border border-gold-500/30">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-cream-100">{user?.name}</p>
                <p className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

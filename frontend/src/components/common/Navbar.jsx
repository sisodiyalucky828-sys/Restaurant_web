import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, Calendar, User, LogOut, Menu as MenuIcon, X, Shield, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-coffee-950/90 backdrop-blur-md border-b border-coffee-800/60 shadow-xl py-3'
          : 'bg-gradient-to-b from-coffee-950/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform duration-300">
            <Coffee className="w-5 h-5 text-coffee-950 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-cream-50 block leading-tight">
              LUCKY <span className="text-gold-400">CAFE</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-cream-300 uppercase block">
              Artisanal Roastery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-gold-400 bg-coffee-800/80 shadow-sm'
                    : 'text-cream-200 hover:text-white hover:bg-coffee-900/50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Reservation CTA Button */}
          <Link
            to="/reservation"
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Table</span>
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full text-cream-200 hover:text-white hover:bg-coffee-900/80 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-coffee-950 font-bold text-xs rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Profile / Auth Actions */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-coffee-900/80 border border-coffee-800 hover:border-gold-500/40 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-coffee-800 flex items-center justify-center text-gold-400 font-semibold text-xs border border-gold-500/30">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:inline text-xs font-medium text-cream-100 max-w-[90px] truncate">
                  {user?.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl border border-gold-500/20 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-coffee-800">
                    <p className="text-xs text-cream-300">Signed in as</p>
                    <p className="text-sm font-semibold text-cream-50 truncate">{user?.name}</p>
                    <p className="text-xs text-gold-400 truncate">{user?.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs text-gold-400 hover:bg-coffee-800/80 transition-colors font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-cream-200 hover:text-white hover:bg-coffee-800/80 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/my-reservations"
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-cream-200 hover:text-white hover:bg-coffee-800/80 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Reservations</span>
                  </Link>

                  <div className="border-t border-coffee-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-coffee-800 hover:bg-coffee-700 text-cream-50 border border-coffee-700 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-cream-200 hover:text-white hover:bg-coffee-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-coffee-950/95 backdrop-blur-xl border-b border-coffee-800 px-6 py-5 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-gold-400 bg-coffee-900 border border-gold-500/20'
                      : 'text-cream-200 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/reservation"
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-gold-500 text-coffee-950 font-bold text-sm tracking-wider uppercase mt-2 shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Table</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gold-400 bg-coffee-900/60 border border-gold-500/30 text-sm font-semibold"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

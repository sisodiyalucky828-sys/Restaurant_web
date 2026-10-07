import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    toast.success('Thank you for subscribing to Velvet Brew Insider! Check your inbox soon.');
    setEmail('');
  };

  return (
    <footer className="bg-[#0D0703] border-t border-coffee-800/80 text-cream-200 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-coffee-800/60">
          {/* Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5 text-coffee-950 stroke-[2.2]" />
              </div>
              <span className="font-serif text-2xl font-bold text-cream-50">
                VELVET <span className="text-gold-400">BREW</span>
              </span>
            </div>
            <p className="text-sm text-cream-300/80 leading-relaxed">
              Freshly brewed single-origin beans, handcrafted French pastries, and artisanal brunch served with passion in a serene, luxurious atmosphere.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-coffee-900 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:bg-coffee-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-coffee-900 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:bg-coffee-800 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-coffee-900 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:bg-coffee-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 tracking-wide uppercase mb-4 border-l-2 border-gold-500 pl-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">Home Experience</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold-400 transition-colors">Artisanal Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors">Our Coffee Craft</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold-400 transition-colors">Visual Gallery</Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-gold-400 transition-colors">Reserve a Table</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 tracking-wide uppercase mb-4 border-l-2 border-gold-500 pl-2">
              Opening Hours
            </h4>
            <div className="space-y-3 text-sm text-cream-300/90">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-cream-100">Monday - Friday</p>
                  <p className="text-xs text-cream-400">07:00 AM – 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-cream-100">Saturday - Sunday</p>
                  <p className="text-xs text-cream-400">08:00 AM – 11:00 PM</p>
                </div>
              </div>
              <div className="p-3 bg-coffee-900/60 rounded-xl border border-coffee-800/80 text-xs text-cream-300">
                <span className="text-gold-400 font-semibold">Kitchen Closes:</span> 45 minutes before cafe closing.
              </div>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-serif text-base font-semibold text-cream-50 tracking-wide uppercase mb-4 border-l-2 border-gold-500 pl-2">
              Stay Connected
            </h4>
            <div className="space-y-2.5 text-sm text-cream-300 mb-5">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>452 Roast Boulevard, Heritage Quarter</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+1 (555) 234-BREW (2739)</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>concierge@velvetbrew.com</span>
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <p className="text-xs text-cream-300">Subscribe for secret seasonal roasts & event invites:</p>
              <div className="flex items-center rounded-full bg-coffee-900/90 border border-coffee-800 p-1 focus-within:border-gold-500/50">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-transparent text-xs px-3 py-1.5 text-cream-100 placeholder-cream-400/50 focus:outline-none w-full"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-full bg-gold-500 text-coffee-950 hover:bg-gold-400 transition-colors flex-shrink-0"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400">
          <p>© {new Date().getFullYear()} Velvet Brew Cafe & Roastery. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Allergen Information</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

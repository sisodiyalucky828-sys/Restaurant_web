import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  Award,
  Heart,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import images from '../services/images';
import MenuCard from '../components/menu/MenuCard';
import ItemDetailModal from '../components/menu/ItemDetailModal';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/menu?sort=rating');
        if (res.data?.data) {
          // Select top 6 highest rated items
          setFeaturedItems(res.data.data.slice(0, 6));
        }
      } catch (err) {
        console.warn('Could not fetch featured menu from API, will load once backend starts:', err.message);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Coffee', count: '5 items', icon: '☕', desc: 'Single-origin espresso & roasts' },
    { name: 'Tea', count: '3 items', icon: '🍵', desc: 'Uji matcha & herbal blends' },
    { name: 'Cold Drinks', count: '3 items', icon: '🍹', desc: 'Cold brew & tropical fizz' },
    { name: 'Breakfast', count: '3 items', icon: '🥑', desc: 'Sourdough toast & brioche' },
    { name: 'Snacks', count: '3 items', icon: '🥐', desc: 'French croissants & fries' },
    { name: 'Desserts', count: '3 items', icon: '🍰', desc: 'Italian tiramisu & lava cake' },
    { name: 'Main Course', count: '3 items', icon: '🍝', desc: 'Truffle risotto & paninis' },
  ];

  const testimonials = [
    {
      name: 'Eleanor Vance',
      role: 'Food & Wine Critic',
      comment: 'The Velvet Double Espresso is an extraordinary revelation. Balanced acidity, rich hazelnut finish, and a tranquil atmosphere unmatched anywhere in the city.',
      rating: 5,
    },
    {
      name: 'Marcus Sterling',
      role: 'Architect & Regular Guest',
      comment: 'Between the warm amber lighting, flawless pour-over coffee, and freshly baked croissants, this is my everyday haven for morning focus and creative inspiration.',
      rating: 5,
    },
    {
      name: 'Dr. Sophia Bennett',
      role: 'Botanist & Tea Enthusiast',
      comment: 'Their ceremonial grade Japanese Matcha Latte is prepared with authentic bamboo whisk technique. Pure poetry in a cup. A must-visit cafe.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center -mt-20 pt-24 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={images.hero}
            alt="Velvet Brew Cafe Ambience"
            className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transform animate-pulse-subtle"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-coffee-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-coffee-950/40 to-coffee-950" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
          {/* Subtle Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-coffee-900/80 backdrop-blur-md border border-gold-500/30 text-gold-300 text-xs sm:text-sm font-medium shadow-xl">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Artisanal Coffee & Gourmet Bistro Experience</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream-50 leading-[1.1] tracking-tight">
            Freshly Brewed. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
              Beautifully Served.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-cream-200/90 max-w-2xl mx-auto font-light leading-relaxed">
            Immerse yourself in ethically sourced micro-lot roasts, velvety microfoam lattes, and artisan French pastries crafted by master baristas.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/menu"
              className="w-full sm:w-auto btn-gold text-sm tracking-wide uppercase px-8 py-3.5 flex items-center justify-center space-x-2 shadow-xl shadow-gold-500/20"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/reservation"
              className="w-full sm:w-auto btn-outline-gold text-sm tracking-wide uppercase px-8 py-3.5 flex items-center justify-center space-x-2 backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Table</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto border-t border-coffee-800/80 text-cream-300/80 text-xs">
            <div>
              <p className="font-serif text-xl sm:text-2xl font-bold text-gold-400">100%</p>
              <p className="text-[11px] uppercase tracking-wider text-cream-400">Arabica Beans</p>
            </div>
            <div>
              <p className="font-serif text-xl sm:text-2xl font-bold text-gold-400">4.9 ★</p>
              <p className="text-[11px] uppercase tracking-wider text-cream-400">Guest Rating</p>
            </div>
            <div>
              <p className="font-serif text-xl sm:text-2xl font-bold text-gold-400">Daily</p>
              <p className="text-[11px] uppercase tracking-wider text-cream-400">Fresh Bakes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Taste the Craftsmanship
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            Popular Categories
          </h2>
          <p className="text-sm text-cream-300/80 max-w-xl mx-auto">
            From sunrise roasts to moonlit decadent desserts, explore our thoughtfully curated offerings.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-coffee-800/90 border border-gold-500/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:border-gold-500/50 transition-all">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-cream-50 group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-cream-400 mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED MENU HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 pb-4 border-b border-coffee-800/80">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-1">
              Barista Recommendations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
              Featured Signatures
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-gold-400 hover:text-gold-300 mt-4 sm:mt-0 transition-colors"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-coffee-900/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <MenuCard key={item._id} item={item} onQuickView={(it) => setSelectedItem(it)} />
            ))}
          </div>
        )}
      </section>

      {/* 4. OUR STORY & CRAFTSMANSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 lg:p-16 border border-gold-500/20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              The Velvet Story
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream-50 leading-tight">
              Where Roasting Meets Pure Artistry.
            </h2>
            <p className="text-cream-200/90 text-sm sm:text-base leading-relaxed">
              Founded in 2021 by award-winning baristas, Velvet Brew was born out of an obsession with the subtle nuances of specialty coffee. Every batch of green coffee beans is sourced directly from sustainable high-altitude farms in Ethiopia, Colombia, and Sumatra.
            </p>
            <p className="text-cream-300/80 text-sm leading-relaxed">
              Roasted in micro-batches on our custom cast-iron drum roaster, we coax out notes of caramel blossom, dark stone fruits, and cocoa velvet before crafting them with precision steam into every cup.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-coffee-900/60 border border-coffee-800 flex items-start space-x-3">
                <Award className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-cream-50 uppercase tracking-wider">
                    Awarded Roaster
                  </h4>
                  <p className="text-xs text-cream-400 mt-0.5">Golden Bean Top Pick</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-coffee-900/60 border border-coffee-800 flex items-start space-x-3">
                <Heart className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-cream-50 uppercase tracking-wider">
                    Direct Trade
                  </h4>
                  <p className="text-xs text-cream-400 mt-0.5">Ethical farm partnerships</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/about" className="btn-outline-gold text-xs uppercase tracking-wider inline-flex items-center space-x-2">
                <span>Discover Our Heritage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gold-500/30 aspect-[4/3]">
              <img
                src={images.interior}
                alt="Cafe Interior Lounge"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Info Box */}
            <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-6 glass-panel rounded-2xl p-4 sm:p-5 border border-gold-500/40 shadow-2xl max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
                  ☕
                </div>
                <div>
                  <p className="text-xs font-semibold text-cream-50">Fresh Batch Daily</p>
                  <p className="text-[11px] text-gold-300">Roasted in Heritage Quarter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Loved by Coffee Connoisseurs
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            Guest Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex text-gold-400 space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>
                <p className="text-sm text-cream-200 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="border-t border-coffee-800 pt-4">
                <h4 className="font-serif text-base font-semibold text-cream-50">{t.name}</h4>
                <p className="text-xs text-gold-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AMBIENCE GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              The Velvet Atmosphere
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 mt-1">
              Visual Moments
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs uppercase tracking-wider font-semibold text-gold-400 hover:text-gold-300 mt-3 sm:mt-0 inline-flex items-center space-x-1.5"
          >
            <span>Explore Full Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.gallery.slice(0, 4).map((g, i) => (
            <div
              key={i}
              className="group relative h-64 rounded-2xl overflow-hidden glass-card border border-gold-500/10 cursor-pointer"
            >
              <img
                src={g.url}
                alt={g.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-xs text-gold-400 font-medium">{g.category}</p>
                  <p className="text-sm font-semibold text-cream-50">{g.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LOCATION & BOOKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-gold-500/30 p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
              Reserve Your Table Today
            </h2>
            <p className="text-sm text-cream-200/90 leading-relaxed">
              Planning a breakfast meeting, afternoon coffee date, or celebration dinner? Reserve your preferred table in our cozy indoor booth or outdoor sunlit patio.
            </p>
            <div className="pt-2">
              <Link
                to="/reservation"
                className="btn-gold px-8 py-3 text-xs uppercase tracking-wider font-bold inline-flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table Online</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default Home;

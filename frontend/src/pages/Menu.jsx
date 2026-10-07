import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Coffee, X, RotateCcw } from 'lucide-react';
import api from '../services/api';
import MenuCard from '../components/menu/MenuCard';
import ItemDetailModal from '../components/menu/ItemDetailModal';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    'All',
    'Coffee',
    'Tea',
    'Cold Drinks',
    'Breakfast',
    'Snacks',
    'Desserts',
    'Main Course',
  ];

  const tags = ['All', 'Signature', 'Bestseller', 'Artisanal', 'Healthy', 'Vegetarian', 'Organic'];

  // Keep state synced with URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        let url = `/menu?`;
        if (selectedCategory && selectedCategory !== 'All') {
          url += `category=${encodeURIComponent(selectedCategory)}&`;
        }
        if (searchQuery) {
          url += `search=${encodeURIComponent(searchQuery)}&`;
        }
        if (sortBy) {
          url += `sort=${sortBy}&`;
        }
        const res = await api.get(url);
        if (res.data?.data) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMenu();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('');
    setSelectedTag('All');
    setSearchParams({});
  };

  // Client-side tag filtering
  const filteredItems = items.filter((item) => {
    if (selectedTag === 'All') return true;
    return item.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
          Crafted with Precision
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-50">
          Our Artisanal Menu
        </h1>
        <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed">
          Explore single-origin espresso roasts, slow-steeped cold brews, organic teas, and freshly baked pastries.
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 shadow-lg shadow-gold-500/20 scale-105'
                : 'glass-card text-cream-200 hover:text-white hover:border-gold-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search, Tag Filter & Sort Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-coffee-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-cream-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, pastries, breakfast..."
              className="w-full pl-10 pr-10 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/50 focus:outline-none focus:border-gold-500/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-4 bg-coffee-900/90 border border-coffee-800 rounded-xl text-xs sm:text-sm text-cream-200 focus:outline-none focus:border-gold-500/60"
            >
              <option value="">Featured Sort</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Tag Filters & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-coffee-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-cream-400 mr-1">Tags:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-[11px] px-3 py-1 rounded-lg border transition-colors ${
                  selectedTag === tag
                    ? 'bg-gold-500/20 text-gold-300 border-gold-500/40 font-semibold'
                    : 'bg-coffee-900/40 text-cream-300 border-coffee-800 hover:border-coffee-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'All' || searchQuery || sortBy || selectedTag !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1 text-xs text-gold-400 hover:text-gold-300 transition-colors py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="glass-card rounded-2xl h-80 animate-pulse bg-coffee-900/50"
            />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onQuickView={(it) => setSelectedItem(it)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-coffee-900 border border-coffee-800 flex items-center justify-center text-cream-400 mx-auto">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-cream-50">No items match your criteria</h3>
          <p className="text-xs text-cream-300/80">
            Try adjusting your search terms, changing the category, or resetting all filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="btn-outline-gold text-xs uppercase px-5 py-2 inline-block"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default Menu;

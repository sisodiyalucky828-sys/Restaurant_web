import React, { useState } from 'react';
import { Sparkles, Maximize2, X } from 'lucide-react';
import images from '../services/images';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState(null);

  const categories = ['All', 'Ambience', 'Coffee', 'Pastries', 'Craft', 'Breakfast', 'Desserts'];

  const filteredPhotos =
    selectedCategory === 'All'
      ? images.gallery
      : images.gallery.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
          Atmosphere & Moments
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-50">
          The Visual Experience
        </h1>
        <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed">
          Glimpse into our serene espresso bar, aromatic roastery, sunlit booths, and handcrafted morning treats.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-gold-500 text-coffee-950 shadow-md font-bold'
                : 'glass-card text-cream-300 hover:text-white hover:border-gold-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setActivePhoto(photo)}
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden glass-card cursor-pointer border border-gold-500/15 shadow-lg"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-coffee-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              <div className="flex justify-end">
                <span className="p-2 rounded-full bg-coffee-950/80 text-gold-400 backdrop-blur-sm">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  {photo.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-cream-50 mt-2">
                  {photo.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-coffee-900/80 text-cream-200 hover:text-white border border-gold-500/30"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden glass-panel border border-gold-500/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 sm:p-6 bg-coffee-950 flex items-center justify-between border-t border-coffee-800">
              <div>
                <span className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                  {activePhoto.category}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="btn-outline-gold text-xs px-4 py-2"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

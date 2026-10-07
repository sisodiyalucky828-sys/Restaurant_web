import React from 'react';
import { Plus, Star, Clock, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MenuCard = ({ item, onQuickView }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.stopPropagation();
    if (item.available) {
      addToCart(item, 1);
    }
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(item)}
      className={`group glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer border ${
        item.available ? 'border-gold-500/15' : 'border-red-500/20 opacity-70'
      }`}
    >
      {/* Top Image Section */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-coffee-900">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-transparent to-black/20" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-coffee-950/80 backdrop-blur-md text-gold-300 border border-gold-500/30">
            {item.category}
          </span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            {item.tags.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500 text-coffee-950 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-coffee-950/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-coffee-900/90 text-cream-100 text-xs font-medium border border-gold-500/30 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            <span>View Details</span>
          </span>
        </div>

        {/* Prep Time & Rating at bottom of image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-cream-200">
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gold-400" />
            <span>{item.prepTime || '5-10 min'}</span>
          </span>
          <span className="flex items-center space-x-1 bg-coffee-950/70 px-2 py-0.5 rounded-md text-gold-400 font-semibold">
            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
            <span>{item.rating ? item.rating.toFixed(1) : '4.9'}</span>
          </span>
        </div>
      </div>

      {/* Item Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-cream-50 group-hover:text-gold-300 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-cream-300/80 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-coffee-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-cream-400 uppercase tracking-wider block">Price</span>
            <span className="text-lg font-serif font-bold text-gold-400">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {item.available ? (
            <button
              onClick={handleAdd}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 text-xs font-bold shadow-md hover:shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-rose-400 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

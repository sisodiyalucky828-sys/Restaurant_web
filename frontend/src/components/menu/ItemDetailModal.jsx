import React, { useState } from 'react';
import { Plus, Minus, Star, Clock, ShoppingBag } from 'lucide-react';
import Modal from '../common/Modal';
import { useCart } from '../../context/CartContext';

const ItemDetailModal = ({ item, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleAdd = () => {
    addToCart(item, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.name} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden h-60 md:h-72 bg-coffee-900 border border-gold-500/20">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-coffee-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-gold-400 border border-gold-500/30">
            {item.category}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-3 text-xs text-cream-300 mb-2">
              <span className="flex items-center space-x-1 text-gold-400">
                <Star className="w-4 h-4 fill-gold-400" />
                <span className="font-semibold">{item.rating || '4.9'} / 5.0</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-cream-400" />
                <span>Prep: {item.prepTime || '5-10 min'}</span>
              </span>
            </div>

            <p className="text-sm text-cream-200/90 leading-relaxed">{item.description}</p>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-coffee-800 text-gold-300 border border-gold-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-coffee-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-cream-300">Total Price</span>
              <span className="font-serif text-2xl font-bold text-gold-400">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Quantity Selector and Add Button */}
            {item.available ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-coffee-700 bg-coffee-900 rounded-full p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-full hover:bg-coffee-800 text-cream-300 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-semibold text-cream-50 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 rounded-full hover:bg-coffee-800 text-cream-300 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 btn-gold py-2.5 text-sm flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order</span>
                </button>
              </div>
            ) : (
              <div className="p-3 text-center bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
                This item is currently sold out. Please check back later.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ItemDetailModal;

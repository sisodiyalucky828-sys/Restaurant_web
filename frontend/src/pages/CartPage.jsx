import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Coffee, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, tax, total, totalItems } =
    useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-coffee-900 border border-coffee-800 flex items-center justify-center text-cream-400 mx-auto shadow-xl">
          <ShoppingBag className="w-10 h-10 text-gold-400" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-cream-50">Your Cart is Empty</h1>
          <p className="text-sm text-cream-300 max-w-sm mx-auto">
            You haven't added any coffees, pastries, or gourmet bites yet.
          </p>
        </div>
        <div>
          <Link
            to="/menu"
            className="btn-gold text-xs uppercase tracking-wider px-8 py-3.5 inline-flex items-center space-x-2"
          >
            <Coffee className="w-4 h-4" />
            <span>Explore Artisanal Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-coffee-800/80 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-cream-300 mt-1">
            Review your selected drinks and kitchen specials ({totalItems} {totalItems === 1 ? 'item' : 'items'}).
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center space-x-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="glass-panel rounded-2xl p-4 sm:p-5 border border-coffee-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Item Details */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-coffee-900 border border-gold-500/20 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gold-400 tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-cream-50 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm font-semibold text-gold-400 mt-1">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>

              {/* Quantity controls & Total */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-coffee-800">
                <div className="flex items-center border border-coffee-700 bg-coffee-900 rounded-full p-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 rounded-full text-cream-300 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs sm:text-sm font-bold text-cream-100 w-7 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 rounded-full text-cream-300 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <p className="font-serif text-base font-bold text-cream-50">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-cream-400 hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link
              to="/menu"
              className="text-xs uppercase tracking-wider font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center space-x-1.5"
            >
              <span>← Continue Ordering More Items</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/20 space-y-6">
          <h2 className="font-serif text-xl font-bold text-cream-50 border-b border-coffee-800 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-cream-300">
              <span>Subtotal</span>
              <span className="font-medium text-cream-100">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-cream-300">
              <span>Cafe Sales Tax (5%)</span>
              <span className="font-medium text-cream-100">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-coffee-800 pt-3 flex justify-between text-base font-bold">
              <span className="text-cream-50">Estimated Total</span>
              <span className="font-serif text-xl text-gold-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-gold py-3.5 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-coffee-800/80 space-y-2 text-[11px] text-cream-400">
            <p className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Prepared fresh upon order confirmation.</span>
            </p>
            <p>Dine-in, takeaway, and local delivery available on checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

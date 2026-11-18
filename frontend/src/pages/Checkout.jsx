import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, Coffee, Banknote, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, subtotal, tax, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    orderType: 'dine-in',
    tableNumber: '',
    address: '',
    specialInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_at_counter');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expDate: '12/28',
    cvv: '•••',
  });
  const [upiId, setUpiId] = useState('guest@okhdfcbank');
  const [loading, setLoading] = useState(false);

  // Delivery fee calculation
  const deliveryFee = customerDetails.orderType === 'delivery' ? 5.0 : 0.0;
  const finalTotal = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cream-50">No Items to Checkout</h2>
        <p className="text-sm text-cream-300">Your cart is empty. Please add items to proceed.</p>
        <Link to="/menu" className="btn-gold text-xs uppercase px-6 py-2.5 inline-block">
          Return to Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    if (customerDetails.orderType === 'delivery' && !customerDetails.address.trim()) {
      toast.error('Please enter a delivery address.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          menuItem: item.menuItem || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          orderType: customerDetails.orderType,
          tableNumber: customerDetails.tableNumber,
          address: customerDetails.address,
          specialInstructions: customerDetails.specialInstructions,
        },
        paymentMethod,
      };

      const res = await api.post('/orders', payload);

      if (res.data?.success) {
        toast.success('Order placed successfully!');
        const orderId = res.data.data._id;
        clearCart();
        navigate(`/order-success/${orderId}`, { state: { order: res.data.data } });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
          Order Checkout
        </h1>
        <p className="text-xs sm:text-sm text-cream-300">
          Please provide your dining preferences and contact details.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Dining Preference (Order Type) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-coffee-800 space-y-4">
            <h2 className="font-serif text-lg font-bold text-cream-50 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Dining Option</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'dine-in', label: 'Dine-In', icon: Coffee, desc: 'Served at table' },
                { type: 'takeaway', label: 'Takeaway', icon: CheckCircle2, desc: 'Counter pick-up' },
                { type: 'delivery', label: 'Delivery', icon: Truck, desc: '+$5.00 Flat rate' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setCustomerDetails({ ...customerDetails, orderType: opt.type })}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    customerDetails.orderType === opt.type
                      ? 'bg-gold-500/15 border-gold-500 text-gold-300 shadow-md shadow-gold-500/10'
                      : 'bg-coffee-900/60 border-coffee-800 text-cream-300 hover:border-coffee-700'
                  }`}
                >
                  <opt.icon className="w-5 h-5 mx-auto mb-1.5 text-gold-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">{opt.label}</p>
                  <p className="text-[10px] text-cream-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            {customerDetails.orderType === 'dine-in' && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Table Number (Optional if already seated)
                </label>
                <input
                  type="text"
                  value={customerDetails.tableNumber}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, tableNumber: e.target.value })}
                  placeholder="e.g. Table 04 or Patio-02"
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            )}

            {customerDetails.orderType === 'delivery' && (
              <div className="pt-2 space-y-1">
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows="3"
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                  placeholder="Street address, building, apartment/suite number, access code..."
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* 2. Customer Contact */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-coffee-800 space-y-4">
            <h2 className="font-serif text-lg font-bold text-cream-50 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  placeholder="8839715938"
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Barista / Kitchen Notes
                </label>
                <input
                  type="text"
                  value={customerDetails.specialInstructions}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, specialInstructions: e.target.value })}
                  placeholder="Extra hot, oat milk, sugar on side..."
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method (Structured for Stripe / Razorpay Gateways) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-coffee-800 space-y-4">
            <h2 className="font-serif text-lg font-bold text-cream-50 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'cash_at_counter', label: 'Cash / At Counter', icon: Banknote, desc: 'Pay when picking up' },
                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Stripe Gateway Ready' },
                { id: 'upi', label: 'Instant Pay / UPI', icon: ShieldCheck, desc: 'Razorpay Gateway Ready' },
              ].map((pm) => (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === pm.id
                      ? 'bg-gold-500/15 border-gold-500 text-gold-300 shadow-md'
                      : 'bg-coffee-900/60 border-coffee-800 text-cream-300 hover:border-coffee-700'
                  }`}
                >
                  <pm.icon className="w-5 h-5 mb-2 text-gold-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">{pm.label}</p>
                  <p className="text-[10px] text-cream-400 mt-0.5">{pm.desc}</p>
                </button>
              ))}
            </div>

            {/* Gateway Placeholders */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-coffee-900/90 rounded-2xl border border-coffee-800 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-cream-300">
                  <span className="font-semibold text-gold-400">Card Payment Gateway Integration</span>
                  <span>🔒 256-bit SSL</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    disabled
                    value={cardInfo.cardNumber}
                    className="col-span-2 px-3 py-2 bg-coffee-950 border border-coffee-800 rounded-lg text-xs text-cream-200"
                  />
                  <input
                    type="text"
                    disabled
                    value={cardInfo.expDate}
                    className="px-3 py-2 bg-coffee-950 border border-coffee-800 rounded-lg text-xs text-cream-200 text-center"
                  />
                </div>
                <p className="text-[11px] text-cream-400">
                  Card processing architecture is initialized. Charges will confirm upon placing order.
                </p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-coffee-900/90 rounded-2xl border border-coffee-800 space-y-2 animate-fade-in">
                <span className="text-xs font-semibold text-gold-400">UPI / QR Code Checkout</span>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  className="w-full px-3 py-2 bg-coffee-950 border border-coffee-800 rounded-lg text-xs text-cream-200"
                />
                <p className="text-[11px] text-cream-400">Payment request will be simulated on confirmation.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/20 space-y-6">
          <h2 className="font-serif text-xl font-bold text-cream-50 border-b border-coffee-800 pb-3">
            Review Order
          </h2>

          {/* Item Summaries */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 rounded-full bg-coffee-800 text-gold-400 flex items-center justify-center font-bold text-[10px]">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-cream-100 max-w-[170px] truncate">{item.name}</span>
                </div>
                <span className="text-cream-300 font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculation */}
          <div className="border-t border-coffee-800 pt-4 space-y-2.5 text-xs text-cream-300">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-cream-100 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cafe Sales Tax (5%)</span>
              <span className="text-cream-100 font-medium">${tax.toFixed(2)}</span>
            </div>
            {customerDetails.orderType === 'delivery' && (
              <div className="flex justify-between text-gold-400">
                <span>Courier Delivery</span>
                <span>$5.00</span>
              </div>
            )}
            <div className="border-t border-coffee-800 pt-3 flex justify-between text-sm sm:text-base font-bold">
              <span className="text-cream-50">Total Amount</span>
              <span className="font-serif text-xl text-gold-400">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order (${finalTotal.toFixed(2)})</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-cream-400">
            By placing your order, you agree to Lucky Cafe terms and privacy policy.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Coffee, AlertCircle, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-coffee-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream-50">My Orders</h1>
          <p className="text-xs sm:text-sm text-cream-300 mt-1">
            Track real-time status and view order receipts from Velvet Brew Cafe.
          </p>
        </div>
        <Link to="/menu" className="btn-gold text-xs uppercase px-5 py-2.5 inline-flex items-center space-x-2">
          <Coffee className="w-3.5 h-3.5" />
          <span>New Order</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-36 animate-pulse bg-coffee-900/50" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-panel rounded-2xl p-5 sm:p-6 border border-coffee-800 space-y-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-coffee-800/80 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-gold-400">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-xs text-cream-400">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge status={order.orderStatus} />
                  <Badge status={order.paymentStatus} />
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {order.items?.map((it, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-coffee-900 text-gold-400 flex items-center justify-center font-bold text-[10px]">
                      {it.quantity}x
                    </span>
                    <span className="text-cream-200 truncate">{it.name}</span>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between pt-2 border-t border-coffee-800/80 text-xs">
                <div className="text-cream-400">
                  <span>Type: </span>
                  <strong className="text-cream-200 capitalize">
                    {order.customerDetails?.orderType || 'Dine-in'}
                  </strong>
                  {order.customerDetails?.tableNumber && (
                    <span> • {order.customerDetails.tableNumber}</span>
                  )}
                </div>
                <div>
                  <span className="text-cream-400 mr-2">Total:</span>
                  <span className="font-serif text-base font-bold text-gold-400">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <ShoppingBag className="w-12 h-12 text-cream-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-cream-50">No Orders Yet</h3>
          <p className="text-xs text-cream-300">
            You haven't placed any orders with us yet. Visit the menu to treat yourself!
          </p>
          <Link to="/menu" className="btn-gold text-xs uppercase px-6 py-2.5 inline-block">
            Explore Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

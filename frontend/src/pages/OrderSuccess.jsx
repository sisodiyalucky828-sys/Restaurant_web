import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Clock, ArrowRight, Coffee, Printer } from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data?.data) {
            setOrder(res.data.data);
          }
        } catch (err) {
          console.error('Failed to fetch order details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gold-500 mx-auto"></div>
        <p className="text-xs text-cream-300 mt-4">Retrieving your order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-500/30 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Order Confirmed #{id?.slice(-6).toUpperCase() || 'VB-2025'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-cream-300 max-w-md mx-auto">
            Our baristas and kitchen have received your ticket and are preparing your items with artisanal care.
          </p>
        </div>

        {order && (
          <div className="bg-coffee-900/80 rounded-2xl p-6 border border-coffee-800 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-coffee-800 pb-3 gap-2">
              <div>
                <p className="text-xs text-cream-400">Order Status</p>
                <Badge status={order.orderStatus || 'Pending'} className="mt-1" />
              </div>
              <div>
                <p className="text-xs text-cream-400">Service Type</p>
                <p className="text-xs font-semibold text-cream-100 uppercase mt-1">
                  {order.customerDetails?.orderType || 'Dine-in'}
                  {order.customerDetails?.tableNumber && ` (${order.customerDetails.tableNumber})`}
                </p>
              </div>
              <div>
                <p className="text-xs text-cream-400">Customer</p>
                <p className="text-xs font-semibold text-cream-100 mt-1">
                  {order.customerDetails?.name}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold uppercase text-gold-400 tracking-wider">Ordered Items</p>
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 border-b border-coffee-800/40">
                  <span className="text-cream-200">
                    <strong className="text-gold-400">{it.quantity}x</strong> {it.name}
                  </span>
                  <span className="font-semibold text-cream-100">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 flex justify-between text-sm font-bold border-t border-coffee-800">
              <span className="text-cream-200">Total Paid / Due</span>
              <span className="font-serif text-lg text-gold-400">${order.total?.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/menu"
            className="btn-gold text-xs uppercase tracking-wider px-6 py-2.5 inline-flex items-center space-x-2"
          >
            <Coffee className="w-4 h-4" />
            <span>Order Something Else</span>
          </Link>

          <Link
            to="/my-orders"
            className="btn-outline-gold text-xs uppercase tracking-wider px-6 py-2.5 inline-flex items-center space-x-2"
          >
            <span>Track in My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

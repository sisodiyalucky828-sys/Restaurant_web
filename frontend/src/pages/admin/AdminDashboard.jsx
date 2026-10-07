import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Phone,
  CheckCircle2,
  XCircle,
  Bell,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [notifData, setNotifData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, notifRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/notifications'),
        ]);
        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
        if (notifRes.data?.data) {
          setNotifData(notifRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-32 animate-pulse bg-coffee-900/40" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      desc: 'Gross confirmed sales',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10 border-gold-500/30',
      desc: 'Lifetime guest tickets',
    },
    {
      title: 'Registered Users',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/30',
      desc: 'Active customer accounts',
    },
    {
      title: 'Menu Catalog',
      value: stats?.totalMenuItems || 0,
      icon: UtensilsCrossed,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
      desc: 'Active kitchen & drink items',
    },
  ];

  // Format a date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-coffee-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Managerial Overview
          </h1>
          <p className="text-xs text-cream-300 mt-1">
            Real-time analytics, revenue metrics, orders queue, and table reservations.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/admin/menu"
            className="btn-gold text-xs uppercase px-4 py-2 inline-flex items-center space-x-1.5 font-bold"
          >
            <span>+ Add Menu Item</span>
          </Link>
        </div>
      </div>

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="glass-panel rounded-2xl p-5 border border-coffee-800 flex items-center justify-between hover:border-gold-500/40 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-cream-300 uppercase tracking-wider">
                {card.title}
              </p>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mt-1.5">
                {card.value}
              </p>
              <p className="text-[10px] text-cream-400 mt-1">{card.desc}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.bg} ${card.color}`}
            >
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Order Status Breakdown Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-coffee-800 space-y-4">
        <h3 className="font-serif text-base font-bold text-cream-50">
          Order Pipeline Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(stats?.statusCounts || {}).map(([status, count]) => (
            <div
              key={status}
              className="p-3 bg-coffee-900/70 rounded-xl border border-coffee-800 flex flex-col justify-between"
            >
              <span className="text-[11px] text-cream-400">{status}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold text-cream-100">{count}</span>
                <Badge status={status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Orders & Reservations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-coffee-800 space-y-4">
          <div className="flex items-center justify-between border-b border-coffee-800 pb-3">
            <h3 className="font-serif text-base font-bold text-cream-50 flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span>Recent Orders</span>
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentOrders?.map((ord) => (
              <div
                key={ord._id}
                className="p-3 bg-coffee-900/50 rounded-xl border border-coffee-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gold-400">
                      #{ord._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="font-semibold text-cream-100">{ord.customerDetails?.name}</span>
                  </div>
                  <p className="text-[11px] text-cream-400 mt-0.5">
                    {ord.items?.length} items • {ord.customerDetails?.orderType || 'Dine-in'}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-cream-50">${ord.total?.toFixed(2)}</p>
                  <Badge status={ord.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-coffee-800 space-y-4">
          <div className="flex items-center justify-between border-b border-coffee-800 pb-3">
            <h3 className="font-serif text-base font-bold text-cream-50 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Table Bookings</span>
            </h3>
            <Link
              to="/admin/reservations"
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentReservations?.map((resv) => (
              <div
                key={resv._id}
                className="p-3 bg-coffee-900/50 rounded-xl border border-coffee-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-cream-100">{resv.name}</p>
                  <p className="text-[11px] text-cream-400 mt-0.5">
                    {resv.date} at {resv.time} • {resv.guests} guests
                  </p>
                </div>
                <Badge status={resv.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SMS Notifications Status Card */}
      {notifData && (
        <div className="glass-panel rounded-2xl p-6 border border-coffee-800 space-y-5">
          <div className="flex items-center justify-between border-b border-coffee-800 pb-3">
            <h3 className="font-serif text-base font-bold text-cream-50 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gold-400" />
              <span>SMS Notifications</span>
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                notifData.smsEnabled
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              }`}
            >
              {notifData.smsEnabled ? '● Active' : '○ Disabled'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Owner Phone */}
            <div className="p-4 bg-coffee-900/70 rounded-xl border border-coffee-800 space-y-2">
              <div className="flex items-center space-x-2 text-cream-400">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Owner Phone</span>
              </div>
              <p className="text-sm font-mono font-bold text-cream-100">{notifData.ownerPhone}</p>
            </div>

            {/* SMS Provider */}
            <div className="p-4 bg-coffee-900/70 rounded-xl border border-coffee-800 space-y-2">
              <div className="flex items-center space-x-2 text-cream-400">
                <Bell className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">SMS Provider</span>
              </div>
              <p className="text-sm font-bold text-cream-100 capitalize">{notifData.smsProvider}</p>
            </div>

            {/* Sent Count */}
            <div className="p-4 bg-coffee-900/70 rounded-xl border border-coffee-800 space-y-2">
              <div className="flex items-center space-x-2 text-cream-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">SMS Sent</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <p className="text-xl font-bold text-emerald-400">{notifData.notificationStats?.sent || 0}</p>
                {(notifData.notificationStats?.failed || 0) > 0 && (
                  <span className="text-[10px] text-rose-400 font-semibold">
                    {notifData.notificationStats.failed} failed
                  </span>
                )}
              </div>
            </div>

            {/* Last Notification */}
            <div className="p-4 bg-coffee-900/70 rounded-xl border border-coffee-800 space-y-2">
              <div className="flex items-center space-x-2 text-cream-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Last Notification</span>
              </div>
              {notifData.lastNotification ? (
                <div>
                  <p className="text-xs font-semibold text-cream-100">
                    {notifData.lastNotification.customerName}
                  </p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    {notifData.lastNotification.status === 'sent' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-400" />
                    )}
                    <span className="text-[10px] text-cream-400">
                      {formatDate(notifData.lastNotification.sentAt || notifData.lastNotification.orderDate)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-cream-400">No notifications yet</p>
              )}
            </div>
          </div>

          {!notifData.smsEnabled && (
            <p className="text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
              💡 SMS notifications are currently disabled. Set <code className="font-mono text-amber-300">SMS_ENABLED=true</code> in your backend <code className="font-mono text-amber-300">.env</code> file and add valid Twilio credentials to start receiving order alerts.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


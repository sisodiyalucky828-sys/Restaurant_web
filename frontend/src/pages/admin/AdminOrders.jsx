import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  Truck,
  Coffee,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Completed',
    'Cancelled',
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders?';
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      const res = await api.get(url);
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  // Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coffee-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Order Management
          </h1>
          <p className="text-xs text-cream-300 mt-1">
            Track kitchen orders, manage dining tickets, and update delivery statuses.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-coffee-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-coffee-900 border border-coffee-800 rounded-xl text-xs text-cream-100 placeholder-cream-400/50 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-gold-500 text-coffee-950 font-bold'
                  : 'bg-coffee-900 text-cream-300 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl border border-coffee-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-coffee-900/90 text-cream-400 uppercase tracking-wider text-[10px] border-b border-coffee-800">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-cream-400">
                    Loading guest orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-coffee-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-gold-400">
                        #{ord._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-cream-400">
                        {new Date(ord.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-cream-100">{ord.customerDetails?.name}</p>
                      <p className="text-[10px] text-cream-400">{ord.customerDetails?.phone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize font-medium text-cream-200">
                        {ord.customerDetails?.orderType || 'dine-in'}
                      </span>
                      {ord.customerDetails?.tableNumber && (
                        <span className="block text-[10px] text-gold-400">
                          {ord.customerDetails.tableNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-cream-100">
                      {ord.items?.length} items
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-gold-400">
                      ${ord.total?.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={ord.paymentStatus} />
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="py-1 px-2.5 bg-coffee-900 border border-coffee-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-gold-500 font-medium"
                      >
                        {statuses.filter((s) => s !== 'All').map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-coffee-900 text-cream-300 hover:text-gold-400 hover:bg-coffee-800 transition-colors inline-flex items-center space-x-1"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline text-[11px]">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-cream-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?._id.slice(-6).toUpperCase()}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Customer Information Card */}
            <div className="p-4 bg-coffee-900/80 rounded-2xl border border-coffee-800 space-y-2">
              <h4 className="text-xs uppercase font-bold text-gold-400 tracking-wider">
                Customer & Delivery Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-cream-200">
                <p><strong>Name:</strong> {selectedOrder.customerDetails?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customerDetails?.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerDetails?.phone}</p>
                <p>
                  <strong>Service:</strong>{' '}
                  <span className="capitalize">{selectedOrder.customerDetails?.orderType}</span>
                  {selectedOrder.customerDetails?.tableNumber && (
                    <span> ({selectedOrder.customerDetails.tableNumber})</span>
                  )}
                </p>
              </div>
              {selectedOrder.customerDetails?.address && (
                <p className="text-cream-300 pt-1 border-t border-coffee-800">
                  <strong>Delivery Address:</strong> {selectedOrder.customerDetails.address}
                </p>
              )}
              {selectedOrder.customerDetails?.specialInstructions && (
                <p className="text-cream-300 pt-1 border-t border-coffee-800">
                  <strong>Special Instructions:</strong>{' '}
                  {selectedOrder.customerDetails.specialInstructions}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-gold-400 tracking-wider">
                Order Items ({selectedOrder.items?.length})
              </h4>
              <div className="divide-y divide-coffee-800/80 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-10 h-10 rounded-lg object-cover bg-coffee-950"
                      />
                      <div>
                        <p className="font-semibold text-cream-100 text-sm">{it.name}</p>
                        <p className="text-cream-400">Qty: {it.quantity} × ${it.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-cream-50 text-sm">
                      ${(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="border-t border-coffee-800 pt-3 space-y-1.5 text-cream-300 text-right">
              <p>Subtotal: <strong className="text-cream-100">${selectedOrder.subtotal?.toFixed(2)}</strong></p>
              <p>Cafe Tax (5%): <strong className="text-cream-100">${selectedOrder.tax?.toFixed(2)}</strong></p>
              {selectedOrder.deliveryFee > 0 && (
                <p>Delivery Fee: <strong className="text-cream-100">${selectedOrder.deliveryFee?.toFixed(2)}</strong></p>
              )}
              <p className="text-sm font-bold text-cream-50 pt-1 border-t border-coffee-800/60">
                Grand Total: <span className="font-serif text-lg text-gold-400">${selectedOrder.total?.toFixed(2)}</span>
              </p>
            </div>

            {/* Status Control inside Modal */}
            <div className="pt-4 border-t border-coffee-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-cream-400">Current Status:</span>
                <Badge status={selectedOrder.orderStatus} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-cream-400">Change Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="py-1 px-3 bg-coffee-900 border border-coffee-700 rounded-lg text-xs text-cream-100 focus:outline-none focus:border-gold-500 font-medium"
                >
                  {statuses.filter((s) => s !== 'All').map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;

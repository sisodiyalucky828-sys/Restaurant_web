import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Check, X, Trash2, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Pending', 'Confirmed', 'Rejected', 'Completed'];

  const fetchReservations = async () => {
    setLoading(true);
    try {
      let url = '/reservations?';
      if (statusFilter !== 'All') url += `status=${statusFilter}&`;
      const res = await api.get(url);
      if (res.data?.data) {
        setReservations(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      toast.success(`Reservation marked as ${status}`);
      fetchReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to update reservation status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation ticket?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation deleted');
      fetchReservations();
    } catch (err) {
      toast.error(err.message || 'Failed to delete reservation');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coffee-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Table Reservations
          </h1>
          <p className="text-xs text-cream-300 mt-1">
            Review incoming booking requests, confirm guest parties, and manage table turnover.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel rounded-2xl p-4 border border-coffee-800 flex items-center space-x-2 overflow-x-auto">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-gold-500 text-coffee-950 font-bold'
                : 'bg-coffee-900 text-cream-300 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reservations Table */}
      <div className="glass-panel rounded-2xl border border-coffee-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-coffee-900/90 text-cream-400 uppercase tracking-wider text-[10px] border-b border-coffee-800">
              <tr>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Party Size</th>
                <th className="py-3 px-4">Special Requests / Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-cream-400">
                    Loading table reservations...
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.map((resv) => (
                  <tr key={resv._id} className="hover:bg-coffee-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-cream-100">{resv.name}</p>
                      <p className="text-[10px] text-cream-400">{resv.email}</p>
                      <p className="text-[10px] text-gold-400/90">{resv.phone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-cream-100 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-400" />
                        <span>{resv.date}</span>
                      </p>
                      <p className="text-[10px] text-cream-400 flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3 text-gold-400" />
                        <span>{resv.time}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-cream-100 bg-coffee-900 px-2.5 py-1 rounded-lg border border-coffee-800">
                        {resv.guests} {resv.guests === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-cream-300/90">
                      {resv.specialRequest ? (
                        <span className="line-clamp-2">{resv.specialRequest}</span>
                      ) : (
                        <span className="text-cream-500 italic">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge status={resv.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {resv.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(resv._id, 'Confirmed')}
                            className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                            title="Confirm Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(resv._id, 'Rejected')}
                            className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 transition-colors"
                            title="Reject Booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {resv.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(resv._id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/30 transition-colors text-[11px] font-semibold"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(resv._id)}
                        className="p-1.5 rounded-lg bg-coffee-900 text-cream-400 hover:text-rose-400 hover:bg-coffee-800 transition-colors"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-cream-400">
                    No table reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;

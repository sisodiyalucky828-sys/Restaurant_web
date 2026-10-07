import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, Coffee, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReservationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Set min date to today formatted as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date: today,
    time: '18:30',
    guests: 2,
    area: 'Main Dining Hall',
    specialRequest: '',
  });

  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:30',
    '12:30', '13:30', '15:00', '16:30',
    '18:00', '18:30', '19:00', '19:30', '20:30'
  ];

  const seatingAreas = [
    'Main Dining Hall (Warm Ambience)',
    'Sunny Garden Patio (Al Fresco)',
    'Window Roastery Lounge',
    'Quiet Library Booth',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        specialRequest: `Area: ${formData.area}. ${formData.specialRequest}`.trim(),
      };

      const res = await api.post('/reservations', payload);
      if (res.data?.success) {
        toast.success('Table reserved successfully!');
        setConfirmedReservation(res.data.data);
      }
    } catch (err) {
      toast.error(err.message || 'Could not place reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
          A Seat at the Velvet Table
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-50">
          Table Reservation
        </h1>
        <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed">
          Join us for an unforgettable dining experience. Reserve your preferred table in seconds with immediate confirmation.
        </p>
      </div>

      {/* Confirmation View */}
      {confirmedReservation ? (
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-500/40 text-center max-w-xl mx-auto space-y-6 animate-fade-in shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
              Reservation Reference #{confirmedReservation._id.slice(-6).toUpperCase()}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
              We Look Forward to Welcoming You!
            </h2>
            <p className="text-xs sm:text-sm text-cream-300">
              A confirmation email has been logged for{' '}
              <strong className="text-cream-100">{confirmedReservation.email}</strong>.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-coffee-900/80 rounded-2xl p-5 border border-coffee-800 text-left space-y-3 text-sm">
            <div className="flex justify-between border-b border-coffee-800 pb-2">
              <span className="text-cream-400">Guest Name</span>
              <span className="font-semibold text-cream-100">{confirmedReservation.name}</span>
            </div>
            <div className="flex justify-between border-b border-coffee-800 pb-2">
              <span className="text-cream-400">Date & Time</span>
              <span className="font-semibold text-gold-400">
                {confirmedReservation.date} at {confirmedReservation.time}
              </span>
            </div>
            <div className="flex justify-between border-b border-coffee-800 pb-2">
              <span className="text-cream-400">Party Size</span>
              <span className="font-semibold text-cream-100">{confirmedReservation.guests} Guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cream-400">Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {confirmedReservation.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/menu" className="btn-gold text-xs uppercase px-6 py-2.5 w-full sm:w-auto">
              Explore Our Menu
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-reservations"
                className="btn-outline-gold text-xs uppercase px-6 py-2.5 w-full sm:w-auto"
              >
                View My Reservations
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Reservation Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-10 border border-gold-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-cream-50 border-b border-coffee-800 pb-4">
                Booking Information
              </h2>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                    Number of Guests *
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                    Preferred Seating Area
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    {seatingAreas.map((area, i) => (
                      <option key={i} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots Selector */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-2">
                  Select Seating Time *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setFormData({ ...formData, time: slot })}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        formData.time === slot
                          ? 'bg-gold-500 text-coffee-950 border-gold-400 font-bold shadow-md shadow-gold-500/20'
                          : 'bg-coffee-900/60 text-cream-300 border-coffee-800 hover:border-gold-500/40'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                  Special Requests / Occasion
                </label>
                <textarea
                  rows="3"
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  placeholder="Anniversary celebration, dietary requirements, high chair needed, etc."
                  className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 focus:outline-none focus:border-gold-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3.5 text-xs uppercase tracking-wider font-bold shadow-xl flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Reserving Table...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Table Reservation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Policy & Perks */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-gold-500/20 space-y-4 text-xs text-cream-300">
              <h3 className="font-serif text-lg font-bold text-cream-50 border-b border-coffee-800 pb-3">
                Dining Policy
              </h3>
              <p className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>
                  Tables are held for 15 minutes past the reserved time before being released to walk-in guests.
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>
                  For parties of 8 or more, our manager will follow up with tailored group tasting menus.
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span>
                  Special occasions receive a complimentary artisan dessert on the house!
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;

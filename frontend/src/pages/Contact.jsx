import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Thank you! Your inquiry has been sent to our cafe concierge.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
          We'd Love to Hear from You
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cream-50">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed">
          Questions about our roasts, private events, catering, or feedback? Drop us a line or visit us in person.
        </p>
      </div>

      {/* Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold-500/20 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-cream-50 border-b border-coffee-800 pb-4">
              Cafe Concierge
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cream-100">Location</h4>
                  <p className="text-xs text-cream-300/90 leading-relaxed mt-0.5">
                    452 Roast Boulevard, Heritage Quarter, Suite 104
                  </p>
                  <p className="text-[11px] text-gold-400 mt-1">Complimentary Valet Parking Available</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cream-100">Direct Phone</h4>
                  <p className="text-xs text-cream-300/90 leading-relaxed mt-0.5">
                    +1 (555) 234-BREW (2739)
                  </p>
                  <p className="text-[11px] text-cream-400 mt-0.5">Lines open daily from 7:00 AM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cream-100">Email Inquiries</h4>
                  <p className="text-xs text-cream-300/90 leading-relaxed mt-0.5">
                    concierge@velvetbrew.com
                  </p>
                  <p className="text-[11px] text-cream-400 mt-0.5">Events: events@velvetbrew.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cream-100">Service Hours</h4>
                  <div className="text-xs text-cream-300/90 mt-0.5 space-y-0.5">
                    <p>Mon - Fri: 07:00 AM – 10:00 PM</p>
                    <p>Sat - Sun: 08:00 AM – 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-gold-500/20">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-cream-50">
                  Message Dispatched!
                </h3>
                <p className="text-sm text-cream-300 max-w-sm mx-auto">
                  Thank you for reaching out. A member of our concierge team will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline-gold text-xs px-6 py-2.5 mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-cream-50 mb-4">
                  Send Us a Note
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Henderson"
                      className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500"
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
                      placeholder="liam@example.com"
                      className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Private Roasting Workshop"
                      className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-200 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can assist you..."
                    className="w-full px-4 py-2.5 bg-coffee-900/90 border border-coffee-800 rounded-xl text-sm text-cream-100 placeholder-cream-400/40 focus:outline-none focus:border-gold-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-gold py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Google Map Section */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-gold-500/20 shadow-2xl">
        <div className="p-4 sm:p-6 bg-coffee-900/60 flex items-center justify-between border-b border-coffee-800">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg font-bold text-cream-50">Interactive Location Map</h3>
          </div>
          <span className="text-xs text-cream-400">452 Roast Blvd, Heritage Quarter</span>
        </div>
        <div className="h-80 w-full bg-coffee-900 relative">
          <iframe
            title="Velvet Brew Cafe Location"
            className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-[88%]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d206f6e2b34a!2sSpecialty%20Coffee%20Roasters!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;

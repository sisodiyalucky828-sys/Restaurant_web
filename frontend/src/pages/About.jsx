import React from 'react';
import { Coffee, Award, Sparkles, Heart, Shield, CheckCircle2, Users } from 'lucide-react';
import images from '../services/images';

const About = () => {
  const team = [
    {
      name: 'Julian Croft',
      role: 'Founder & Master Roaster',
      bio: 'Licensed Q-Grader with over 15 years traveling to the cloud forests of Yirgacheffe and Huila, sourcing micro-lots that redefine flavor profiles.',
      image: images.barista,
    },
    {
      name: 'Claire Dubois',
      role: 'Executive Pastry Chef',
      bio: 'Trained in Paris at the famed École Ferrandi. Claire directs our daily viennoiserie, bringing Normandy butter croissants to your morning table.',
      image: images.chef,
    },
    {
      name: 'Mateo Rivera',
      role: 'Head of Beverage & Lead Barista',
      bio: 'Two-time national latte art finalist passionate about water chemistry, extraction yield curves, and educating guests on single-origin tasting notes.',
      image: images.roaster,
    },
  ];

  const values = [
    {
      title: 'Direct-Trade Sourcing',
      desc: 'We purchase green coffee beans directly from independent farm cooperatives at over 150% of Fairtrade minimums.',
      icon: Heart,
    },
    {
      title: 'Micro-Batch Precision',
      desc: 'Every single batch is roasted in small 12kg drums with real-time probe monitoring to unlock optimal caramelized sugars.',
      icon: Sparkles,
    },
    {
      title: 'Zero Artificial Compromise',
      desc: 'Our syrups, nut milks, sauces, and doughs are scratch-made in-house every morning without artificial preservatives.',
      icon: Shield,
    },
    {
      title: 'Warm Sanctuary',
      desc: 'Beyond exceptional coffee, our space is designed as an architectural haven for deep conversation, reading, and connection.',
      icon: Coffee,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* 1. Page Header / Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
          Our Heritage & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-50 leading-tight">
          Obsession with the Craft. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-200">
            Devotion to the Cup.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed pt-2">
          Lucky Cafe was established in the historic quarter as a sanctuary for those who appreciate the poetry of single-origin coffee and the warmth of genuine hospitality.
        </p>
      </div>

      {/* 2. Story Grid with Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            How It Began
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            From Misty Highlands to Your Porcelain Cup
          </h2>
          <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed">
            In 2021, Julian Croft returned from a year-long expedition through East Africa’s high-altitude coffee washing stations. He brought back not just bags of extraordinary green coffee, but an unyielding vision: to create a space where every cup tells the story of the soil, altitude, and artisans who nurtured it.
          </p>
          <p className="text-sm text-cream-300/80 leading-relaxed">
            We restored an early 20th-century brick carriage house, pairing exposed raw timber with rich brass fixtures, hand-stitched velvet seating, and state-of-the-art synesso espresso machines. Here, coffee is treated not merely as fuel, but as a culinary art.
          </p>

          <div className="pt-2 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-cream-100">
              <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span>Certified 100% Arabica Specialty Grade beans (85+ Cup Score)</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-cream-100">
              <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span>In-house bakery churning fresh croissants & brioche at dawn</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-cream-100">
              <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span>Trained baristas who tailor extraction yield to your preference</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gold-500/20 aspect-[4/5]">
            <img src={images.about} alt="Coffee Brewing Craft" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gold-500/20 aspect-[4/5] mt-6">
            <img src={images.coffeeCraft} alt="Roasting Green Beans" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* 3. Core Values */}
      <div className="space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
            Guiding Principles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            What Sets Us Apart
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-cream-50">{v.title}</h3>
              <p className="text-xs sm:text-sm text-cream-300/80 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Leadership & Barista Team */}
      <div className="space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
            The Artisans
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            Meet the Masters
          </h2>
          <p className="text-sm text-cream-300/80">
            The passionate minds and hands crafting your experience every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((m, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden border border-gold-500/15">
              <div className="h-64 overflow-hidden bg-coffee-900">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl font-bold text-cream-50">{m.name}</h3>
                <p className="text-xs text-gold-400 font-medium uppercase tracking-wider">{m.role}</p>
                <p className="text-xs sm:text-sm text-cream-300/80 leading-relaxed pt-2">
                  {m.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;

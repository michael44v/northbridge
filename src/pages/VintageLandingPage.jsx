import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, ArrowRight, Lock, Phone, Mail, MapPin, ChevronRight, CheckCircle, Globe } from 'lucide-react';

const VintageLandingPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [pinRequired, setPinRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password, pinRequired ? pin : null);
      if (res.success) {
        toast.success('Signed in successfully');
        navigate('/dashboard');
      } else if (res.pin_required) {
        setPinRequired(true);
        toast.error('Please enter your 4-digit transaction PIN');
      } else {
        toast.error(res.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for reaching out! Our support team will get back to you shortly.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-serif text-[#2c3e50] flex flex-col">
      {/* Top Header / Navigation Bar */}
      <header className="bg-[#12283e] text-white border-b border-[#233d58]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c5a059] rounded-lg flex items-center justify-center text-[#12283e] font-black text-xl shadow-md">
              S
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight font-serif text-[#f8f7f4]">StarlingCrest</span>
              <span className="block text-[10px] tracking-widest uppercase text-[#c5a059] font-sans font-semibold">Finance & Trust</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-gray-300">
            <a href="#hero" className="hover:text-white transition-colors">Personal</a>
            <a href="#services" className="hover:text-white transition-colors">Commercial</a>
            <a href="#wealth" className="hover:text-white transition-colors">Wealth</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#contact" className="hover:text-white transition-colors">Support</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-[#12283e] font-sans font-bold text-sm rounded transition-colors shadow"
              >
                Go to Dashboard
              </button>
            ) : (
              <a
                href="#signin"
                className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-[#12283e] font-sans font-bold text-sm rounded transition-colors shadow"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="bg-[#12283e] text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-[#233d58] text-[#c5a059] text-xs font-sans uppercase font-bold tracking-widest rounded border border-[#345373]">
              Premier Global Banking
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white font-serif">
              Open our most popular savings account
            </h1>
            <p className="text-lg text-gray-300 max-w-xl font-sans font-light leading-relaxed">
              Access our high-yield savings program in minutes with flexible options and state-of-the-art security guarantees.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <a
                href="#signin"
                className="px-8 py-3.5 bg-[#c5a059] hover:bg-[#b08c46] text-[#12283e] font-sans font-bold text-base rounded shadow-lg transition-all flex items-center gap-2"
              >
                Sign in now <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 bg-[#1e3854] hover:bg-[#28486b] text-white font-sans font-semibold text-base rounded border border-[#38597f] transition-all"
              >
                Contact Advisor
              </a>
            </div>
          </div>

          {/* Embedded Sign-In Card */}
          <div id="signin" className="lg:col-span-5 bg-white text-[#2c3e50] p-8 rounded-xl shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-chase-blue rounded-full mb-2">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#12283e]">Secure Online Banking</h2>
              <p className="text-xs text-gray-500 font-sans">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address or Username
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#fdfdfc] border border-gray-300 rounded focus:ring-2 focus:ring-chase-blue focus:border-transparent outline-none transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#fdfdfc] border border-gray-300 rounded focus:ring-2 focus:ring-chase-blue focus:border-transparent outline-none transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {pinRequired && (
                <div className="animate-in fade-in zoom-in duration-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                    4-Digit Transaction PIN
                  </label>
                  <input
                    type="password"
                    maxLength="4"
                    required
                    placeholder="••••"
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-mono text-center tracking-widest text-lg"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-chase-blue focus:ring-chase-blue" />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-chase-blue font-semibold hover:underline">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#12283e] hover:bg-[#1a3856] text-white font-bold text-sm rounded shadow transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {loading ? 'Authenticating...' : 'Sign In To Account'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Services / Information Grid */}
      <section id="services" className="py-16 px-6 bg-[#f0eee6] border-y border-[#e2decb]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-serif text-[#12283e]">Financial Excellence & Integrity</h2>
            <p className="text-sm text-gray-600 font-sans">
              Tailored wealth management, personal financing solutions, and enterprise banking services backed by decades of experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#12283e] text-[#c5a059] rounded-lg flex items-center justify-center text-xl font-bold">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#12283e]">High-Yield Savings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Maximize interest returns with guaranteed fixed APY rates and direct liquidity access anytime, anywhere.
              </p>
              <a href="#signin" className="inline-flex items-center text-xs font-bold text-chase-blue hover:underline gap-1">
                Learn More <ChevronRight size={14} />
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#12283e] text-[#c5a059] rounded-lg flex items-center justify-center text-xl font-bold">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#12283e]">International Transfers</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Seamless multi-currency wire transfers and SWIFT integration across major global financial hubs.
              </p>
              <a href="#signin" className="inline-flex items-center text-xs font-bold text-chase-blue hover:underline gap-1">
                Explore Currency <ChevronRight size={14} />
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#12283e] text-[#c5a059] rounded-lg flex items-center justify-center text-xl font-bold">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#12283e]">Corporate Solutions</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dedicated treasury management, payroll protocols, and institutional asset protection tailored to your enterprise.
              </p>
              <a href="#contact" className="inline-flex items-center text-xs font-bold text-chase-blue hover:underline gap-1">
                Contact Business Team <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Connect with Us / Contact Form Section */}
      <section id="contact" className="py-16 px-6 bg-[#f8f7f4] flex-1">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#12283e]">Connect with us</h2>
                <p className="text-xs text-gray-500 font-sans mt-1">Listening to what you have to say about our services matters to us.</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#fbfbfa] border border-gray-300 rounded focus:border-[#12283e] outline-none"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#fbfbfa] border border-gray-300 rounded focus:border-[#12283e] outline-none"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Message</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Write your query here..."
                    className="w-full px-4 py-3 bg-[#fbfbfa] border border-gray-300 rounded focus:border-[#12283e] outline-none"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#12283e] hover:bg-[#1a3856] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Get in Touch Info */}
            <div className="space-y-6 font-sans">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#12283e]">Get in touch</h2>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#c5a059] shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-bold text-[#12283e] uppercase">Headquarters:</h4>
                    <p className="text-gray-600">400 Robert Street North, Saint Paul, MN 55101, USA.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-[#c5a059] shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-bold text-[#12283e] uppercase">Email:</h4>
                    <a href="mailto:support@starlingcrestfinance.com" className="text-[#c5a059] font-semibold hover:underline">
                      support@starlingcrestfinance.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Classic Footer */}
      <footer className="bg-[#0f1d2c] text-gray-400 py-8 px-6 border-t border-[#1b2d42] font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} StarlingCrest Finance. All rights reserved. Member FDIC. Equal Housing Lender.</p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Security & Fraud</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VintageLandingPage;

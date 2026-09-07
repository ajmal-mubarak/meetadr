import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Stethoscope, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <div id="main-hospital-footer">
      {/* Above-Footer Hospital Mission Section */}
      <section className="bg-slate-100/70 py-16 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="w-12 h-1 bg-sky-600 mx-auto rounded-full mb-4"></div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            Healthcare made human, direct, and accessible.
          </h2>
          <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto">
            Direct in-person consultations with accredited physicians across top UAE hospital networks.
          </p>
        </div>
      </section>

      {/* Main Hospital Deep Navy Footer */}
      <footer className="bg-[#0B2545] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Brand and contact info */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-white leading-none">
                    meet<span className="text-sky-400">Adr</span>
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-0.5">
                    Hospital Network
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                Direct in-person consultation booking at premier UAE medical centers including Clemenceau Medical Center (CMC Dubai), Emirates Apex, and more.
              </p>

              <div className="pt-2 space-y-2.5 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href="mailto:info@meetadr.com" className="hover:text-white transition-colors">
                    info@meetadr.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href="tel:+971524122794" className="hover:text-white transition-colors">
                    +971 52 412 2794
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Dubai Healthcare City & UAE Facilities</span>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-4">
                PATIENT SERVICES
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">
                    Clinical Services
                  </Link>
                </li>
                <li>
                  <Link to="/doctors" className="hover:text-white transition-colors">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link to="/hospitals" className="hover:text-white transition-colors">
                    Hospital Facilities
                  </Link>
                </li>
                <li>
                  <Link to="/patient/bookings" className="hover:text-white transition-colors flex items-center gap-1.5 text-sky-300 font-semibold">
                    <span>My Bookings</span>
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* FOR HEALTHCARE PROVIDERS */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-4">
                HEALTHCARE PROVIDERS
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/become-a-partner" className="hover:text-white transition-colors font-semibold text-white flex items-center gap-1">
                    <span>Become a Partner</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </Link>
                </li>
                <li>
                  <Link to="/join" className="hover:text-white transition-colors">
                    Doctor Registration
                  </Link>
                </li>
                <li>
                  <Link to="/hospital/login" className="hover:text-white transition-colors">
                    Hospital Management Portal
                  </Link>
                </li>
                <li>
                  <Link to="/doctor/login" className="hover:text-white transition-colors">
                    Doctor Practice Portal
                  </Link>
                </li>
                <li>
                  <Link to="/waitlist" className="hover:text-white transition-colors">
                    Priority Waitlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT & REGULATORY */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-4">
                SUPPORT & REGULATORY
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors">
                    Patient FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-white transition-colors text-slate-400">
                    Administrator Login
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar with subtle divider */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} meetAdr. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Licensed Healthcare Network Directory • UAE Health Authorities</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

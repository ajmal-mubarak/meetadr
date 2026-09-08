import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Stethoscope, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <div id="main-hospital-footer">
      {/* Above-Footer Client Mission Callout (PDF Page 5) */}
      <section className="bg-slate-50 py-12 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="w-10 h-1 bg-teal-600 mx-auto rounded-full mb-3" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Healthcare made human again.
          </h2>
          <p className="text-xs font-bold text-teal-700 tracking-wider">
            meetadr.com
          </p>
        </div>
      </section>

      {/* Main Dark Footer (Client PDF Page 5) */}
      <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Brand and contact info */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-white leading-none">
                    meet<span className="text-teal-400">Adr</span>
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-0.5">
                    Hospital Network
                  </span>
                </div>
              </Link>

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Book a doctor&apos;s appointment in a single click. Fast, simple, and human.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <a href="mailto:info@meetadr.com" className="hover:text-white transition-colors">
                    info@meetadr.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                  <a href="tel:+971524122794" className="hover:text-white transition-colors">
                    +971 52 412 2794
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Available Nationwide</span>
                </div>
              </div>
            </div>

            {/* QUICK LINKS (PDF Page 5) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">
                QUICK LINKS
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
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
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className="hover:text-white transition-colors">
                    Our Partners
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* JOIN WITH US (PDF Page 5) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">
                JOIN WITH US
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link to="/waitlist" className="hover:text-white transition-colors">
                    Join the Waitlist
                  </Link>
                </li>
                <li>
                  <Link to="/join" className="hover:text-white transition-colors">
                    Register as a Doctor
                  </Link>
                </li>
                <li>
                  <Link to="/become-a-partner" className="hover:text-white transition-colors">
                    Partner with meetAdr
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/refer" className="hover:text-white transition-colors">
                    Refer a Friend
                  </Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT (PDF Page 5) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">
                SUPPORT
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white transition-colors">
                    Help Center
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
                  <Link to="/accessibility" className="hover:text-white transition-colors">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
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

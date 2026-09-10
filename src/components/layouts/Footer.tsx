import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Stethoscope } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div id="main-hospital-footer" className="overflow-x-clip w-full max-w-full">
      {/* Above-Footer Client Mission Callout */}
      <section className="bg-slate-50 py-12 border-t border-slate-200 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="w-10 h-1 bg-teal-600 mx-auto rounded-full mb-3" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {t('footer.tagline')}
          </h2>
          <p className="text-xs font-bold text-teal-700 tracking-wider">
            meetadr.com
          </p>
        </div>
      </section>

      {/* Main Dark Footer */}
      <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800 overflow-hidden">
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
                    {t('common.hospitalNetwork')}
                  </span>
                </div>
              </Link>

              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {t('footer.description')}
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
                  <span>{t('common.availableNationwide')}</span>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">
                {t('footer.quickLinks')}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    {t('navigation.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    {t('navigation.aboutUs')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">
                    {t('navigation.services')}
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className="hover:text-white transition-colors">
                    {t('navigation.ourPartners')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    {t('navigation.contactUs')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* JOIN WITH US */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">
                {t('footer.joinWithUs')}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link to="/waitlist" className="hover:text-white transition-colors">
                    {t('common.waitlist')}
                  </Link>
                </li>
                <li>
                  <Link to="/join" className="hover:text-white transition-colors">
                    {t('footer.doctorRegistration')}
                  </Link>
                </li>
                <li>
                  <Link to="/become-a-partner" className="hover:text-white transition-colors">
                    {t('footer.hospitalRegistration')}
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-white transition-colors">
                    {t('static.careersTitle')}
                  </Link>
                </li>
                <li>
                  <Link to="/refer" className="hover:text-white transition-colors">
                    {t('static.referTitle')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT & LEGAL */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">
                {t('navigation.support')}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors">
                    {t('navigation.faq')}
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white transition-colors">
                    {t('navigation.help')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    {t('footer.termsAndConditions')}
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="hover:text-white transition-colors">
                    {t('footer.accessibility')}
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} meetAdr. {t('footer.allRightsReserved')}</p>
            <p className="flex items-center gap-1.5">
              <span>{t('footer.madeForUAE')}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

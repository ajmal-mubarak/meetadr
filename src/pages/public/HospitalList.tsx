import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, MapPin, Star, Phone, Clock, Search, ShieldCheck, Activity, ArrowRight } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { Hospital } from '../../types';
import { LOCATIONS } from '../../data/mockSpecialties';
import { useTranslation } from '../../i18n';

export const HospitalList: React.FC = () => {
  const { t, translateSpecialty, translateLocation } = useTranslation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await hospitalService.getAllHospitals();
        setHospitals(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = hospitals.filter((h) => {
    if (location !== 'All' && !h.location.includes(location.split('-')[0].trim())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-[#081217] min-h-screen py-10 selection:bg-slate-800 selection:text-white text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0C1A22] text-slate-200 text-xs font-semibold rounded-full mb-2 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('hospitals.partnerBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t('hospitals.pageTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl">
            {t('hospitals.pageDesc')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#0C1A22] p-4 rounded-3xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('hospitals.searchPlaceholder')}
              className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2.5 text-xs font-medium border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-slate-500 bg-[#081217] placeholder:text-slate-500 transition-colors"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-bold border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-slate-500 bg-[#081217] transition-colors cursor-pointer"
            >
              <option value="All" className="bg-[#081217] text-white">{t('hospitals.allLocations')}</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l} className="bg-[#081217] text-white">
                  {translateLocation(l.split('-')[0].trim())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center bg-[#0C1A22] rounded-3xl border border-slate-800 p-12">
            <div className="w-9 h-9 border-3 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400">{t('hospitals.loadingFacilities')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#0C1A22] p-12 rounded-3xl border border-slate-800 text-center max-w-md mx-auto space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-white">{t('hospitals.noFacilitiesFound')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t('hospitals.noFacilitiesDesc')}</p>
            <button
              onClick={() => {
                setLocation('All');
                setSearch('');
              }}
              className="px-5 py-2.5 palette-btn-primary text-xs rounded-xl cursor-pointer"
            >
              {t('hospitals.resetFilters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hosp, idx) => (
              <motion.div
                key={hosp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="bg-[#0C1A22] rounded-3xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                    <img
                      src={hosp.photo}
                      alt={hosp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {hosp.emergencyAvailable && (
                      <span className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 bg-[#081217]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-800">
                        <Activity className="w-3 h-3 text-rose-400" />
                        {t('hospitals.emergency247')}
                      </span>
                    )}
                    <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 bg-[#081217]/90 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 border border-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{hosp.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-slate-200 transition-colors">{hosp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{translateLocation(hosp.location)}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {hosp.about}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hosp.specialties.slice(0, 4).map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-[#081217] border border-slate-800 text-slate-300"
                        >
                          {translateSpecialty(spec)}
                        </span>
                      ))}
                      {hosp.specialties.length > 4 && (
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-lg bg-slate-800 border border-slate-800 text-slate-400">
                          {t('hospitals.moreSpecialties', { count: hosp.specialties.length - 4 })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                    <span className="text-slate-400 font-semibold">{t('hospitals.doctorsCount', { count: hosp.doctorCount })}</span>
                    <Link
                      to={`/hospitals/${hosp.id}`}
                      className="px-4 py-2 font-bold palette-btn-primary rounded-xl transition-all flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <span>{t('hospitals.viewDoctors')}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

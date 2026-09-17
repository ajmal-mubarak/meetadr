import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Stethoscope,
  MapPin,
  Star,
  Calendar,
  Search,
  CheckCircle2,
  Building2,
  ArrowRight,
  Clock,
  Sparkles,
  Filter,
  X,
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { Doctor } from '../../types';
import { SPECIALTIES, LOCATIONS } from '../../data/mockSpecialties';
import { useTranslation } from '../../i18n';

export const DoctorList: React.FC = () => {
  const { t, translateSpecialty, translateLocation } = useTranslation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [specialty, setSpecialty] = useState('All');
  const [location, setLocation] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Quick suggested filters
  const popularSpecialtySuggestions = [
    'All',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'General Practice',
    'Neurology',
  ];


  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      if (specialty !== 'All' && !doc.specialty.toLowerCase().includes(specialty.toLowerCase())) {
        return false;
      }
      if (location !== 'All' && !doc.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          (doc.hospitalName && doc.hospitalName.toLowerCase().includes(q)) ||
          doc.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [doctors, specialty, location, search]);

  return (
    <div className="bg-[#F4F7F9] min-h-screen py-10 selection:bg-teal-100 selection:text-slate-800 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6F8] border border-[#CDEBF0] text-xs font-bold text-[#0E7490]">
            <Stethoscope className="w-4 h-4 text-[#2DA7B5]" />
            <span>{t('doctors.verifiedBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('doctors.pageTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {t('doctors.pageDesc')}
          </p>
        </div>

        {/* Filter Console */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E2EBF0] shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('doctors.searchPlaceholder')}
                className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 text-xs font-medium border border-[#E2EBF0] rounded-xl text-slate-900 focus:outline-hidden focus:border-[#2DA7B5] bg-[#F8FAFC] focus:bg-white transition-all placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-3 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Specialty Selector */}
            <div className="sm:col-span-3">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full py-2.5 px-3 text-xs font-bold border border-[#E2EBF0] rounded-xl text-slate-800 focus:outline-hidden focus:border-[#2DA7B5] bg-[#F8FAFC] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="All">{t('doctors.allSpecialties')}</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {translateSpecialty(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Selector */}
            <div className="sm:col-span-3">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2.5 px-3 text-xs font-bold border border-[#E2EBF0] rounded-xl text-slate-800 focus:outline-hidden focus:border-[#2DA7B5] bg-[#F8FAFC] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="All">{t('doctors.allLocations')}</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l.split('-')[0].trim()}>
                    {translateLocation(l)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Suggested Filter Badges */}
          <div className="pt-2 border-t border-[#E2EBF0]">
            {/* Suggested Specialties */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 rtl:mr-0 rtl:ml-1">
                {t('doctors.specialtyFilterLabel')}
              </span>
              {popularSpecialtySuggestions.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSpecialty(spec)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    specialty === spec
                      ? 'bg-[#2DA7B5] text-white shadow-xs font-bold'
                      : 'bg-[#F8FAFC] text-slate-700 hover:bg-[#E8F6F8] hover:text-[#0E7490] hover:border-[#CDEBF0] border border-[#E2EBF0]'
                  }`}
                >
                  {spec === 'All' ? t('common.all') : translateSpecialty(spec)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>
            {t('doctors.showingAccredited', { count: filtered.length })}
          </span>
          {(specialty !== 'All' || location !== 'All' || search) && (
            <button
              type="button"
              onClick={() => {
                setSpecialty('All');
                setLocation('All');
                setSearch('');
              }}
              className="text-[#2DA7B5] font-bold hover:underline cursor-pointer"
            >
              {t('doctors.resetFilters')}
            </button>
          )}
        </div>

        {/* Doctor Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E2EBF0] shadow-sm p-12">
            <div className="w-9 h-9 border-3 border-[#2DA7B5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">{t('doctors.findingPhysicians')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E2EBF0] shadow-sm text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F6F8] text-[#2DA7B5] flex items-center justify-center mx-auto border border-[#CDEBF0]">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('doctors.noDoctorsFound')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('doctors.noDoctorsDesc')}
            </p>
            <button
              onClick={() => {
                setSpecialty('All');
                setLocation('All');
                setSearch('');
              }}
              className="px-5 py-2.5 bg-[#2DA7B5] hover:bg-[#23929F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t('doctors.resetFiltersBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.02 }}
                className="bg-white rounded-3xl border border-[#E2EBF0] overflow-hidden hover:border-[#2DA7B5] hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  {/* Photo & Rating */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 border border-[#E2EBF0] shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 text-[10px] font-normal">({doc.reviewCount || 98})</span>
                    </div>

                    {/* Live Next Slot badge */}
                    <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1.5 border border-[#E2EBF0] shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t('doctors.nextSlotToday')}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#0E7490] bg-[#E8F6F8] border border-[#CDEBF0] px-2.5 py-0.5 rounded-full">
                        {translateSpecialty(doc.specialty)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {doc.experience}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug truncate group-hover:text-[#2DA7B5] transition-colors">
                      {doc.name}
                    </h3>

                    <p className="text-xs text-slate-600 truncate flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.hospitalName || doc.clinicName || 'CMC Hospital Dubai'}</span>
                    </p>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{translateLocation(doc.location)}</span>
                    </p>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {doc.about}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Price & Book CTA */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#E2EBF0] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">{t('doctors.fee')}</span>
                      <span className="text-xs font-black text-slate-900">{t('common.aed')} {doc.consultationFee || 350}</span>
                    </div>

                    {doc.status === 'Deactivated' ? (
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed">
                        Unavailable
                      </span>
                    ) : (
                      <Link
                        to={`/book/doctor/${doc.id}`}
                        className="px-4 py-2 bg-[#2DA7B5] hover:bg-[#23929F] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{t('doctors.bookAppointment')}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </Link>
                    )}
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

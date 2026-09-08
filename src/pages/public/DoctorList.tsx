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

export const DoctorList: React.FC = () => {
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

  const popularLocationSuggestions = [
    { id: 'All', label: 'All UAE' },
    { id: 'Al Jaddaf', label: 'Al Jaddaf (CMC)' },
    { id: 'Healthcare City', label: 'DHCC' },
    { id: 'Downtown', label: 'Downtown' },
    { id: 'Jumeirah', label: 'Jumeirah' },
    { id: 'Deira', label: 'Deira' },
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
    <div className="bg-slate-50 min-h-screen py-10 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Verified Medical Specialists</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find & Book Hospital Doctors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Browse certified physicians across Dubai and the UAE with guaranteed 30-minute in-person consultation slots.
          </p>
        </div>

        {/* Filter Console */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name, specialty, or clinic..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50 focus:bg-white transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
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
                className="w-full py-2.5 px-3 text-xs font-bold border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-teal-500 bg-slate-50/50 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="All">All Specialties</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Selector */}
            <div className="sm:col-span-3">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full py-2.5 px-3 text-xs font-bold border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-teal-500 bg-slate-50/50 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="All">All UAE Locations</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l.split('-')[0].trim()}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Suggested Filter Badges */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {/* Suggested Specialties */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Specialty:</span>
              {popularSpecialtySuggestions.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSpecialty(spec)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    specialty === spec
                      ? 'bg-teal-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Suggested Locations */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Area:</span>
              {popularLocationSuggestions.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setLocation(loc.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    location === loc.id
                      ? 'bg-teal-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filtered.length}</strong> accredited doctors
          </span>
          {(specialty !== 'All' || location !== 'All' || search) && (
            <button
              type="button"
              onClick={() => {
                setSpecialty('All');
                setLocation('All');
                setSearch('');
              }}
              className="text-teal-600 font-bold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Doctor Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-12 shadow-xs">
            <div className="w-9 h-9 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Finding available physicians...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No doctors match your criteria</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try adjusting your specialty, selected location, or search keywords.
            </p>
            <button
              onClick={() => {
                setSpecialty('All');
                setLocation('All');
                setSearch('');
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
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
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Rating */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs flex items-center gap-1 border border-slate-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 text-[10px] font-normal">({doc.reviewCount || 98})</span>
                    </div>

                    {/* Live Next Slot badge */}
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Next Slot: Today at 10:30 AM</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                        {doc.specialty}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {doc.experience}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug truncate">
                      {doc.name}
                    </h3>

                    <p className="text-xs text-slate-600 truncate flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doc.hospitalName || doc.clinicName || 'CMC Hospital Dubai'}</span>
                    </p>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-1">
                      {doc.about}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Price & Book CTA */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Fee</span>
                      <span className="text-xs font-black text-slate-900">AED {doc.consultationFee || 350}</span>
                    </div>

                    <Link
                      to={`/book/doctor/${doc.id}`}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shadow-teal-600/20 cursor-pointer"
                    >
                      <span>Book Appointment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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

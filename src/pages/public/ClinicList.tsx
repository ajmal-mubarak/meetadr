import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, MapPin, Star, Phone, Clock, Search, Sparkles, ArrowRight } from 'lucide-react';
import { clinicService } from '../../services/clinicService';
import { Clinic } from '../../types';
import { LOCATIONS, SPECIALTIES } from '../../data/mockSpecialties';

export const ClinicList: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await clinicService.getAllClinics();
        setClinics(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = clinics.filter((c) => {
    if (specialty !== 'All' && c.specialty !== specialty) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#FAF9F6] min-h-screen py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-bold rounded-full mb-2 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Specialized Clinical Practices</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight">
            Clinics & Outpatient Centers
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5 max-w-2xl">
            Discover focused medical clinics for dermatology, dental care, pediatrics, physiotherapy, and specialty consultations.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E2E8F0] shadow-sm mb-8 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinic name or specialty..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-xl text-[#1E293B] focus:border-[#2563EB] focus:outline-none bg-[#FAF9F6] focus:bg-white transition-colors"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-[#E2E8F0] rounded-xl text-[#1E293B] focus:border-[#2563EB] focus:outline-none bg-[#FAF9F6] focus:bg-white transition-colors cursor-pointer"
            >
              <option value="All">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-9 h-9 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-[#64748B]">Loading clinics...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center max-w-md mx-auto shadow-xs">
            <Building2 className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1E293B] mb-1">No clinics match your search</h3>
            <p className="text-xs text-[#64748B] mb-4">Try clearing your filters or search terms.</p>
            <button
              onClick={() => {
                setSpecialty('All');
                setSearch('');
              }}
              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((clinic, idx) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                whileHover={{ y: -5, transition: { duration: 0.18 } }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-[#2563EB] rounded-md border border-blue-100">
                      {clinic.specialty}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#1E293B] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{clinic.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#1E293B] mb-1 leading-snug">{clinic.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span>{clinic.location}</span>
                  </div>

                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                    {clinic.about}
                  </p>

                  <div className="text-xs text-[#64748B] space-y-1.5 bg-[#FAF9F6] p-3 rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="truncate">{clinic.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="truncate">{clinic.operatingHours}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] font-semibold">{clinic.doctorCount} Doctors</span>
                  <Link
                    to={`/clinics/${clinic.id}`}
                    className="px-4 py-2 font-bold bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span>View Clinic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

import React, { useState, useEffect } from 'react';
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

  const filtered = doctors.filter((doc) => {
    if (specialty !== 'All' && doc.specialty !== specialty) return false;
    if (location !== 'All' && !doc.location.includes(location.split('-')[0].trim())) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        (doc.hospitalName && doc.hospitalName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-[#F6F5EE] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#EFF3EC] text-[#6C7A5B] text-xs font-bold rounded-full mb-2 border border-[#BAC7AD]">
            Verified Medical Specialists (Client PDF Page 2)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
            Meet Our Doctors
          </h1>
          <p className="text-sm text-[#525252] mt-1.5 max-w-2xl">
            Experienced, compassionate specialists ready to see you — on your schedule. Book direct 30-minute in-person consultations.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E5DFCD] shadow-2xs mb-8 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name or hospital..."
              className="w-full pl-10 pr-3 py-2.5 text-xs font-medium border border-[#E5DFCD] rounded-xl text-[#000000] focus:outline-hidden bg-[#F6F5EE]/50 focus:bg-white transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-semibold border border-[#E5DFCD] rounded-xl text-[#000000] focus:outline-hidden bg-[#F6F5EE]/50 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="All">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2.5 px-3 text-xs font-semibold border border-[#E5DFCD] rounded-xl text-[#000000] focus:outline-hidden bg-[#F6F5EE]/50 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="All">All UAE Locations</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l.split('-')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#8D9B7B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium text-[#737373]">Loading specialists...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E5DFCD] text-center max-w-md mx-auto shadow-xs">
            <Stethoscope className="w-10 h-10 text-[#737373] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#000000] mb-1">No doctors match your criteria</h3>
            <p className="text-xs text-[#525252] mb-4">Try clearing filters or changing your search terms.</p>
            <button
              onClick={() => {
                setSpecialty('All');
                setLocation('All');
                setSearch('');
              }}
              className="px-4 py-2 bg-[#8D9B7B] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="bg-white rounded-2xl border border-[#E5DFCD] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#8D9B7B] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Rating */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#F6F5EE]">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-[#000000] shadow-sm flex items-center gap-1 border border-[#E5DFCD]">
                      <Star className="w-3.5 h-3.5 fill-[#D8C488] text-[#D8C488]" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <span className="text-xs font-bold text-[#8D9B7B] block">
                      {doc.specialty}
                    </span>
                    <h3 className="text-base font-bold text-[#000000] leading-snug truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-[#737373] truncate flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#8D9B7B] shrink-0" />
                      <span className="truncate">{doc.hospitalName || doc.clinicName || 'CMC Hospital Dubai'}</span>
                    </p>
                    <p className="text-xs text-[#737373] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8D9B7B] shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </p>
                    <p className="text-xs text-[#525252] pt-1">
                      {doc.experience}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/book/doctor/${doc.id}`}
                    className="w-full py-2.5 bg-[#8D9B7B] hover:bg-[#748263] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

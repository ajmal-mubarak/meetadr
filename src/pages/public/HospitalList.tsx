import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, MapPin, Star, Phone, Clock, Search, ShieldCheck, Activity, ArrowRight } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { Hospital } from '../../types';
import { LOCATIONS } from '../../data/mockSpecialties';

export const HospitalList: React.FC = () => {
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
    <div className="bg-[#F6F5EE] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#EFF3EC] text-[#6C7A5B] text-xs font-bold rounded-full mb-2 border border-[#BAC7AD]">
            Partner Hospitals & Medical Centers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
            UAE Hospitals & Clinics
          </h1>
          <p className="text-sm text-[#525252] mt-1.5 max-w-2xl">
            Explore state-of-the-art hospitals with multi-specialty departments, emergency units, and verified physician networks.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E5DFCD] shadow-2xs mb-8 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospital name or clinical specialty..."
              className="w-full pl-10 pr-3 py-2.5 text-xs font-medium border border-[#E5DFCD] rounded-xl text-[#000000] focus:outline-hidden bg-[#F6F5EE]/50 focus:bg-white transition-colors"
            />
          </div>

          <div className="sm:col-span-4">
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

        {/* Hospital Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#8D9B7B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium text-[#737373]">Loading healthcare facilities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E5DFCD] text-center max-w-md mx-auto shadow-xs">
            <Building2 className="w-10 h-10 text-[#737373] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#000000] mb-1">No facilities match your search</h3>
            <p className="text-xs text-[#525252] mb-4">Try clearing filters or changing your search terms.</p>
            <button
              onClick={() => {
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
            {filtered.map((hosp, idx) => (
              <motion.div
                key={hosp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="bg-white rounded-2xl border border-[#E5DFCD] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#8D9B7B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 bg-[#F6F5EE]">
                    <img
                      src={hosp.photo}
                      alt={hosp.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {hosp.emergencyAvailable && (
                      <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#8D9B7B]" />
                        24/7 Emergency
                      </span>
                    )}
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg text-xs font-bold text-[#000000] flex items-center gap-1 shadow-xs border border-[#E5DFCD]">
                      <Star className="w-3.5 h-3.5 text-[#D8C488] fill-[#D8C488]" />
                      <span>{hosp.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-[#000000] mb-1 leading-snug">{hosp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#737373] mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#8D9B7B] shrink-0" />
                      <span>{hosp.location}</span>
                    </div>

                    <p className="text-xs text-[#525252] line-clamp-2 mb-4 leading-relaxed">
                      {hosp.about}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {hosp.specialties.slice(0, 4).map((spec) => (
                        <span
                          key={spec}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-[#E5DFCD] text-[#262626]"
                        >
                          {spec}
                        </span>
                      ))}
                      {hosp.specialties.length > 4 && (
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-[#F6F5EE] border border-[#E5DFCD] text-[#737373]">
                          +{hosp.specialties.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-[#E5DFCD] pt-3 text-xs">
                  <span className="text-[#525252] font-semibold">{hosp.doctorCount}+ Doctors</span>
                  <Link
                    to={`/hospitals/${hosp.id}`}
                    className="px-4 py-2 font-bold bg-[#8D9B7B] hover:bg-[#748263] text-white rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>View Doctors</span>
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

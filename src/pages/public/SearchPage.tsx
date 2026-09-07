import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  MapPin,
  Star,
  Building2,
  Stethoscope,
  Filter,
  CheckCircle2,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { hospitalService } from '../../services/hospitalService';
import { clinicService } from '../../services/clinicService';
import { Doctor, Hospital, Clinic } from '../../types';
import { SPECIALTIES, LOCATIONS } from '../../data/mockSpecialties';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialSpecialty = searchParams.get('specialty') || 'All';
  const initialLocation = searchParams.get('location') || 'All';
  const initialType = searchParams.get('type') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [location, setLocation] = useState(initialLocation);
  const [providerType, setProviderType] = useState(initialType);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [allDocs, allHosps, allClins] = await Promise.all([
          doctorService.getAllDoctors(),
          hospitalService.getAllHospitals(),
          clinicService.getAllClinics(),
        ]);
        setDoctors(allDocs);
        setHospitals(allHosps);
        setClinics(allClins);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (specialty !== 'All') params.append('specialty', specialty);
    if (location !== 'All') params.append('location', location);
    if (providerType !== 'All') params.append('type', providerType);
    setSearchParams(params);
  };

  // Filter Doctors
  const filteredDoctors = doctors.filter((d) => {
    if (providerType !== 'All' && providerType !== 'Doctor') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        (d.hospitalName && d.hospitalName.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (specialty !== 'All' && d.specialty.toLowerCase() !== specialty.toLowerCase()) return false;
    if (location !== 'All' && !d.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  // Filter Hospitals
  const filteredHospitals = hospitals.filter((h) => {
    if (providerType !== 'All' && providerType !== 'Hospital') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.specialties.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (
      specialty !== 'All' &&
      !h.specialties.some((s) => s.toLowerCase() === specialty.toLowerCase())
    )
      return false;
    if (location !== 'All' && !h.location.toLowerCase().includes(location.toLowerCase()))
      return false;
    return true;
  });

  // Filter Clinics
  const filteredClinics = clinics.filter((c) => {
    if (providerType !== 'All' && providerType !== 'Clinic') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (specialty !== 'All' && c.specialty.toLowerCase() !== specialty.toLowerCase()) return false;
    if (location !== 'All' && !c.location.toLowerCase().includes(location.toLowerCase()))
      return false;
    return true;
  });

  // Total results
  const totalCount =
    filteredDoctors.length + filteredHospitals.length + filteredClinics.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#FAF9F6] min-h-screen py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search header / filters */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm mb-8">
          <form onSubmit={handleApplyFilter} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <label className="block text-xs font-bold text-[#1E293B] mb-1">
                  Search keyword
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Doctor name, hospital, condition..."
                    className="w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none bg-[#FAF9F6] focus:bg-white transition-colors font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-[#1E293B] mb-1">
                  Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none bg-[#FAF9F6] focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="All">All Specialties</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1E293B] mb-1">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2 px-3 border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none bg-[#FAF9F6] focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="All">All UAE</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc.split('-')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Provider Type selector tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#64748B] mr-1">Category:</span>
                {['All', 'Doctor', 'Hospital', 'Clinic'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProviderType(type)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      providerType === type
                        ? 'bg-[#2563EB] text-white shadow-2xs'
                        : 'bg-[#FAF9F6] text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 border border-[#E2E8F0]'
                    }`}
                  >
                    {type === 'All' ? 'All Providers' : `${type}s`}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#64748B] font-medium">
                Found <strong className="text-[#1E293B]">{totalCount}</strong> verified matching results
              </div>
            </div>
          </form>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-9 h-9 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-[#64748B]">Searching healthcare directory...</p>
          </div>
        ) : totalCount === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center max-w-lg mx-auto shadow-xs">
            <Stethoscope className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1E293B] mb-1">No matching providers found</h3>
            <p className="text-sm text-[#64748B] mb-4">
              Try adjusting your specialty, keyword, or location filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSpecialty('All');
                setLocation('All');
                setProviderType('All');
              }}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Doctors Section */}
            {filteredDoctors.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#2563EB]" />
                  <span>Specialist Doctors ({filteredDoctors.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDoctors.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ y: -4, transition: { duration: 0.18 } }}
                      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#E2E8F0]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-[#2563EB] block mb-0.5">
                            {doc.specialty}
                          </span>
                          <h4 className="text-base font-bold text-[#1E293B] leading-snug truncate">
                            {doc.name}
                          </h4>
                          <p className="text-xs text-[#64748B] truncate">
                            {doc.hospitalName || doc.clinicName || 'City Care Hospital'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-[#64748B] mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                            <span className="truncate">{doc.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 font-bold text-[#1E293B]">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{doc.rating}</span>
                          <span className="text-[#94A3B8] font-normal">({doc.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/doctors/${doc.id}`}
                            className="px-3 py-1.5 font-semibold text-[#475569] hover:bg-[#FAF9F6] rounded-lg border border-[#E2E8F0]"
                          >
                            Details
                          </Link>
                          <Link
                            to={`/book/doctor/${doc.id}`}
                            className="px-3.5 py-1.5 font-bold bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-sm"
                          >
                            Book Slot
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Hospitals Section */}
            {filteredHospitals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                  <span>Hospitals ({filteredHospitals.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredHospitals.map((hosp) => (
                    <motion.div
                      key={hosp.id}
                      whileHover={{ y: -4, transition: { duration: 0.18 } }}
                      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-16/9 bg-slate-100">
                          <img
                            src={hosp.photo}
                            alt={hosp.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {hosp.emergencyAvailable && (
                            <span className="absolute top-2.5 left-2.5 bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                              24/7 Emergency
                            </span>
                          )}
                          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-xs font-bold text-[#1E293B] flex items-center gap-1 shadow-xs">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{hosp.rating}</span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-base font-bold text-[#1E293B] mb-1">{hosp.name}</h4>
                          <p className="text-xs text-[#64748B] mb-2">{hosp.location}</p>
                          <div className="flex flex-wrap gap-1">
                            {hosp.specialties.slice(0, 3).map((spec) => (
                              <span
                                key={spec}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#E2E8F0] text-[#475569]"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-xs">
                        <span className="text-[#64748B] font-semibold">{hosp.doctorCount}+ Specialists</span>
                        <Link
                          to={`/hospitals/${hosp.id}`}
                          className="px-3.5 py-1.5 font-bold text-[#2563EB] hover:bg-blue-50 rounded-lg flex items-center gap-1"
                        >
                          <span>View Hospital</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinics Section */}
            {filteredClinics.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                  <span>Clinics ({filteredClinics.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredClinics.map((clinic) => (
                    <motion.div
                      key={clinic.id}
                      whileHover={{ y: -4, transition: { duration: 0.18 } }}
                      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-[#2563EB] rounded-md border border-blue-100">
                            {clinic.specialty}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-[#1E293B] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{clinic.rating}</span>
                          </div>
                        </div>
                        <h4 className="text-base font-bold text-[#1E293B] mb-1">{clinic.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span>{clinic.location}</span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                          {clinic.about}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                        <span className="text-[#64748B] font-semibold">{clinic.doctorCount} Doctors</span>
                        <Link
                          to={`/clinics/${clinic.id}`}
                          className="px-3.5 py-1.5 font-bold text-[#2563EB] hover:bg-blue-50 rounded-lg flex items-center gap-1"
                        >
                          <span>View Clinic</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

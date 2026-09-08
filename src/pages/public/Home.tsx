import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  HeartPulse,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Building2,
  Phone,
  User,
  CheckCircle2,
  Activity,
  Award,
  Bone,
  Baby,
  Bell,
  Check,
  Zap,
  Users,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { INITIAL_DOCTORS } from '../../data/mockDoctors';
import { INITIAL_HOSPITALS } from '../../data/mockHospitals';
import { HEALTH_CONDITIONS, CONDITION_LETTERS } from '../../data/mockConditions';
import { useToast } from '../../context/ToastContext';

// Suggested Specialties for autocomplete
const SUGGESTED_SPECIALTIES = [
  { name: 'Cardiology', icon: HeartPulse, desc: 'Heart, blood pressure & cardiovascular care' },
  { name: 'Dermatology', icon: Sparkles, desc: 'Skin, hair, acne & laser treatments' },
  { name: 'Orthopedics', icon: Bone, desc: 'Joints, bones, spine & sports injuries' },
  { name: 'Pediatrics', icon: Baby, desc: 'Child health, vaccinations & wellness' },
  { name: 'General Practice', icon: Stethoscope, desc: 'Primary care, checkups & routine sickness' },
  { name: 'Neurology', icon: Activity, desc: 'Headaches, migraines, nerves & brain' },
];

// Suggested Locations for autocomplete
const SUGGESTED_LOCATIONS = [
  { name: 'Al Jaddaf', hub: 'Clemenceau Medical Center (CMC Dubai)', emirate: 'Dubai' },
  { name: 'Dubai Healthcare City', hub: 'DHCC Phase 1 & 2 Clinics', emirate: 'Dubai' },
  { name: 'Downtown Dubai', hub: 'Near Burj Khalifa & Financial Center', emirate: 'Dubai' },
  { name: 'Jumeirah', hub: 'Al Wasl Road Medical Centers', emirate: 'Dubai' },
  { name: 'Deira', hub: 'Canadian Specialist Hospital area', emirate: 'Dubai' },
  { name: 'Dubai Marina', hub: 'Marina Walk & JBR Healthcare', emirate: 'Dubai' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEmirate, setSelectedEmirate] = useState('Dxb');

  // Autocomplete dropdown visibility
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Recommendation location filter for the recommended section
  const [recommendedFilter, setRecommendedFilter] = useState('All');

  // Condition letter filter state
  const [selectedLetter, setSelectedLetter] = useState('All');

  // Category filter state for doctors
  const [doctorCategory, setDoctorCategory] = useState('All');

  const specialtyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (specialtyRef.current && !specialtyRef.current.contains(target)) {
        setShowSpecialtyDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedEmirate) params.append('emirate', selectedEmirate);
    navigate(`/search?${params.toString()}`);
  };

  // Quick specialty select
  const handleQuickSpecialty = (specialty: string) => {
    navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`);
  };

  // Popular specialties list
  const popularSpecialties = [
    { name: 'Cardiology', icon: HeartPulse, count: '42 Specialists', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'Dermatology', icon: Sparkles, count: '38 Specialists', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Orthopedics', icon: Bone, count: '35 Specialists', color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { name: 'Pediatrics', icon: Baby, count: '29 Specialists', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'General Practice', icon: Stethoscope, count: '54 Doctors', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { name: 'Neurology', icon: Activity, count: '21 Specialists', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  // Filtered conditions based on A-Z letter
  const filteredConditions = selectedLetter === 'All'
    ? HEALTH_CONDITIONS
    : HEALTH_CONDITIONS.filter((c) => c.letter === selectedLetter);

  // Filter doctors for the showcase section
  const filteredDoctors = INITIAL_DOCTORS.filter((doc) => {
    if (doctorCategory === 'All') return true;
    if (doctorCategory === 'Cardiology') return doc.specialty.toLowerCase().includes('cardio');
    if (doctorCategory === 'Dermatology') return doc.specialty.toLowerCase().includes('derm');
    if (doctorCategory === 'Orthopedics') return doc.specialty.toLowerCase().includes('ortho');
    if (doctorCategory === 'General Practice') {
      return (
        doc.specialty.toLowerCase().includes('general') ||
        doc.specialty.toLowerCase().includes('internal')
      );
    }
    return true;
  }).slice(0, 6);

  // Recommended doctors filtered by location
  const recommendedDoctors = INITIAL_DOCTORS.filter((doc) => {
    if (recommendedFilter === 'All') return true;
    return doc.location.toLowerCase().includes(recommendedFilter.toLowerCase());
  }).slice(0, 4);

  // Top hospital partners
  const partnerHospitals = INITIAL_HOSPITALS.slice(0, 4);

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-teal-100 selection:text-teal-900">

      {/* ========================================================================= */}
      {/* 1. HERO & UNIFIED SEARCH CONSOLE WITH SMART AUTOCOMPLETE                   */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-teal-50/40 via-white to-slate-50 border-b border-slate-200/80 overflow-visible">
        {/* Subtle background blur accents */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-teal-400/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/70 border border-teal-300/60 text-xs font-bold text-teal-800 mb-6 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>Direct In-Person Appointments • Verified UAE Hospital Network</span>
            </motion.div>

            {/* Master Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
            >
              Book accredited hospital doctors in a single click.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm sm:text-base lg:text-lg text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed"
            >
              Schedule guaranteed 30-minute consultations across top facilities including Clemenceau Medical Center (CMC Dubai), Canadian Specialist Hospital, and Medcare.
            </motion.p>
          </div>

          {/* Unified Search Console with Smart Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="max-w-4xl mx-auto mt-8 sm:mt-10 relative z-30"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl sm:rounded-full border-2 border-slate-200/90 hover:border-teal-400 p-2 sm:p-2.5 shadow-lg shadow-teal-900/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all relative"
            >
              {/* Field 1: Doctor / Specialty with Autocomplete */}
              <div className="flex-1 relative" ref={specialtyRef}>
                <div className="flex items-center px-4 py-3 sm:py-2.5 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none">
                  <Search className="w-4 h-4 text-teal-600 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowSpecialtyDropdown(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSpecialtyDropdown(true);
                    }}
                    placeholder="Doctor, specialty, or clinic..."
                    className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
                  />
                </div>

                {/* Specialty Dropdown Suggestions */}
                <AnimatePresence>
                  {showSpecialtyDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-left"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                        Suggested Specialties
                      </p>
                      <div className="space-y-1">
                        {SUGGESTED_SPECIALTIES.filter((s) =>
                          s.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((spec) => {
                          const Icon = spec.icon;
                          return (
                            <button
                              key={spec.name}
                              type="button"
                              onClick={() => {
                                setSearchQuery(spec.name);
                                setShowSpecialtyDropdown(false);
                              }}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50 text-left transition-colors cursor-pointer group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-teal-50 group-hover:bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 block">
                                  {spec.name}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate">
                                  {spec.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200" />

              {/* Field 2: Location with Autocomplete */}
              <div className="flex-1 relative" ref={locationRef}>
                <div className="flex items-center px-4 py-3 sm:py-2.5 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none">
                  <MapPin className="w-4 h-4 text-teal-600 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={selectedLocation}
                    onFocus={() => setShowLocationDropdown(true)}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    placeholder="Area (e.g. Al Jaddaf, DHCC)"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
                  />
                </div>

                {/* Location Dropdown Suggestions */}
                <AnimatePresence>
                  {showLocationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 sm:right-auto sm:w-80 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-left"
                    >
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                        Popular Clinic Hubs
                      </p>
                      <div className="space-y-1">
                        {SUGGESTED_LOCATIONS.filter((loc) =>
                          loc.name.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                          loc.hub.toLowerCase().includes(selectedLocation.toLowerCase())
                        ).map((loc) => (
                          <button
                            key={loc.name}
                            type="button"
                            onClick={() => {
                              setSelectedLocation(loc.name);
                              setShowLocationDropdown(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-teal-50 text-left transition-colors cursor-pointer group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-teal-50 group-hover:bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 block">
                                {loc.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {loc.hub}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200" />

              {/* Field 3: Emirate */}
              <div className="flex items-center px-3 py-3 sm:py-2.5 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none sm:w-36">
                <select
                  value={selectedEmirate}
                  onChange={(e) => setSelectedEmirate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="Dxb">Dubai (Dxb)</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">RAK</option>
                </select>
              </div>

              {/* Action CTA Button */}
              <button
                type="submit"
                className="px-8 py-3.5 sm:py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl sm:rounded-full font-bold text-sm transition-all shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Find Doctors</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Specialty Shortcut Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">Suggested:</span>
              {['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General Practice'].map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleQuickSpecialty(spec)}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/50 transition-all cursor-pointer shadow-2xs"
                >
                  {spec}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mt-14 relative z-10">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/80">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Instant Availability</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Real-time open slots synced directly with verified outpatient hospital clinics.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/80">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Direct In-Person Visits</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Guaranteed 30-minute face-to-face appointments with leading specialists.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/80">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">SMS Confirmation</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Instant mobile SMS verification, directions, and fast clinic check-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOP SPECIALTIES: Quick Access Visual Tiles                             */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full mb-2 border border-teal-200">
              Specialized Care
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Top Medical Specialties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a clinical domain to view accredited physicians with open appointments.
            </p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 shrink-0"
          >
            <span>View All Specialties</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {popularSpecialties.map((spec) => {
            const Icon = spec.icon;
            return (
              <button
                key={spec.name}
                type="button"
                onClick={() => handleQuickSpecialty(spec.name)}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 text-center hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center justify-between"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 border ${spec.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {spec.name}
                </h3>
                <span className="text-[10px] font-semibold text-slate-400 mt-1">
                  {spec.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MEET OUR DOCTORS: Doctor Cards with Direct Booking (PDF Page 2)        */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full mb-2 border border-teal-200">
              Verified Physicians
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Hospital Specialists
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Experienced, board-certified doctors available for direct 30-minute in-person consultations.
            </p>
          </div>

          {/* Specialty Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {['All', 'Cardiology', 'Dermatology', 'Orthopedics', 'General Practice'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDoctorCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  doctorCategory === cat
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Doctor Photo & Rating */}
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
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-400" />
                    <span>Available this week</span>
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

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {doc.name}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 line-clamp-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{doc.hospitalName || 'CMC Hospital Dubai'}</span>
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {doc.about}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link
                  to={`/book/doctor/${doc.id}`}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs shadow-teal-600/20 cursor-pointer"
                >
                  <span>Book 30-Min Visit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 hover:border-teal-400 transition-all shadow-2xs"
          >
            <span>Explore All 500+ Hospital Specialists</span>
            <ArrowRight className="w-4 h-4 text-teal-600" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECOMMENDED DOCTORS BY LOCATION & NEED (Replaces Waitlist Card!)       */}
      {/* ========================================================================= */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-xs font-bold text-teal-300 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Smart Location & Care Matcher</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Recommended Doctors Available Near You
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/70 mt-1 max-w-xl">
                Real-time verified hospital appointments with confirmed outpatient slot availability.
              </p>
            </div>

            {/* Location Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/15 backdrop-blur-xs">
              {[
                { id: 'All', label: 'All UAE' },
                { id: 'Al Jaddaf', label: 'Al Jaddaf (CMC)' },
                { id: 'Downtown', label: 'Downtown' },
                { id: 'Healthcare City', label: 'DHCC' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setRecommendedFilter(loc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    recommendedFilter === loc.id
                      ? 'bg-teal-500 text-slate-950 shadow-xs'
                      : 'text-teal-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/95 rounded-2xl p-4 text-slate-900 border border-white/20 shadow-md flex flex-col justify-between hover:scale-[1.02] transition-all"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-13 h-13 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 truncate mt-0.5">{doc.name}</h4>
                      <p className="text-[11px] font-bold text-teal-700 truncate">{doc.specialty}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{doc.location}</span>
                  </p>

                  {/* Real-time next available slot */}
                  <div className="mt-3 bg-emerald-50 border border-emerald-200/80 rounded-xl p-2 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Next Slot: Today
                    </span>
                    <span className="font-mono font-bold text-[11px] text-emerald-700">
                      10:30 AM
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Consultation</span>
                    <span className="text-xs font-black text-slate-900">AED {doc.consultationFee}</span>
                  </div>
                  <Link
                    to={`/book/doctor/${doc.id}`}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Concierge Help bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-teal-100">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
              <span>All consultations take place at verified, accredited UAE hospital facilities.</span>
            </div>
            <Link
              to="/doctors"
              className="text-white font-bold hover:text-teal-300 flex items-center gap-1 shrink-0"
            >
              <span>Explore all available slots by location</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACCREDITED PARTNER HOSPITALS (PDF Page 7 Showcase)                     */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full mb-2 border border-teal-200">
            Hospital Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Accredited Partner Facilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Your consultations take place at verified, world-class medical facilities with dedicated outpatient clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {partnerHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100">
                  <img
                    src={hosp.photo}
                    alt={hosp.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-900 flex items-center gap-1 shadow-xs border border-slate-200">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{hosp.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {hosp.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{hosp.location}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {hosp.about}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/hospitals/${hosp.id}`}
                  className="w-full py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Facility & Doctors</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS (PDF Page 4)                                              */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full mb-2 border border-teal-200">
            Effortless Flow
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            A doctor&apos;s appointment in three simple steps.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            We built meetAdr because booking care shouldn&apos;t feel like a chore. Guaranteed slots, immediate confirmations, and zero hold music.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-14">
          <div>
            <span className="text-3xl sm:text-4xl font-black block">3 steps</span>
            <span className="text-xs text-teal-200 font-medium mt-1 block">to book any appointment</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black block">&lt; 60 sec</span>
            <span className="text-xs text-teal-200 font-medium mt-1 block">average booking time</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black block">500+</span>
            <span className="text-xs text-teal-200 font-medium mt-1 block">specialists on the platform</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black block">100%</span>
            <span className="text-xs text-teal-200 font-medium mt-1 block">guaranteed outpatient slots</span>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 space-y-3 shadow-xs hover:border-teal-400 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 font-black text-sm flex items-center justify-center border border-teal-200">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Choose Specialist & Facility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter by specialty, symptom, or hospital across accredited Dubai and UAE outpatient centers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 space-y-3 shadow-xs hover:border-teal-400 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 font-black text-sm flex items-center justify-center border border-teal-200">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Select Exact 30-Min Slot</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              View guaranteed real-time availability slots that match your daily routine.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 space-y-3 shadow-xs hover:border-teal-400 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 font-black text-sm flex items-center justify-center border border-teal-200">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">In-Person Consultation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive immediate SMS confirmation and automated hospital intake for zero waiting room friction.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BROWSE BY HEALTH CONDITION: Interactive A-Z Navigator (PDF Page 1)    */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full mb-2 border border-teal-200">
            Symptom & Condition Index
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Browse by Health Condition
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Find the right specialist for your symptoms — from common concerns to specialized treatment.
          </p>
        </div>

        {/* Alphabet Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto mb-8">
          {CONDITION_LETTERS.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-teal-600 text-white shadow-2xs scale-105'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Condition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredConditions.map((cond) => (
            <div
              key={cond.name}
              onClick={() => handleQuickSpecialty(cond.specialtyQuery)}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                    {cond.letter}
                  </span>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {cond.specialist}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors mt-2">
                  {cond.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {cond.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                <span>Find Matched Specialist</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

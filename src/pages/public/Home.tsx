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
  Hospital,
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
  X,
  Brain,
  Eye,
} from 'lucide-react';
import { INITIAL_DOCTORS } from '../../data/mockDoctors';
import { INITIAL_HOSPITALS } from '../../data/mockHospitals';
import { HEALTH_CONDITIONS, CONDITION_LETTERS, ALPHABET_LETTERS } from '../../data/mockConditions';
import { useToast } from '../../context/ToastContext';
import { HospitalBrandLogo } from '../../components/common/HospitalLogos';

// Helper for displaying hospital names in one single word
const getOneWordHospitalName = (hosp: { id: string; name: string }): string => {
  const shortNames: Record<string, string> = {
    hosp_cmc: 'American Hospital',
    hosp_1: 'CityCare',
    hosp_2: 'Emirates',
    hosp_3: 'Al-Noor',
    hosp_4: 'Gulf',
    hosp_5: 'Marina',
    hosp_6: 'Capital',
    hosp_7: 'Al-Zahra',
    hosp_8: 'Sharjah',
  };
  return shortNames[hosp.id] || hosp.name.split(/[\s-(]+/)[0] || hosp.name;
};
import { useTranslation } from '../../i18n';

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
  { name: 'Al Jaddaf', hub: 'American Hospital Dubai Medical Hub', emirate: 'Dubai' },
  { name: 'Dubai Healthcare City', hub: 'DHCC Phase 1 & 2 Clinics', emirate: 'Dubai' },
  { name: 'Downtown Dubai', hub: 'Near Burj Khalifa & Financial Center', emirate: 'Dubai' },
  { name: 'Jumeirah', hub: 'Al Wasl Road Medical Centers', emirate: 'Dubai' },
  { name: 'Deira', hub: 'Canadian Specialist Hospital area', emirate: 'Dubai' },
  { name: 'Dubai Marina', hub: 'Marina Walk & JBR Healthcare', emirate: 'Dubai' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, isRTL, isArabic, translateSpecialty, translateLocation } = useTranslation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedEmirate, setSelectedEmirate] = useState('Dxb');

  // Autocomplete dropdown visibility
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);

  // Recommendation location filter for the recommended section
  const [recommendedFilter, setRecommendedFilter] = useState('All');


  // Category filter state for doctors
  const [doctorCategory, setDoctorCategory] = useState('All');

  const specialtyRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);

  const getSpecialtyName = (spec: { name: string; specialtyQuery: string }) => {
    if (!isArabic) return spec.name;
    const arNames: Record<string, string> = {
      'Cardiology': 'أمراض وجراحة القلب',
      'Orthopedics': 'جراحة العظام والمفاصل',
      'Pediatrics': 'طب الأطفال وحديثي الولادة',
      'General Practice': 'الطب العام وطب الأسرة',
      'Neurology': 'المخ والأعصاب',
      'Ophthalmology': 'طب وجراحة العيون',
      'Skin Care': 'الأمراض الجلدية والتجميل',
      'Dental': 'طب وجراحة الأسنان',
      'ENT': 'الأنف والأذن والحنجرة',
      'Physiotherapy': 'العلاج الطبيعي والتأهيل',
      'Radiology': 'الأشعة التشخيصية',
      'Laboratory': 'المختبرات والتحاليل الطبية',
    };
    return arNames[spec.specialtyQuery] || translateSpecialty(spec.specialtyQuery) || spec.name;
  };

  const getSpecialtyCount = (countStr: string) => {
    if (!isArabic) return countStr;
    const num = countStr.split(' ')[0] || '';
    return `${num} استشاري معتمد`;
  };

  const getSpecialtyDesc = (spec: { desc: string; specialtyQuery: string }) => {
    if (!isArabic) return spec.desc;
    const arDescs: Record<string, string> = {
      'Cardiology': 'رعاية القلب والشرايين والقسطرة',
      'Orthopedics': 'المفاصل والعمود الفقري والعظام',
      'Pediatrics': 'رعاية الأطفال وحديثي الولادة',
      'General Practice': 'طب الأسرة والفحوصات الشاملة',
      'Neurology': 'الدماغ والأعصاب والعمود الفقري',
      'Ophthalmology': 'رعاية العيون وجراحة الليزك',
      'Skin Care': 'علاج الأمراض الجلدية والعناية التجميلية',
      'Dental': 'صحة الفم وتقويم وجراحة الأسنان',
      'ENT': 'الجيوب الأنفية والسمع وجراحة الحنجرة',
      'Physiotherapy': 'استعادة الحركة والتأهيل الرياضي',
      'Radiology': 'أشعة الرنين المغناطيسي والمقطعية والسونار',
      'Laboratory': 'الفحوصات السريرية والتشخيص الدقيق',
    };
    return arDescs[spec.specialtyQuery] || spec.desc;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (specialtyRef.current && !specialtyRef.current.contains(target)) {
        setShowSpecialtyDropdown(false);
      }
      if (conditionRef.current && !conditionRef.current.contains(target)) {
        setShowConditionDropdown(false);
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
    if (selectedCondition.trim()) {
      const matched = HEALTH_CONDITIONS.find(
        (c) => c.name.toLowerCase() === selectedCondition.trim().toLowerCase()
      );
      if (matched) {
        params.append('specialty', matched.specialtyQuery);
        if (!searchQuery.trim()) {
          params.append('q', matched.name);
        }
      } else {
        if (!searchQuery.trim()) {
          params.append('q', selectedCondition.trim());
        }
      }
    }
    if (selectedEmirate) params.append('emirate', selectedEmirate);
    navigate(`/search?${params.toString()}`);
  };

  // Quick specialty select
  const handleQuickSpecialty = (specialty: string) => {
    navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`);
  };

  // Popular specialties list
  const popularSpecialties = [
    { name: 'Cardiology', icon: HeartPulse, count: `42 ${t('common.doctors')}`, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'Dermatology', icon: Sparkles, count: `38 ${t('common.doctors')}`, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Orthopedics', icon: Bone, count: `35 ${t('common.doctors')}`, color: 'text-slate-200 bg-[#0C1A22] border-slate-800' },
    { name: 'Pediatrics', icon: Baby, count: `29 ${t('common.doctors')}`, color: 'text-emerald-400 bg-emerald-950/40 border-slate-800' },
    { name: 'General Practice', icon: Stethoscope, count: `54 ${t('common.doctors')}`, color: 'text-slate-200 bg-[#0C1A22] border-slate-800' },
    { name: 'Neurology', icon: Activity, count: `21 ${t('common.doctors')}`, color: 'text-purple-400 bg-purple-950/40 border-slate-800' },
  ];

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

  // Filtered hospitals for hero search input
  const filteredHospitals = INITIAL_HOSPITALS.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      (h.specialties && h.specialties.some((sp) => sp.toLowerCase().includes(q)))
    );
  }).slice(0, 5);

  // Filtered doctors for hero search input (active when user types)
  const matchingSearchDoctors = searchQuery.trim()
    ? INITIAL_DOCTORS.filter((d) => {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          (d.hospitalName && d.hospitalName.toLowerCase().includes(q))
        );
      }).slice(0, 3)
    : [];

  // Recommended doctors filtered by location
  const recommendedDoctors = INITIAL_DOCTORS.filter((doc) => {
    if (recommendedFilter === 'All') return true;
    return doc.location.toLowerCase().includes(recommendedFilter.toLowerCase());
  }).slice(0, 4);

  // Top hospital partners
  const partnerHospitals = INITIAL_HOSPITALS.slice(0, 4);

  return (
    <div className="bg-[#F4F7F9] text-slate-900 min-h-screen selection:bg-teal-100 selection:text-teal-950">

      {/* ========================================================================= */}
      {/* 1. HERO & UNIFIED SEARCH CONSOLE WITH SMART AUTOCOMPLETE                   */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 bg-[#F4F7F9] border-b border-[#E2EBF0] overflow-x-clip">
        {/* Subtle Surgical Theater Background with Low Light Opacity */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src="/images/hero-surgery-bg.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-[0.06] sm:opacity-[0.08] mix-blend-multiply scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F4F7F9]/80 via-transparent to-[#F4F7F9]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F7F9]/70 via-transparent to-[#F4F7F9]/70" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left rtl:lg:text-right">
              {/* Trust Pill */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#E2EBF0] text-[11px] sm:text-xs font-semibold text-slate-700 mb-6 max-w-full shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#2DA7B5] shrink-0" />
                <span className="truncate sm:whitespace-normal">{t('home.trustPill')}</span>
              </motion.div>

              {/* Master Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.12]"
              >
                {t('home.heroAccreditedTitle')}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm sm:text-base lg:text-lg text-slate-600 mt-4 max-w-xl leading-relaxed"
              >
                {t('home.heroAccreditedSubtitle')}
              </motion.p>
            </div>

            {/* Right: Hero Doctor Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:flex justify-center lg:justify-end relative"
            >
              <div className="relative">
                <div className="w-[380px] h-[440px] rounded-3xl overflow-hidden border border-[#E2EBF0] shadow-md">
                  <img
                    src="/images/hero-doctor.jpg"
                    alt="Professional doctor"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Floating trust badge */}
                <div className="absolute -bottom-4 -left-6 rtl:-left-auto rtl:-right-6 bg-white rounded-2xl border border-[#E2EBF0] px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F6F8] text-[#0E7490] flex items-center justify-center border border-[#CDEBF0]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">500+ Verified</p>
                    <p className="text-[10px] text-slate-500">Licensed Specialists</p>
                  </div>
                </div>
                {/* Floating availability badge */}
                <div className="absolute -top-3 -right-4 rtl:-right-auto rtl:-left-4 bg-white rounded-xl border border-[#E2EBF0] px-3 py-2 flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-800">Available Today</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Unified Search Console with Smart Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="max-w-4xl mx-auto mt-8 sm:mt-10 relative z-30 w-full"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl sm:rounded-full border border-[#E2EBF0] hover:border-[#CBD5E1] p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all relative w-full shadow-xs"
            >
              {/* Field 1: Doctor / Specialty with Autocomplete */}
              <div className="flex-1 relative min-w-0" ref={specialtyRef}>
                <div className="flex items-center px-4 py-3 sm:py-2.5 bg-[#F8FAFC] sm:bg-transparent rounded-xl sm:rounded-none">
                  <Search className="w-4 h-4 text-slate-400 mr-3 rtl:mr-0 rtl:ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowSpecialtyDropdown(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSpecialtyDropdown(true);
                    }}
                    placeholder={t('home.searchPlaceholder')}
                    className="w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer ml-1 rtl:ml-0 rtl:mr-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Doctor & Hospital Dropdown Suggestions */}
                <AnimatePresence>
                  {showSpecialtyDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 sm:right-auto rtl:sm:right-0 rtl:sm:left-auto sm:w-96 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E2EBF0] p-3 z-50 text-left rtl:text-right divide-y divide-slate-100 max-w-[calc(100vw-32px)] max-h-96 overflow-y-auto backdrop-blur-xl text-slate-900"
                    >
                      {/* Section: Matching Doctors (active when user types) */}
                      {matchingSearchDoctors.length > 0 && (
                        <div className="pb-2.5">
                          <p className="text-[10px] font-bold text-[#0E7490] uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                            <Stethoscope className="w-3 h-3 text-[#2DA7B5]" />
                            {t('common.doctors')}
                          </p>
                          <div className="space-y-1">
                            {matchingSearchDoctors.map((doc) => (
                              <button
                                key={doc.id}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(doc.name);
                                  setShowSpecialtyDropdown(false);
                                }}
                                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left rtl:text-right transition-colors cursor-pointer group"
                              >
                                <img
                                  src={doc.photo}
                                  alt={doc.name}
                                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E2EBF0]"
                                />
                                <div className="truncate flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#0E7490] block truncate">
                                      {doc.name}
                                    </span>
                                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0">
                                      ★ {doc.rating}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {doc.hospitalName || doc.location}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section: Suggested / Matching Hospitals */}
                      {filteredHospitals.length > 0 && (
                        <div className={matchingSearchDoctors.length > 0 ? "pt-2.5" : ""}>
                          <div className="flex items-center justify-between px-2 mb-2">
                            <p className="text-[10px] font-bold text-[#0E7490] uppercase tracking-wider flex items-center gap-1.5">
                              <Building2 className="w-3 h-3 text-[#2DA7B5]" />
                              {t('home.suggestedHospitalsTitle')}
                            </p>
                            <Link
                              to="/hospitals"
                              onClick={() => setShowSpecialtyDropdown(false)}
                              className="text-[10px] font-bold text-[#0E7490] hover:text-[#08596F] transition-colors"
                            >
                              {t('common.viewAll')} →
                            </Link>
                          </div>
                          <div className="space-y-1">
                            {filteredHospitals.map((hosp) => (
                              <button
                                key={hosp.id}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(hosp.name);
                                  setShowSpecialtyDropdown(false);
                                }}
                                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left rtl:text-right transition-colors cursor-pointer group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#E8F6F8] text-[#0E7490] flex items-center justify-center shrink-0 overflow-hidden border border-[#CDEBF0]">
                                  {hosp.photo ? (
                                    <img
                                      src={hosp.photo}
                                      alt={hosp.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Building2 className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                <div className="truncate flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#0E7490] block truncate">
                                      {hosp.name}
                                    </span>
                                    <span className="text-[9px] font-bold text-[#0E7490] bg-[#E8F6F8] border border-[#CDEBF0] px-1.5 py-0.5 rounded-full shrink-0">
                                      {hosp.doctorCount} {t('common.doctors')}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 block truncate">
                                    {translateLocation(hosp.location)}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty state if neither doctors nor hospitals match */}
                      {matchingSearchDoctors.length === 0 && filteredHospitals.length === 0 && (
                        <div className="p-4 text-center">
                          <p className="text-xs font-bold text-slate-800">No doctors or hospitals found</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Try searching with another doctor or hospital name</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block w-px h-8 bg-[#E2EBF0]" />

              {/* Field 2: Health Condition with Autocomplete */}
              <div className="flex-1 relative min-w-0" ref={conditionRef}>
                <div className="flex items-center px-4 py-3 sm:py-2.5 bg-[#F8FAFC] sm:bg-transparent rounded-xl sm:rounded-none">
                  <Activity className="w-4 h-4 text-[#2DA7B5] mr-3 rtl:mr-0 rtl:ml-3 shrink-0" />
                  <input
                    type="text"
                    value={selectedCondition}
                    onFocus={() => setShowConditionDropdown(true)}
                    onChange={(e) => {
                      setSelectedCondition(e.target.value);
                      setShowConditionDropdown(true);
                    }}
                    placeholder={t('home.conditionPlaceholder')}
                    className="w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
                  />
                  {selectedCondition && (
                    <button
                      type="button"
                      onClick={() => setSelectedCondition('')}
                      className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer ml-1 rtl:ml-0 rtl:mr-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Health Condition Dropdown Suggestions */}
                <AnimatePresence>
                  {showConditionDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 sm:right-auto rtl:sm:right-0 rtl:sm:left-auto sm:w-88 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E2EBF0] p-3 z-50 text-left rtl:text-right max-w-[calc(100vw-32px)] max-h-80 overflow-y-auto backdrop-blur-xl text-slate-900"
                    >
                      <p className="text-[10px] font-bold text-[#0E7490] uppercase tracking-wider px-2 mb-2">
                        {t('home.suggestedConditionsTitle')}
                      </p>
                      <div className="space-y-1">
                        {HEALTH_CONDITIONS.filter((c) =>
                          c.name.toLowerCase().includes(selectedCondition.toLowerCase()) ||
                          c.specialist.toLowerCase().includes(selectedCondition.toLowerCase()) ||
                          c.description.toLowerCase().includes(selectedCondition.toLowerCase())
                        ).map((cond) => (
                          <button
                            key={cond.name}
                            type="button"
                            onClick={() => {
                              setSelectedCondition(cond.name);
                              setShowConditionDropdown(false);
                            }}
                            className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left rtl:text-right transition-colors cursor-pointer group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#E8F6F8] group-hover:bg-[#D4EFF3] text-[#0E7490] flex items-center justify-center shrink-0 mt-0.5 border border-[#CDEBF0]">
                              <HeartPulse className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-[#0E7490] block truncate">
                                  {cond.name}
                                </span>
                                <span className="text-[9px] font-bold text-[#0E7490] bg-[#E8F6F8] border border-[#CDEBF0] px-1.5 py-0.5 rounded-full shrink-0">
                                  {cond.specialist.split('/')[0].trim()}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {cond.description}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block w-px h-8 bg-[#E2EBF0]" />

              {/* Field 3: Emirate */}
              <div className="flex items-center px-3 py-3 sm:py-2.5 bg-[#F8FAFC] sm:bg-transparent rounded-xl sm:rounded-none sm:w-36 min-w-0">
                <select
                  value={selectedEmirate}
                  onChange={(e) => setSelectedEmirate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer [&>option]:bg-white [&>option]:text-slate-900"
                >
                  <option value="Dxb">{t('emirates.dubai')} (Dxb)</option>
                  <option value="Abu Dhabi">{t('emirates.abuDhabi')}</option>
                  <option value="Sharjah">{t('emirates.sharjah')}</option>
                  <option value="Ajman">{t('emirates.ajman')}</option>
                  <option value="Ras Al Khaimah">{t('emirates.rasAlKhaimah')}</option>
                </select>
              </div>

              {/* Action CTA Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-[#2DA7B5] hover:bg-[#23929F] text-white rounded-xl sm:rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95 shadow-xs"
              >
                <span>{t('home.searchButton')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>

            {/* Quick Specialty Shortcut Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-1 rtl:mr-0 rtl:ml-1">
                {t('home.suggestedLabel')}
              </span>
              {['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General Practice'].map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleQuickSpecialty(spec)}
                  className="px-3 py-1 rounded-full bg-white border border-[#E2EBF0] text-slate-700 font-medium hover:border-[#2DA7B5] hover:text-[#0E7490] hover:bg-[#E8F6F8] transition-all cursor-pointer shadow-2xs"
                >
                  {translateSpecialty(spec)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Partner Hospitals Auto-Sliding Marquee Ticker */}
          <div className="mt-16 sm:mt-24 lg:mt-28 max-w-6xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DA7B5]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isArabic ? 'المستشفيات والمراكز الطبية المعتمدة الشريكة' : 'Accredited Hospital Network & Clinic Partners'}
              </span>
            </div>

            <div className="relative overflow-hidden py-3 bg-white border border-[#E2EBF0] rounded-2xl shadow-xs marquee-track-container" dir="ltr">
              {/* Subtle edge fade overlays */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

              <div className="animate-slide-left gap-3 sm:gap-4 items-center" dir="ltr">
                {[...INITIAL_HOSPITALS, ...INITIAL_HOSPITALS].map((hosp, idx) => (
                  <Link
                    to={`/hospitals/${hosp.id}`}
                    key={`partner-ticker-${hosp.id}-${idx}`}
                    className="inline-flex items-center justify-center px-1.5 sm:px-2 py-1 shrink-0 group cursor-pointer transition-all duration-200 hover:scale-105 opacity-90 hover:opacity-100"
                  >
                    <HospitalBrandLogo hospitalId={hosp.id} className="h-8 sm:h-9 w-auto" theme="light" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOP SPECIALTIES & CLINICAL DISCIPLINES: Image-Driven Cards              */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-block px-3 py-1 bg-white border border-[#E2EBF0] text-slate-700 text-xs font-semibold rounded-full mb-2 shadow-2xs">
              {t('home.specializedCare')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Top Specialties & Clinical Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('home.exploreSpecialtiesDesc')}
            </p>
          </div>
          <Link
            to="/specialties"
            className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 shrink-0 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all border border-[#E2EBF0] shadow-xs"
          >
            <span>{t('home.viewAllSpecialties')}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {/* Two-line infinite auto-sliding marquee: First line slides right, Second line slides left */}
        <div className="relative overflow-hidden space-y-4 sm:space-y-5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 marquee-track-container" dir="ltr">
          {/* Subtle edge fade overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-[#F4F7F9] via-[#F4F7F9]/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-24 bg-gradient-to-l from-[#F4F7F9] via-[#F4F7F9]/80 to-transparent z-10" />

          {/* First Line: Slides to the RIGHT */}
          <div className="overflow-hidden w-full marquee-track-container" dir="ltr">
            <div className="animate-slide-right gap-4 sm:gap-5" dir="ltr">
              {[
                {
                  name: 'Skin Care & Aesthetic',
                  specialtyQuery: 'Skin Care',
                  desc: 'Dermatology & clinical skin care',
                  image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '38 Specialists',
                  icon: Sparkles,
                },
                {
                  name: 'Dental Care',
                  specialtyQuery: 'Dental',
                  desc: 'Oral health & orthodontics',
                  image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '45 Specialists',
                  icon: Award,
                },
                {
                  name: 'ENT (Ear, Nose & Throat)',
                  specialtyQuery: 'ENT',
                  desc: 'Sinus, hearing & voice care',
                  image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '28 Specialists',
                  icon: Activity,
                },
                {
                  name: 'Physiotherapy & Rehab',
                  specialtyQuery: 'Physiotherapy',
                  desc: 'Mobility & sports recovery',
                  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '34 Specialists',
                  icon: Users,
                },
                {
                  name: 'Radiology & Diagnostics',
                  specialtyQuery: 'Radiology',
                  desc: '3T MRI, CT scans & ultrasound',
                  image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '26 Specialists',
                  icon: Zap,
                },
                {
                  name: 'Medical Laboratory',
                  specialtyQuery: 'Laboratory',
                  desc: 'Pathology & clinical testing',
                  image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '22 Specialists',
                  icon: CheckCircle,
                },
                // Duplicate for seamless infinite loop
                {
                  name: 'Skin Care & Aesthetic',
                  specialtyQuery: 'Skin Care',
                  desc: 'Dermatology & clinical skin care',
                  image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '38 Specialists',
                  icon: Sparkles,
                },
                {
                  name: 'Dental Care',
                  specialtyQuery: 'Dental',
                  desc: 'Oral health & orthodontics',
                  image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '45 Specialists',
                  icon: Award,
                },
                {
                  name: 'ENT (Ear, Nose & Throat)',
                  specialtyQuery: 'ENT',
                  desc: 'Sinus, hearing & voice care',
                  image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '28 Specialists',
                  icon: Activity,
                },
                {
                  name: 'Physiotherapy & Rehab',
                  specialtyQuery: 'Physiotherapy',
                  desc: 'Mobility & sports recovery',
                  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '34 Specialists',
                  icon: Users,
                },
                {
                  name: 'Radiology & Diagnostics',
                  specialtyQuery: 'Radiology',
                  desc: '3T MRI, CT scans & ultrasound',
                  image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '26 Specialists',
                  icon: Zap,
                },
                {
                  name: 'Medical Laboratory',
                  specialtyQuery: 'Laboratory',
                  desc: 'Pathology & clinical testing',
                  image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '22 Specialists',
                  icon: CheckCircle,
                },
              ].map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <button
                    key={`line1-${spec.name}-${idx}`}
                    type="button"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    onClick={() => handleQuickSpecialty(spec.specialtyQuery)}
                    className="group relative rounded-2xl overflow-hidden w-64 sm:w-72 md:w-80 h-38 sm:h-44 shrink-0 transition-all duration-300 hover:scale-[1.02] border border-slate-800 hover:border-slate-700 text-left rtl:text-right cursor-pointer"
                  >
                    {/* Background image */}
                    <img
                      src={spec.image}
                      alt={spec.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081217] via-[#081217]/50 to-transparent" />

                    {/* Top badge: Specialists Count */}
                    <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#0C1A22] text-[10px] font-semibold text-slate-200 border border-slate-800">
                        {getSpecialtyCount(spec.doctorCount)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-left rtl:text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 shrink-0">
                          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-slate-100 transition-colors truncate">
                          {getSpecialtyName(spec)}
                        </h3>
                      </div>
                      <p className="text-[10px] text-white/70 font-medium truncate">{getSpecialtyDesc(spec)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Second Line: Slides to the LEFT */}
          <div className="overflow-hidden w-full marquee-track-container" dir="ltr">
            <div className="animate-slide-left gap-4 sm:gap-5" dir="ltr">
              {[
                {
                  name: 'Cardiology',
                  specialtyQuery: 'Cardiology',
                  desc: 'Heart & cardiovascular care',
                  image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '42 Specialists',
                  icon: HeartPulse,
                },
                {
                  name: 'Orthopedics',
                  specialtyQuery: 'Orthopedics',
                  desc: 'Joints, bones & spine surgery',
                  image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '35 Specialists',
                  icon: Bone,
                },
                {
                  name: 'Pediatrics',
                  specialtyQuery: 'Pediatrics',
                  desc: 'Child health & newborn care',
                  image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '29 Specialists',
                  icon: Baby,
                },
                {
                  name: 'General Practice',
                  specialtyQuery: 'General Practice',
                  desc: 'Family medicine & wellness',
                  image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '54 Specialists',
                  icon: Stethoscope,
                },
                {
                  name: 'Neurology',
                  specialtyQuery: 'Neurology',
                  desc: 'Brain, nerves & headache care',
                  image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '21 Specialists',
                  icon: Brain,
                },
                {
                  name: 'Ophthalmology',
                  specialtyQuery: 'Ophthalmology',
                  desc: 'Vision care & LASIK surgery',
                  image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '24 Specialists',
                  icon: Eye,
                },
                // Duplicate for seamless infinite loop
                {
                  name: 'Cardiology',
                  specialtyQuery: 'Cardiology',
                  desc: 'Heart & cardiovascular care',
                  image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '42 Specialists',
                  icon: HeartPulse,
                },
                {
                  name: 'Orthopedics',
                  specialtyQuery: 'Orthopedics',
                  desc: 'Joints, bones & spine surgery',
                  image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '35 Specialists',
                  icon: Bone,
                },
                {
                  name: 'Pediatrics',
                  specialtyQuery: 'Pediatrics',
                  desc: 'Child health & newborn care',
                  image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '29 Specialists',
                  icon: Baby,
                },
                {
                  name: 'General Practice',
                  specialtyQuery: 'General Practice',
                  desc: 'Family medicine & wellness',
                  image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '54 Specialists',
                  icon: Stethoscope,
                },
                {
                  name: 'Neurology',
                  specialtyQuery: 'Neurology',
                  desc: 'Brain, nerves & headache care',
                  image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '21 Specialists',
                  icon: Brain,
                },
                {
                  name: 'Ophthalmology',
                  specialtyQuery: 'Ophthalmology',
                  desc: 'Vision care & LASIK surgery',
                  image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80',
                  doctorCount: '24 Specialists',
                  icon: Eye,
                },
              ].map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <button
                    key={`line2-${spec.name}-${idx}`}
                    type="button"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    onClick={() => handleQuickSpecialty(spec.specialtyQuery)}
                    className="group relative rounded-2xl overflow-hidden w-64 sm:w-72 md:w-80 h-38 sm:h-44 shrink-0 transition-all duration-300 hover:scale-[1.02] border border-[#E2EBF0] hover:border-[#2DA7B5] text-left rtl:text-right cursor-pointer shadow-xs"
                  >
                    {/* Background image */}
                    <img
                      src={spec.image}
                      alt={spec.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                    {/* Top badge: Specialists Count */}
                    <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-semibold text-slate-800 border border-[#E2EBF0] shadow-xs">
                        {getSpecialtyCount(spec.doctorCount)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 text-left rtl:text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 shrink-0">
                          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-slate-100 transition-colors truncate">
                          {getSpecialtyName(spec)}
                        </h3>
                      </div>
                      <p className="text-[10px] text-white/80 font-medium truncate">{getSpecialtyDesc(spec)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explore all specialties footer link */}
        <div className="mt-8 text-center">
          <Link
            to="/specialties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[#E2EBF0] text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs"
          >
            <span>{t('home.viewAllSpecialties')}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MEET OUR DOCTORS: Doctor Cards with Direct Booking (PDF Page 2)        */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2EBF0] bg-[#F4F7F9]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-white border border-[#E2EBF0] text-slate-700 text-xs font-semibold rounded-full mb-2 shadow-2xs">
              {t('home.verifiedPhysicians')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('home.featuredSpecialistsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {t('home.featuredSpecialistsDesc')}
            </p>
          </div>

          {/* Specialty Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-[#E2EBF0] shadow-2xs">
            {['All', 'Cardiology', 'Dermatology', 'Orthopedics', 'General Practice'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDoctorCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  doctorCategory === cat
                    ? 'bg-[#2DA7B5] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? t('common.all') : translateSpecialty(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-[#E2EBF0] overflow-hidden hover:border-[#2DA7B5] transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                {/* Doctor Photo & Rating */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 border border-[#E2EBF0] shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-700 flex items-center gap-1 border border-[#E2EBF0] shadow-xs">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{t('home.availableThisWeek')}</span>
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

                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#0E7490] transition-colors leading-snug">
                    {doc.name}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 line-clamp-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.hospitalName || 'American Hospital Dubai'}</span>
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
                  className="w-full py-2.5 bg-[#2DA7B5] hover:bg-[#23929F] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{t('home.book30MinVisit')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[#E2EBF0] text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs"
          >
            <span>{t('home.exploreAllSpecialists')}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECOMMENDED DOCTORS BY LOCATION & NEED                                */}
      {/* ========================================================================= */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2EBF0]">
        <div className="bg-white border border-[#E2EBF0] rounded-3xl p-6 sm:p-10 text-slate-900 shadow-sm relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F6F8] border border-[#CDEBF0] text-xs font-semibold text-[#0E7490] mb-2">
                <Compass className="w-3.5 h-3.5 text-[#2DA7B5]" />
                <span>{t('home.smartMatcher')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t('home.recommendedNearYou')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {t('home.recommendedDesc')}
              </p>
            </div>

            {/* Location Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F8FAFC] p-1.5 rounded-2xl border border-[#E2EBF0]">
              {[
                { id: 'All', label: t('home.allUae') },
                { id: 'Oud Metha', label: t('home.alJaddafCmc') },
                { id: 'Downtown', label: t('home.downtown') },
                { id: 'Healthcare City', label: t('home.dhcc') },
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setRecommendedFilter(loc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    recommendedFilter === loc.id
                      ? 'bg-[#2DA7B5] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                className="bg-[#F8FAFC] rounded-2xl p-4 text-slate-900 border border-[#E2EBF0] flex flex-col justify-between hover:scale-[1.02] hover:border-[#2DA7B5] hover:bg-white hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <Link to={`/doctors/${doc.id}`} className="shrink-0">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-13 h-13 rounded-xl object-cover border border-[#E2EBF0] hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="truncate">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                      </div>
                      <Link to={`/doctors/${doc.id}`}>
                        <h4 className="text-sm font-black text-slate-900 truncate mt-0.5 hover:text-[#2DA7B5] transition-colors">{doc.name}</h4>
                      </Link>
                      <p className="text-[11px] font-semibold text-[#0E7490] truncate">{translateSpecialty(doc.specialty)}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{translateLocation(doc.location)}</span>
                  </p>

                  {/* Real-time next available slot */}
                  <div className="mt-3 bg-white border border-[#E2EBF0] rounded-xl p-2 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-semibold text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {t('home.nextSlotToday')}
                    </span>
                    <span className="font-mono font-bold text-[11px] text-slate-900">
                      10:30 AM
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2EBF0] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t('home.consultation')}</span>
                    <span className="text-xs font-black text-slate-900">{t('common.aed')} {doc.consultationFee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/doctors/${doc.id}`}
                      className="px-2.5 py-1.5 bg-white hover:bg-[#E8F6F8] hover:border-[#2DA7B5] hover:text-[#0E7490] text-slate-700 border border-[#CBD5E1] text-[11px] font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      {t('doctors.viewProfile')}
                    </Link>
                    <Link
                      to={`/book/doctor/${doc.id}`}
                      className="px-3 py-1.5 bg-[#2DA7B5] hover:bg-[#23929F] text-white text-[11px] font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t('home.book')}</span>
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Concierge Help bar */}
          <div className="mt-8 pt-6 border-t border-[#E2EBF0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600">
              <ShieldCheck className="w-5 h-5 text-[#2DA7B5] shrink-0" />
              <span>{t('home.facilityNotice')}</span>
            </div>
            <Link
              to="/doctors"
              className="text-[#2DA7B5] hover:text-[#23929F] font-bold flex items-center gap-1 shrink-0"
            >
              <span>{t('home.exploreByLocation')}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACCREDITED PARTNER HOSPITALS (PDF Page 7 Showcase)                     */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2EBF0]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-[#E8F6F8] border border-[#CDEBF0] text-[#0E7490] text-xs font-semibold rounded-full mb-2">
            {t('common.hospitalNetwork')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('home.partnerFacilitiesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            {t('home.partnerFacilitiesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {partnerHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-[#E2EBF0] overflow-hidden hover:border-[#2DA7B5] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={hosp.photo}
                    alt={hosp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 flex items-center gap-1 border border-[#E2EBF0] shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{hosp.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#2DA7B5] transition-colors leading-snug line-clamp-1">
                    {hosp.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{translateLocation(hosp.location)}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {hosp.about}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/hospitals/${hosp.id}`}
                  className="w-full py-2 bg-[#F8FAFC] hover:bg-[#2DA7B5] hover:text-white text-slate-700 rounded-xl text-xs font-semibold border border-[#E2EBF0] hover:border-[#2DA7B5] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{t('home.viewFacilityAndDoctors')}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS (PDF Page 4)                                              */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2EBF0]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-[#E8F6F8] border border-[#CDEBF0] text-[#0E7490] text-xs font-semibold rounded-full mb-2">
            {t('home.effortlessFlow')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('home.threeStepsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {t('home.threeStepsDesc')}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="bg-white text-slate-900 border border-[#E2EBF0] rounded-3xl p-5 sm:p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center mb-14 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-[#E2EBF0]">
          <div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black block text-slate-900">3</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 block">{t('home.statsSteps')}</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black block text-slate-900">&lt; 60 sec</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 block">{t('home.statsAvgTime')}</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black block text-slate-900">500+</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 block">{t('home.statsSpecialists')}</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black block text-slate-900">100%</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 block">{t('home.statsGuarantee')}</span>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#E2EBF0] p-7 space-y-3 hover:border-[#2DA7B5] hover:shadow-md transition-all shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F6F8] text-[#2DA7B5] font-black text-sm flex items-center justify-center border border-[#CDEBF0]">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('home.step1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2EBF0] p-7 space-y-3 hover:border-[#2DA7B5] hover:shadow-md transition-all shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F6F8] text-[#2DA7B5] font-black text-sm flex items-center justify-center border border-[#CDEBF0]">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('home.step2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2EBF0] p-7 space-y-3 hover:border-[#2DA7B5] hover:shadow-md transition-all shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F6F8] text-[#2DA7B5] font-black text-sm flex items-center justify-center border border-[#CDEBF0]">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('home.step3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('home.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BROWSE BY HEALTH CONDITION: Interactive A-Z Navigator                   */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E2EBF0]">
        <div className="bg-white rounded-3xl border border-[#E2EBF0] p-6 sm:p-10 lg:p-12 text-slate-900 shadow-sm">
          <div className="max-w-4xl">
            <div className="inline-block px-3 py-1 bg-[#E8F6F8] border border-[#CDEBF0] text-[#0E7490] text-xs font-semibold rounded-full mb-3">
              {t('home.symptomIndex')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              {isArabic ? 'ابحث عن الأمراض والحالات' : 'Find Diseases & Conditions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-2xl leading-relaxed">
              {isArabic
                ? 'انقر على أي حرف أبجدي للانتقال فوراً إلى الدليل السريري المخصص واستعراض الأسباب والأعراض وحجز الأطباء المعتمدين.'
                : 'Click any alphabet letter to open our dedicated clinical directory with verified causes, symptoms, and specialist bookings.'}
            </p>

            {/* Alphabet circular buttons (A-Z) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {ALPHABET_LETTERS.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => navigate(`/conditions?letter=${letter}`)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#E2EBF0] bg-[#F8FAFC] hover:bg-[#2DA7B5] hover:text-white hover:border-[#2DA7B5] text-slate-700 font-bold text-sm flex items-center justify-center transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95 shadow-xs"
                  title={`Browse conditions starting with ${letter}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

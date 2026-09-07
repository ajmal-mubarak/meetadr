import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
  HeartHandshake,
  Award,
  Bone,
  Baby,
} from 'lucide-react';
import { INITIAL_DOCTORS } from '../../data/mockDoctors';
import { INITIAL_HOSPITALS } from '../../data/mockHospitals';
import { useToast } from '../../context/ToastContext';
import { waitlistService } from '../../services/waitlistService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Category filter state
  const [doctorCategory, setDoctorCategory] = useState('All');

  // Waitlist email state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedDate) params.append('date', selectedDate);
    navigate(`/search?${params.toString()}`);
  };

  // Quick specialty select
  const handleQuickSpecialty = (specialty: string) => {
    navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`);
  };

  // Waitlist submission
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setWaitlistLoading(true);
    try {
      await waitlistService.joinWaitlist(
        waitlistEmail.trim(),
        waitlistName.trim() || undefined
      );
      setWaitlistSubmitted(true);
      showToast('You have joined the priority access waitlist!', 'success');
      setWaitlistEmail('');
      setWaitlistName('');
    } catch {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setWaitlistLoading(false);
    }
  };

  // Key clinical specialties
  const topSpecialties = [
    {
      name: 'Cardiology',
      description: 'Cardiovascular diagnostics, ECG, heart health & hypertension',
      icon: HeartPulse,
      doctorCount: '18 Specialists',
      query: 'Cardiology',
    },
    {
      name: 'Dermatology',
      description: 'Clinical skin therapy, laser treatments & allergy care',
      icon: Sparkles,
      doctorCount: '24 Specialists',
      query: 'Dermatology',
    },
    {
      name: 'Orthopedics',
      description: 'Joint pain, fractures, spine & sports injury care',
      icon: Bone,
      doctorCount: '16 Specialists',
      query: 'Orthopedics',
    },
    {
      name: 'Pediatrics',
      description: 'Infant care, childhood wellness & vaccinations',
      icon: Baby,
      doctorCount: '22 Specialists',
      query: 'Pediatrics',
    },
    {
      name: 'Neurology',
      description: 'Migraines, vertigo, nerve & memory care',
      icon: Activity,
      doctorCount: '14 Specialists',
      query: 'Neurology',
    },
    {
      name: 'General Practice',
      description: 'Primary health checkups, screenings & acute care',
      icon: Stethoscope,
      doctorCount: '30 Specialists',
      query: 'General Medicine',
    },
  ];

  // Common clinical conditions
  const symptomCategories = [
    {
      title: 'Heart & Blood Pressure',
      symptoms: ['Chest Discomfort', 'High Blood Pressure', 'Palpitations', 'Arrhythmia'],
      specialty: 'Cardiologist',
      path: '/doctors?specialty=Cardiology',
    },
    {
      title: 'Skin, Hair & Complexion',
      symptoms: ['Persistent Acne', 'Eczema & Psoriasis', 'Allergic Rashes', 'Mole Checks'],
      specialty: 'Dermatologist',
      path: '/doctors?specialty=Dermatology',
    },
    {
      title: 'Back, Joints & Mobility',
      symptoms: ['Lower Back Pain', 'Knee Mobility Issues', 'Arthritis', 'Shoulder Strain'],
      specialty: 'Orthopedic Surgeon',
      path: '/doctors?specialty=Orthopedics',
    },
    {
      title: 'Children & Infant Health',
      symptoms: ['High Pediatric Fever', 'Childhood Vaccines', 'Growth Checkup', 'Ear Infections'],
      specialty: 'Pediatrician',
      path: '/doctors?specialty=Pediatrics',
    },
    {
      title: 'Migraines & Nervous System',
      symptoms: ['Chronic Headaches', 'Vertigo & Dizziness', 'Nerve Pain', 'Sleep Disturbance'],
      specialty: 'Neurologist',
      path: '/doctors?specialty=Neurology',
    },
    {
      title: 'Routine Health & Checkup',
      symptoms: ['Annual Physical', 'Lab Work Screening', 'Prescription Renewal', 'Flu Treatment'],
      specialty: 'General Practitioner',
      path: '/doctors?specialty=General%20Practice',
    },
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

  // Top hospital partners
  const partnerHospitals = INITIAL_HOSPITALS.slice(0, 4);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Hospital-Grade Modern Layout                            */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Trust Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800 mb-6 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
            <span>Direct In-Person Appointments • UAE Hospital Network</span>
          </motion.div>

          {/* Master Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
          >
            Book accredited hospital doctors in a single click.
          </motion.h1>

          {/* Lead Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed"
          >
            Schedule direct 30-minute consultations with top physicians at leading
            facilities including Clemenceau Medical Center (CMC Dubai), Emirates Apex Hospital, and more.
            Instant confirmation, zero call center wait.
          </motion.p>
        </div>

        {/* ======================================================================= */}
        {/* Unified Modern Floating Search Console                                 */}
        {/* ======================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="max-w-4xl mx-auto mt-10"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl sm:rounded-full border border-slate-200 p-2 sm:p-2.5 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            {/* Field 1: Doctor / Specialty / Condition */}
            <div className="flex-1 flex items-center px-4 py-3 sm:py-2.5 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none">
              <Search className="w-4 h-4 text-sky-600 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Doctor, specialty, or condition..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* Field 2: Location / Neighborhood */}
            <div className="flex-1 flex items-center px-4 py-3 sm:py-2.5 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none">
              <MapPin className="w-4 h-4 text-sky-600 mr-3 shrink-0" />
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Hospital, area (e.g. Dubai Healthcare City)"
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* Field 3: Date */}
            <div className="flex items-center px-4 py-3 sm:py-2.5 bg-slate-50 sm:bg-transparent rounded-xl sm:rounded-none sm:w-44">
              <Calendar className="w-4 h-4 text-sky-600 mr-2 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden font-medium"
              />
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              className="px-6 py-3.5 sm:py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl sm:rounded-full font-bold text-sm transition-all shadow-xs shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Search Care</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Specialty Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-500 font-medium mr-1">Popular searches:</span>
            {[
              'Cardiology',
              'Dermatology',
              'Orthopedics',
              'Pediatrics',
              'Neurology',
              'General Practice',
            ].map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => handleQuickSpecialty(spec)}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:border-sky-500 hover:text-sky-700 transition-colors cursor-pointer"
              >
                {spec}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 4 Trust & Assurance Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-10 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">DHA & MOH Verified</span>
              <span className="text-[11px] text-slate-500 block">Accredited clinicians</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">30-Min Real Slots</span>
              <span className="text-[11px] text-slate-500 block">Live availability</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">CMC Dubai & Partners</span>
              <span className="text-[11px] text-slate-500 block">Premier hospitals</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Zero Booking Fees</span>
              <span className="text-[11px] text-slate-500 block">Free patient service</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOP CLINICAL SPECIALTIES: Clean Modern Medical Cards                  */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full mb-2 border border-sky-200">
              Clinical Departments
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Medical Specialties
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              From preventative consultations to advanced sub-specialist clinics across UAE hospitals.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <span>View All Specialties</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topSpecialties.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.name}
                onClick={() => handleQuickSpecialty(spec.query)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-sky-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      {spec.doctorCount}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                  <span>Book specialist</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED IN-PERSON SPECIALISTS: Live 30-Min Availability Cards         */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full mb-2 border border-sky-200">
              Verified Physicians
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top-Rated Specialists Ready to See You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Real-time schedule availability. Select an accredited physician to book your in-person visit.
            </p>
          </div>

          {/* Specialty Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            {['All', 'Cardiology', 'Dermatology', 'Orthopedics', 'General Practice'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDoctorCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  doctorCategory === cat
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-sky-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Doctor Photo & Rating */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs flex items-center gap-1 border border-slate-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-slate-400 text-[10px]">({doc.reviewCount})</span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700">
                      {doc.specialty}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {doc.experience}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {doc.name}
                  </h3>

                  <p className="text-xs text-slate-600 truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{doc.hospitalName || doc.clinicName || 'CMC Hospital Dubai'}</span>
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{doc.location}</span>
                  </p>

                  {/* Next Slot Ribbon */}
                  <div className="mt-3 p-2.5 bg-sky-50/70 rounded-xl border border-sky-200/70 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-600 font-medium">Next available:</span>
                    <span className="font-mono font-bold text-sky-700 text-[11px]">
                      {doc.availableSlots?.[0] || '10:00 AM Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                <Link
                  to={`/book/doctor/${doc.id}`}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Book 30-Min Visit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 transition-colors shadow-2xs"
          >
            <span>Browse All 500+ Verified Specialists</span>
            <ArrowRight className="w-4 h-4 text-sky-600" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PARTNER HOSPITALS & HEALTHCARE CENTERS                                */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full mb-2 border border-sky-200">
            Hospital Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Accredited Partner Hospitals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Your consultations take place at verified, world-class medical facilities with dedicated outpatient clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {partnerHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-sky-400 transition-all flex flex-col justify-between"
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
                    <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
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
                  className="w-full py-2 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>View Facility & Doctors</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMMON HEALTH CONDITIONS & SYMPTOM NAVIGATOR                          */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full mb-2 border border-sky-200">
            Clinical Guidance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find the Right Specialist for Your Symptoms
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Not sure which doctor to book? Select your common symptoms to connect with the right department.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {symptomCategories.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-400 hover:shadow-xs transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    {item.specialty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.symptoms.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Find matching doctors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW MEETADR WORKS: Effortless 3-Step Human Process                     */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full mb-2 border border-sky-200">
            The Patient Experience
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Healthcare appointments made simple.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            No phone trees, no waiting on hold, no calendar conflicts. Direct in-person care when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Choose Specialist & Facility
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter by medical specialty, condition, language, or hospital network across Dubai and UAE.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Select Exact 30-Min Slot
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              View guaranteed real-time availability slots that match your daily work and family schedule.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Check In & See Your Doctor
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive immediate SMS confirmation and automated hospital intake for zero waiting room friction.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. DUAL CALL-TO-ACTION: Patients Priority List & Providers Portal         */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: For Patients / Early Access Waitlist */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Priority Access</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your Doctor, One Click Away.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Join 2,400+ UAE patients who receive priority access to newly opened specialist slots and seasonal health updates.
              </p>

              {waitlistSubmitted ? (
                <div className="mt-6 p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0" />
                  <p className="text-xs font-bold text-slate-900">
                    You&apos;re on the priority list! We will notify you when priority slots open.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="mt-6 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      className="px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span>{waitlistLoading ? 'Submitting...' : 'Join the Priority List'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-6 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Over 2,400 verified patient registrations</span>
            </p>
          </div>

          {/* Card 2: For Healthcare Providers (Hospital Deep Navy Theme) */}
          <div className="bg-[#0B2545] text-white rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between border border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-sky-300 mb-4">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>For Hospitals & Clinics</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Join meetAdr as a Healthcare Partner
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Connect directly with thousands of UAE patients seeking in-person consultations. Reduce reception telephone load and virtually eliminate appointment no-shows.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Integrated real-time calendar & 30-min slot management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Hospital administrative intake dashboard with direct patient contact</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Comprehensive patient records with UAE mobile numbers</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/become-a-partner"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                <span>Register Your Facility</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

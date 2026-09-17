import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Star,
  Phone,
  Clock,
  ShieldCheck,
  Stethoscope,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Share2,
  Check,
  Award,
  Bed,
  Activity,
  Pill,
  Car,
  Sparkles,
  UserCheck,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { doctorService } from '../../services/doctorService';
import { Hospital, Doctor } from '../../types';
import { useTranslation } from '../../i18n';
import { HospitalBrandLogo } from '../../components/common/HospitalLogos';

export const HospitalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, translateSpecialty, translateLocation } = useTranslation();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [hosp, docs] = await Promise.all([
          hospitalService.getHospitalById(id),
          doctorService.getDoctorsByHospital(id),
        ]);
        setHospital(hosp);
        setDoctors(docs);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#081217] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#007B8A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">{t('hospitals.loadingDetails')}</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-[70vh] bg-[#081217] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#0C1A22] border border-slate-800 rounded-3xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('hospitals.hospitalNotFound')}</h2>
          <p className="text-xs text-slate-400 mb-6">
            The facility you are looking for may have been updated or relocated.
          </p>
          <Link
            to="/hospitals"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#007B8A] hover:bg-[#00606B] text-white rounded-xl text-sm font-semibold border border-[#005F6B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('hospitals.backToHospitals')}</span>
          </Link>
        </div>
      </div>
    );
  }

  const filteredDoctors =
    selectedSpecialty === 'all'
      ? doctors
      : doctors.filter(
          (doc) => doc.specialty?.toLowerCase() === selectedSpecialty.toLowerCase()
        );

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hospital.name} ${hospital.address}`
  )}`;

  return (
    <div className="bg-[#081217] min-h-screen py-6 sm:py-10 text-slate-100 selection:bg-slate-800 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{t('hospitals.backToPrevious')}</span>
            </button>
            <span className="text-slate-600">/</span>
            <Link to="/hospitals" className="text-slate-400 hover:text-white transition-colors">
              {t('hospitals.pageTitle')}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium truncate max-w-[150px] sm:max-w-[260px]">
              {hospital.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C1A22] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title={t('hospitals.shareFacility')}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('hospitals.linkCopied')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('hospitals.shareFacility')}</span>
                </>
              )}
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C1A22] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">{t('hospitals.getDirections')}</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Flagship Hospital Hero Showcase                                           */}
        {/* ========================================================================= */}
        <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 overflow-hidden mb-8">
          {/* Architectural Hospital Photo Banner */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900 overflow-hidden">
            <img
              src={hospital.photo}
              alt={hospital.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A22] via-[#0C1A22]/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-wrap items-center gap-2 z-10">
              {hospital.emergencyAvailable && (
                <div className="inline-flex items-center gap-1.5 bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{t('hospitals.emergencyServices')}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hospitals.accreditedFacility')}</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10">
              <div className="bg-[#081217]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 border border-slate-800">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{hospital.rating}</span>
                <span className="text-slate-400 font-normal text-[11px]">(4.9/5.0)</span>
              </div>
            </div>

            {/* Bottom Hero Header Info */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="bg-[#081217]/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shrink-0 flex items-center justify-center">
                    <HospitalBrandLogo hospitalId={hospital.id} className="h-9 sm:h-11 w-auto" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-md">
                      {hospital.name}
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 mt-1">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{hospital.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={`tel:${hospital.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#081217] hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold border border-slate-800 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-300" />
                    <span>{t('hospitals.callHospital')}</span>
                  </a>
                  <a
                    href="#doctors-section"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#007B8A] hover:bg-[#00606B] text-white rounded-xl text-xs sm:text-sm font-bold border border-[#005F6B] transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t('hospitals.bookAppointment')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Four-Metric Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-800 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 rtl:divide-x-reverse bg-[#0A161D]">
            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0C1A22] border border-slate-800 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Quality Rating</p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {hospital.rating} <span className="text-xs text-slate-400 font-normal">/ 5.0 (Top Care)</span>
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0C1A22] border border-slate-800 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-[#00A3B4]" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Medical Faculty</p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {doctors.length || hospital.doctorCount}+ <span className="text-xs text-slate-400 font-normal">Specialists</span>
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0C1A22] border border-slate-800 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Clinical Departments</p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {hospital.specialties.length} <span className="text-xs text-slate-400 font-normal">Disciplines</span>
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0C1A22] border border-slate-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Operating Status</p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {hospital.emergencyAvailable ? t('hospitals.emergencyUnitOpen') : t('hospitals.standardHours')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Main Content: Split Grid (2/3 Main Info & Doctors, 1/3 Facility Directory) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Facility & Clinical Mission */}
            <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#00A3B4]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  {t('hospitals.aboutFacility')}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {hospital.about}
              </p>

              {/* Key Clinical Amenities & Standards */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  {t('hospitals.patientAmenities')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#081217] border border-slate-800">
                    <Bed className="w-4 h-4 text-[#00A3B4] shrink-0" />
                    <span className="text-xs font-medium text-slate-200">{t('hospitals.inpatientBeds')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#081217] border border-slate-800">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200">{t('hospitals.roboticSurgery')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#081217] border border-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200">{t('hospitals.diagnosticImaging')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#081217] border border-slate-800">
                    <Pill className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200">{t('hospitals.pharmacy247')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#081217] border border-slate-800 sm:col-span-2">
                    <Car className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200">{t('hospitals.valetParking')}</span>
                  </div>
                </div>
              </div>

              {/* Key Clinical Specialties */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  {t('hospitals.keyDepartments')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec) => {
                    const isSelected = selectedSpecialty.toLowerCase() === spec.toLowerCase();
                    return (
                      <button
                        key={spec}
                        onClick={() => {
                          setSelectedSpecialty(isSelected ? 'all' : spec);
                          const el = document.getElementById('doctors-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#007B8A] text-white border-[#005F6B]'
                            : 'bg-[#081217] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span>{translateSpecialty(spec)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Doctors Section */}
            <div id="doctors-section" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {t('hospitals.specialistsAt', { name: hospital.name })}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {t('hospitals.specialistsSubtitle')}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1.5 bg-[#0C1A22] text-slate-300 border border-slate-800 rounded-full shrink-0 w-fit">
                  {t('hospitals.doctorsAvailable', { count: filteredDoctors.length })}
                </span>
              </div>

              {/* Specialty Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedSpecialty('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border ${
                    selectedSpecialty === 'all'
                      ? 'bg-[#007B8A] text-white border-[#005F6B]'
                      : 'bg-[#0C1A22] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t('hospitals.allSpecialties')} ({doctors.length})
                </button>
                {hospital.specialties.map((spec) => {
                  const count = doctors.filter(
                    (d) => d.specialty?.toLowerCase() === spec.toLowerCase()
                  ).length;
                  return (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border ${
                        selectedSpecialty.toLowerCase() === spec.toLowerCase()
                          ? 'bg-[#007B8A] text-white border-[#005F6B]'
                          : 'bg-[#0C1A22] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {translateSpecialty(spec)} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Doctor Cards Grid */}
              {filteredDoctors.length === 0 ? (
                <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-8 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">{t('hospitals.noDoctorsSpecialty')}</p>
                  <button
                    onClick={() => setSelectedSpecialty('all')}
                    className="mt-4 px-4 py-2 bg-[#081217] hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer"
                  >
                    View All Specialists
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-5 hover:border-slate-700 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start gap-3.5">
                          <div className="relative shrink-0">
                            <img
                              src={doc.photo}
                              alt={doc.name}
                              className="w-16 h-16 rounded-2xl object-cover bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0C1A22]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#081217] text-slate-300 border border-slate-800">
                                {translateSpecialty(doc.specialty)}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded-md border border-emerald-800/40">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-white truncate group-hover:text-slate-200 transition-colors">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">
                              {doc.experience} {t('doctorDetails.experience')}
                            </p>
                            <div className="flex items-center gap-1 text-xs font-semibold text-white mt-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span>{doc.rating}</span>
                              <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {doc.about}
                        </p>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2.5">
                        <Link
                          to={`/doctors/${doc.id}`}
                          className="flex-1 py-2 text-center text-xs font-semibold text-slate-300 bg-[#081217] hover:bg-slate-800 hover:text-white rounded-xl border border-slate-800 cursor-pointer transition-colors"
                        >
                          {t('hospitals.viewProfile')}
                        </Link>
                        <Link
                          to={`/book/doctor/${doc.id}`}
                          className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#007B8A] hover:bg-[#00606B] rounded-xl border border-[#005F6B] cursor-pointer transition-colors"
                        >
                          {t('hospitals.book')}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Facility Directory & Patient Info Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact & Appointments */}
            <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  {t('hospitals.admissionsContact')}
                </h3>
              </div>

              {hospital.emergencyAvailable && (
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/50 space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>{t('hospitals.emergencyHotline')}</span>
                  </div>
                  <a
                    href={`tel:${hospital.phone}`}
                    className="block text-base font-black text-rose-100 hover:text-white transition-colors"
                    dir="ltr"
                  >
                    {hospital.phone}
                  </a>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Direct Outpatient Desk</span>
                  <a
                    href={`tel:${hospital.phone}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 w-full rounded-xl bg-[#081217] hover:bg-slate-800 border border-slate-800 text-white font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span dir="ltr">{hospital.phone}</span>
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Operating Hours</span>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#081217] border border-slate-800 text-slate-200">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{hospital.operatingHours}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Physical Location</span>
                  <div className="p-3.5 rounded-xl bg-[#081217] border border-slate-800 space-y-2">
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{hospital.address}</span>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A3B4] hover:underline pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t('hospitals.getDirections')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Accepted Health Insurance Card */}
            <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  {t('hospitals.acceptedInsurance')}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {t('hospitals.insuranceNote')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'NextCare',
                  'AXA / GIG',
                  'MetLife',
                  'Daman National',
                  'Thiqa',
                  'Sukoon (Oman)',
                  'Cigna Global',
                  'Allianz Care',
                  'MedNet',
                  'Neuron',
                ].map((ins) => (
                  <span
                    key={ins}
                    className="px-2.5 py-1 bg-[#081217] border border-slate-800 rounded-lg text-[11px] font-medium text-slate-300"
                  >
                    {ins}
                  </span>
                ))}
              </div>
            </div>

            {/* Quality & Safety Assurance */}
            <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-6 space-y-3.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Accreditation & Standards
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Licensed and accredited by UAE Health Authorities (DHA & MOHAP).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Joint Commission International (JCI) standards compliant.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('hospitals.verifiedSlotsNote')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

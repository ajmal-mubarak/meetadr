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
} from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { doctorService } from '../../services/doctorService';
import { Hospital, Doctor } from '../../types';
import { useTranslation } from '../../i18n';

export const HospitalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, translateSpecialty, translateLocation } = useTranslation();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-slate-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">{t('hospitals.loadingDetails')}</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{t('hospitals.hospitalNotFound')}</h2>
        <Link
          to="/hospitals"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#007B8A] hover:bg-[#00606B] text-white rounded-xl text-sm font-semibold border border-[#005F6B]"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('hospitals.backToHospitals')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#081217] min-h-screen py-10 text-slate-100 selection:bg-slate-800 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('hospitals.backToPrevious')}</span>
        </button>

        {/* Hospital Hero Banner */}
        <div className="bg-[#0C1A22] rounded-3xl border border-slate-800 overflow-hidden mb-8">
          <div className="relative h-64 sm:h-80 w-full bg-slate-900">
            <img
              src={hospital.photo}
              alt={hospital.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {hospital.emergencyAvailable && (
              <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-rose-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                {t('hospitals.emergencyServices')}
              </span>
            )}
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-[#081217]/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1 border border-slate-800">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{hospital.rating}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{hospital.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{hospital.address}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span dir="ltr">{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{hospital.operatingHours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                {t('hospitals.aboutFacility')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">{hospital.about}</p>

              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {t('hospitals.keyDepartments')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-[#081217] text-slate-200 border border-slate-800 rounded-lg text-xs font-medium"
                    >
                      {translateSpecialty(spec)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors practicing at this hospital */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-white">
                {t('hospitals.specialistsAt', { name: hospital.name })}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('hospitals.specialistsSubtitle')}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-[#081217] text-slate-200 border border-slate-800 rounded-full">
              {t('hospitals.doctorsAvailable', { count: doctors.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#0C1A22] rounded-3xl border border-slate-800 p-5 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-slate-800 shrink-0 border border-slate-800 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-300">{translateSpecialty(doc.specialty)}</span>
                      <h3 className="text-base font-bold text-white leading-snug truncate group-hover:text-slate-200 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{doc.experience} {t('doctorDetails.experience')}</p>
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

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-300 bg-[#081217] hover:bg-slate-800 hover:text-white rounded-xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    {t('hospitals.details')}
                  </Link>
                  <Link
                    to={`/book/doctor/${doc.id}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#007B8A] hover:bg-[#00606B] rounded-xl border border-[#005F6B] cursor-pointer transition-all"
                  >
                    {t('hospitals.book')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

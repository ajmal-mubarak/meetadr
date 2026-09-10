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
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('hospitals.backToHospitals')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('hospitals.backToPrevious')}</span>
        </button>

        {/* Hospital Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-8">
          <div className="relative h-64 sm:h-80 w-full bg-slate-200">
            <img
              src={hospital.photo}
              alt={hospital.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {hospital.emergencyAvailable && (
              <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                {t('hospitals.emergencyServices')}
              </span>
            )}
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-slate-900 flex items-center gap-1 shadow-md">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{hospital.rating}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{hospital.name}</h1>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{hospital.address}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span dir="ltr">{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{hospital.operatingHours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                {t('hospitals.aboutFacility')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">{hospital.about}</p>

              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {t('hospitals.keyDepartments')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
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
              <h2 className="text-xl font-bold text-slate-900">
                {t('hospitals.specialistsAt', { name: hospital.name })}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('hospitals.specialistsSubtitle')}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
              {t('hospitals.doctorsAvailable', { count: doctors.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-blue-600">{translateSpecialty(doc.specialty)}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{doc.experience} {t('doctorDetails.experience')}</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 mt-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.about}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/doctors/${doc.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    {t('hospitals.details')}
                  </Link>
                  <Link
                    to={`/book/doctor/${doc.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
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

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Phone,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { clinicService } from '../../services/clinicService';
import { doctorService } from '../../services/doctorService';
import { Clinic, Doctor } from '../../types';
import { useTranslation } from '../../i18n';

export const ClinicDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, translateSpecialty, translateLocation } = useTranslation();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [cln, docs] = await Promise.all([
          clinicService.getClinicById(id),
          doctorService.getDoctorsByClinic(id),
        ]);
        setClinic(cln);
        setDoctors(docs);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#081217]">
        <div className="w-8 h-8 border-3 border-slate-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400">{t('clinics.loadingProfile')}</p>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-[#081217] py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">{t('clinics.clinicNotFound')}</h2>
          <Link
            to="/clinics"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#007B8A] hover:bg-[#00606B] text-white rounded-xl text-sm font-bold border border-[#005F6B] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('clinics.backToClinics')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#081217] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('clinics.backToPrevious')}</span>
        </button>

        {/* Clinic Header */}
        <div className="bg-[#0C1A22] rounded-2xl border border-slate-800 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#081217] text-slate-200 border border-slate-800">
                  {translateSpecialty(clinic.specialty)}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-[#081217] px-2 py-0.5 rounded-md border border-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{clinic.rating}</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{clinic.name}</h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{translateLocation(clinic.address || clinic.location)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 bg-[#081217] p-4 rounded-xl border border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span dir="ltr">{clinic.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{clinic.operatingHours}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {t('clinics.aboutClinic')}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{clinic.about}</p>
          </div>
        </div>

        {/* Doctors in this clinic */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            {t('clinics.specialistsAt', { name: clinic.name })}
          </h2>

          {doctors.length === 0 ? (
            <div className="bg-[#0C1A22] p-6 rounded-2xl border border-slate-800 text-center text-sm text-slate-400">
              {t('clinics.noDoctorsListed')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#0C1A22] rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-300">{translateSpecialty(doc.specialty)}</span>
                      <h3 className="text-base font-bold text-white leading-snug truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">{doc.experience} {t('doctorDetails.experience')}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 mt-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to={`/doctors/${doc.id}`}
                      className="flex-1 py-2 text-center text-xs font-semibold text-slate-300 bg-[#081217] hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                    >
                      {t('clinics.details')}
                    </Link>
                    <Link
                      to={`/book/doctor/${doc.id}`}
                      className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#007B8A] hover:bg-[#00606B] rounded-xl border border-[#005F6B] cursor-pointer transition-all"
                    >
                      {t('clinics.book')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

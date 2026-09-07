import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  GraduationCap,
  Building2,
  CheckCircle,
  ArrowLeft,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { Doctor } from '../../types';

export const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const d = await doctorService.getDoctorById(id);
        setDoctor(d);
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
        <p className="text-sm text-slate-500">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Doctor Profile Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested doctor profile does not exist or has been removed.</p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctors</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-28 h-28 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {doctor.specialty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Specialist
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    {doctor.name}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {doctor.hospitalName || doctor.clinicName || 'City Care Hospital'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{doctor.location}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 font-normal">({doctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>{doctor.experience} Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">About Doctor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{doctor.about}</p>
            </div>

            {/* Education & Credentials */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Education & Qualifications</span>
              </h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-mono text-xs">
                {doctor.education}
              </p>
            </div>

            {/* Clinical Affiliations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Practicing Affiliation</span>
              </h3>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {doctor.hospitalName || doctor.clinicName || 'City Care Hospital'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{doctor.location}</p>
                </div>
                {doctor.hospitalId && (
                  <Link
                    to={`/hospitals/${doctor.hospitalId}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Facility
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Booking Action Card (Col 3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Appointment Scheduling
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Book Consultation</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verified 30-minute consultation slots. No online payment required.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-700 mb-2">Available Days</h4>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-700 mb-2">Typical Time Slots</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {doctor.availableSlots.slice(0, 6).map((slot) => (
                    <span
                      key={slot}
                      className="text-xs text-center py-1.5 px-2 rounded-lg bg-blue-50/70 text-blue-900 border border-blue-100 font-mono"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
                {doctor.availableSlots.length > 6 && (
                  <p className="text-[11px] text-slate-400 text-center mt-1.5">
                    +{doctor.availableSlots.length - 6} more slots available on booking page
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to={`/book/doctor/${doctor.id}`}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Select Date & Book</span>
                </Link>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Hospital staff will contact you via mobile to confirm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

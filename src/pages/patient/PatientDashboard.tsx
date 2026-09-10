import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  MapPin,
  ArrowRight,
  User,
  Plus,
  Building2,
  ExternalLink,
  CalendarCheck,
  Smartphone,
  Star,
  RefreshCw,
  FileText,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';

// ─── Rate & Review Modal ────────────────────────────────────────────────────
interface ReviewModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ appointment, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Rate Your Visit</h3>
              <p className="text-[11px] text-slate-500">Step 11 — Post-Visit Review</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor info */}
        <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-200">
          <img
            src={appointment.doctorPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
            alt={appointment.doctorName}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="text-sm font-bold text-slate-900">{appointment.doctorName}</p>
            <p className="text-xs text-teal-700 font-semibold">{appointment.specialty}</p>
            <p className="text-[11px] text-slate-500">{appointment.facilityName || appointment.hospitalName}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">How was your experience?</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 cursor-pointer"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    star <= (hovered || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <p className="text-sm font-bold text-amber-500">
              {ratingLabels[hovered || rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Share details (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your consultation experience? Any feedback for the doctor or clinic..."
            rows={3}
            className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none text-slate-700 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Skip for now
          </button>
          <button
            type="button"
            disabled={rating === 0}
            onClick={() => onSubmit(rating, comment)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              rating === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
export const PatientDashboard: React.FC = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'my_bookings' | 'confirmed' | 'cancelled'>('my_bookings');
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [reviewingAppt, setReviewingAppt] = useState<Appointment | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // OTP modal state (PDF Page 9)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '52 412 2794');
  const [countryCode, setCountryCode] = useState('+971');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getAllAppointments();
      setAppointments(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleCancelConfirm = async (reason: string) => {
    if (!cancellingAppt) return;
    try {
      await bookingService.cancelAppointment(cancellingAppt.id, reason, 'patient', user?.name || 'Sarah Jenkins');
      showToast('Appointment successfully cancelled.', 'info');
      setCancellingAppt(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!reviewingAppt) return;
    setReviewedIds((prev) => new Set([...prev, reviewingAppt.id]));
    setReviewingAppt(null);
    showToast(`Thank you! ${rating}★ review submitted for ${reviewingAppt.doctorName}.`, 'success');
  };

  const handleRebook = (appt: Appointment) => {
    navigate(`/book/doctor/${appt.doctorId}`);
  };

  // OTP handlers
  const handleSendOtp = () => {
    if (!mobileNumber.trim()) { showToast('Please enter your mobile number', 'error'); return; }
    setOtpSent(true);
    showToast(`Verification code sent via SMS to ${countryCode} ${mobileNumber}. (Demo OTP: 1234)`, 'info');
  };

  const handleVerifyOtp = async () => {
    if (otpCode.trim() !== '1234') { showToast('Invalid OTP. Please enter demo OTP: 1234', 'error'); return; }
    await login('patient@meetadr.demo', 'Patient@123');
    showToast('Verified with mobile OTP successfully!', 'success');
    setShowOtpModal(false);
    setOtpSent(false);
    setOtpCode('');
  };

  // Tab filtering
  const confirmed = useMemo(() => appointments.filter((a) => a.status === 'confirmed'), [appointments]);
  const cancelled = useMemo(() => appointments.filter((a) => a.status === 'cancelled'), [appointments]);
  const myBookings = appointments;

  const displayedAppointments =
    activeTab === 'my_bookings' ? myBookings : activeTab === 'confirmed' ? confirmed : cancelled;

  const nearbyHospitals = [
    { id: 'cmc_dubai', name: 'CMC (Clemenceau Medical Center Hospital Dubai)', location: 'Dubai Healthcare City Phase 2 - Al Jaddaf', distance: '1.8 km', specialties: ['Cardiology', 'Neurology', 'Orthopedics'] },
    { id: 'medcare_al_safa', name: 'Medcare Hospital Al Safa', location: 'Near Safa Park, Sheikh Zayed Road', distance: '4.2 km', specialties: ['Dermatology', 'Pediatrics', 'General Practice'] },
    { id: 'csh_dubai', name: 'Canadian Specialist Hospital', location: 'Abu Hail Road, Deira, Dubai', distance: '6.5 km', specialties: ['Cardiology', 'Internal Medicine', 'Surgery'] },
    { id: 'aster_mankhool', name: 'Aster Hospital Mankhool', location: 'Kuwait Street, Al Mankhool, Bur Dubai', distance: '5.1 km', specialties: ['General Practice', 'Orthopedics', 'ENT'] },
  ];

  return (
    <div className="space-y-6">
      {/* ── QUICK STATS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Bookings</p>
            <p className="text-xl font-black text-slate-900">{confirmed.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prescriptions</p>
            <p className="text-xl font-black text-slate-900">1 Ready</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Insurance</p>
            <p className="text-xs font-black text-emerald-700 truncate">Daman Active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Family Members</p>
            <p className="text-xl font-black text-slate-900">2 Dependents</p>
          </div>
        </div>
      </div>

      {/* ── NEXT UPCOMING APPOINTMENT (If any) ── */}
      {confirmed.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-teal-600/30 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Next Scheduled Visit</h3>
            </div>
            <Link
              to="/patient/bookings"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(() => {
            const nextAppt = confirmed[0];
            return (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <img
                    src={nextAppt.doctorPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                    alt={nextAppt.doctorName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-200">
                      {nextAppt.specialty}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">{nextAppt.doctorName}</h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{nextAppt.facilityName || nextAppt.hospitalName || 'CMC Hospital Dubai'}</span>
                    </p>
                    <p className="text-xs font-bold text-teal-800 flex items-center gap-2 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {nextAppt.date}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {nextAppt.timeSlot}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a
                    href="https://maps.google.com/maps?q=Clemenceau+Medical+Center+Hospital+Dubai"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Get Directions</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRebook(nextAppt)}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancellingAppt(nextAppt)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── APPOINTMENTS PREVIEW & RECENT BOOKINGS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {([
              { key: 'my_bookings', label: 'All Bookings', count: myBookings.length },
              { key: 'confirmed', label: 'Confirmed', count: confirmed.length },
              { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <Link
            to="/patient/bookings"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {displayedAppointments.length === 0 ? (
          <div className="text-center py-14 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <p className="text-xs font-bold text-slate-700">No appointments in this tab.</p>
            <Link to="/doctors" className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors">
              Browse Specialists
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedAppointments.map((appt) => {
              const isReviewed = reviewedIds.has(appt.id);
              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 hover:border-teal-300 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={appt.doctorPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                          alt={appt.doctorName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{appt.doctorName}</h4>
                          <p className="text-xs font-semibold text-teal-700">{appt.specialty}</p>
                          <p className="text-[11px] text-slate-500 truncate">{appt.facilityName || appt.hospitalName || 'CMC Hospital Dubai'}</p>
                        </div>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>

                    {/* Date & Time Strip */}
                    <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {appt.date}
                      </span>
                      <span className="font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appt.timeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions — Step 10 & 11 from PDF */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                    <a
                      href="https://maps.google.com/maps?q=Clemenceau+Medical+Center+Hospital+Dubai"
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      View Map
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      {/* Rebook — on cancelled or as quick action */}
                      {(appt.status === 'cancelled' || appt.status === 'confirmed') && (
                        <button
                          type="button"
                          onClick={() => handleRebook(appt)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                            appt.status === 'cancelled'
                              ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          {appt.status === 'cancelled' ? 'Rebook' : 'Reschedule'}
                        </button>
                      )}

                      {/* Rate & Review — for confirmed visits (Step 11) */}
                      {appt.status === 'confirmed' && !isReviewed && (
                        <button
                          type="button"
                          onClick={() => setReviewingAppt(appt)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold transition-colors cursor-pointer"
                        >
                          <Star className="w-3 h-3" />
                          Rate Visit
                        </button>
                      )}

                      {/* Reviewed badge */}
                      {isReviewed && (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Reviewed
                        </span>
                      )}

                      {/* Cancel */}
                      {appt.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setCancellingAppt(appt)}
                          className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── NEARBY HOSPITALS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Nearby Network</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Hospitals & Clinics Near You</h2>
          <p className="text-xs text-slate-500">Directly connected accredited facilities across Dubai and the UAE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 pr-2">{hosp.name}</h3>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full shrink-0">{hosp.distance}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                  {hosp.location}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {hosp.specialties.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(hosp.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  Directions <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  to="/doctors"
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                >
                  Book Here <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODALS ── */}
      {cancellingAppt && (
        <CancelModal
          appointment={cancellingAppt}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancellingAppt(null)}
        />
      )}

      {reviewingAppt && (
        <ReviewModal
          appointment={reviewingAppt}
          onClose={() => setReviewingAppt(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* OTP Login Modal (PDF Page 9) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Mobile & OTP Login</h3>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Enter your mobile number to receive a one-time SMS code for direct dashboard access.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Mobile Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="+971">+971 UAE</option>
                    <option value="+965">+965 KWT</option>
                    <option value="+966">+966 KSA</option>
                  </select>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="52 412 2794"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {otpSent ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">Enter 4-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                    <span className="text-[11px] text-teal-700 font-bold block mt-1 text-center">Demo code: 1234</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Verify & Enter Dashboard
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Send OTP via SMS
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

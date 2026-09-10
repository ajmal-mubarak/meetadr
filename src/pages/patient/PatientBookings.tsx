import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  Star,
  RefreshCw,
  CheckCircle2,
  X,
  FileText,
  ExternalLink,
  Building2,
  AlertCircle,
  CalendarCheck2,
  CalendarX2,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n';
import { bookingService } from '../../services/bookingService';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';

// ─── Inline Review Modal ─────────────────────────────────────────────────────
interface ReviewModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ appointment, onClose, onSubmit }) => {
  const { t, translateSpecialty, isArabic } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const labels = isArabic
    ? ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز']
    : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('patientPortal.rateVisitModalTitle')}</h3>
              <p className="text-[11px] text-slate-500">{t('patientPortal.rateVisitModalSubtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-200">
          <img
            src={appointment.doctorPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
            alt={appointment.doctorName}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="truncate">
            <p className="text-sm font-bold text-slate-900 truncate">{appointment.doctorName}</p>
            <p className="text-xs text-teal-700 font-semibold">{translateSpecialty(appointment.specialty)}</p>
            <p className="text-[11px] text-slate-500 truncate">{appointment.facilityName || appointment.hospitalName}</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('patientPortal.rateExperience')}</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 cursor-pointer p-1"
              >
                <Star className={`w-8 h-8 transition-colors ${star <= (hovered || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <p className="text-sm font-bold text-amber-500">{labels[hovered || rating]}</p>
          )}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('patientPortal.sharePlaceholder')}
          rows={3}
          className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none text-slate-700 placeholder:text-slate-400 transition-all"
        />

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {t('patientPortal.skipForNow')}
          </button>
          <button
            type="button"
            disabled={rating === 0}
            onClick={() => onSubmit(rating, comment)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              rating === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            {t('patientPortal.submitReview')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main PatientBookings Component ─────────────────────────────────────────
export const PatientBookings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t, translateSpecialty, isRTL, isArabic } = useTranslation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [reviewingAppt, setReviewingAppt] = useState<Appointment | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

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
      await bookingService.cancelAppointment(cancellingAppt.id, reason, 'patient', user?.name || 'Patient');
      showToast(isArabic ? 'تم إلغاء الموعد بنجاح.' : 'Appointment successfully cancelled.', 'info');
      setCancellingAppt(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || (isArabic ? 'فشل إلغاء الموعد' : 'Failed to cancel appointment'), 'error');
    }
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!reviewingAppt) return;
    setReviewedIds((prev) => new Set([...prev, reviewingAppt.id]));
    setReviewingAppt(null);
    showToast(
      isArabic
        ? `تم إرسال تقييم ${rating}★ للدكتور ${reviewingAppt.doctorName}. شكراً لك!`
        : `${rating}★ review submitted for ${reviewingAppt.doctorName}. Thank you!`,
      'success'
    );
  };

  // Counts
  const counts = useMemo(() => {
    return {
      all: appointments.length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };
  }, [appointments]);

  const filtered = appointments.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.doctorName.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q) ||
        a.facilityName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── 1. PAGE TITLE & HEADER ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-xs font-bold text-teal-800">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('patientBookings.registryBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('patientBookings.pageTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('patientBookings.pageSubtitle')}
          </p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('patientBookings.bookNew')}</span>
        </Link>
      </div>

      {/* ── 2. METRICS OVERVIEW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`p-4 rounded-2xl border transition-all text-left rtl:text-right cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('patientBookings.totalBookings')}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{counts.all}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('confirmed')}
          className={`p-4 rounded-2xl border transition-all text-left rtl:text-right cursor-pointer ${
            filterStatus === 'confirmed'
              ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{t('patientBookings.upcomingVisits')}</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">{counts.confirmed}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('completed')}
          className={`p-4 rounded-2xl border transition-all text-left rtl:text-right cursor-pointer ${
            filterStatus === 'completed'
              ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('patientBookings.completed')}</p>
          <p className="text-2xl font-black text-slate-700 mt-1">{counts.completed}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('cancelled')}
          className={`p-4 rounded-2xl border transition-all text-left rtl:text-right cursor-pointer ${
            filterStatus === 'cancelled'
              ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">{t('patientBookings.cancelled')}</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{counts.cancelled}</p>
        </button>
      </div>

      {/* ── 3. FILTER TABS & SEARCH BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 w-full sm:w-auto text-xs font-semibold gap-1">
          {([
            { id: 'all', label: t('patientBookings.allTab'), count: counts.all },
            { id: 'confirmed', label: t('patientBookings.confirmedTab'), count: counts.confirmed },
            { id: 'completed', label: t('patientBookings.completedTab'), count: counts.completed },
            { id: 'cancelled', label: t('patientBookings.cancelledTab'), count: counts.cancelled },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer text-xs ${
                filterStatus === tab.id
                  ? 'bg-white text-teal-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label} <span className="opacity-70 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('patientBookings.searchPlaceholder')}
            className="w-full pl-9 rtl:pl-3.5 rtl:pr-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* ── 4. APPOINTMENTS LIST ── */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">{t('patientBookings.loading')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{t('patientBookings.noBookings')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search.trim()
              ? t('patientBookings.noBookingsMatch', { query: search })
              : t('patientBookings.noCategoryBookings')}
          </p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('patientPortal.findDoctorBtn')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => {
            const isReviewed = reviewedIds.has(appt.id);
            const isConfirmed = appt.status === 'confirmed';
            const isCancelled = appt.status === 'cancelled';
            const isCompleted = appt.status === 'completed';

            return (
              <div
                key={appt.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-300 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Column: Date ticket stub + Doctor info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 flex-1">
                    {/* Ticket Date Badge */}
                    <div className="flex sm:flex-col items-center justify-center bg-teal-50/80 border border-teal-200/60 rounded-2xl px-4 py-3 sm:w-28 text-center shrink-0">
                      <Calendar className="w-4 h-4 text-teal-600 mb-0.5 hidden sm:block mx-auto" />
                      <span className="text-xs sm:text-sm font-black text-teal-800 tracking-tight">
                        {appt.date}
                      </span>
                      <span className="text-xs font-mono font-bold text-teal-600 sm:mt-1 ml-2 sm:ml-0 rtl:mr-2 rtl:ml-0 bg-white sm:bg-transparent px-2 py-0.5 sm:p-0 rounded-md">
                        {appt.timeSlot}
                      </span>
                    </div>

                    {/* Doctor Details */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={appt.doctorPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                        alt={appt.doctorName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{appt.id.slice(-6).toUpperCase()}
                          </span>
                          <StatusBadge status={appt.status} />
                          {isConfirmed && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {t('patientPortal.inPersonVisit')}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-black text-slate-900 leading-snug">
                          {appt.doctorName}
                        </h3>

                        <p className="text-xs font-bold text-teal-700">
                          {translateSpecialty(appt.specialty)}
                        </p>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appt.facilityName || appt.hospitalName || 'CMC Hospital Dubai'}</span>
                        </p>

                        {isCancelled && appt.cancelReason && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-xl mt-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{t('patientPortal.cancelledReason', { reason: appt.cancelReason })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {/* Google Maps Directions */}
                    <a
                      href={`https://maps.google.com/maps?q=${encodeURIComponent(appt.facilityName || 'CMC Hospital Dubai')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t('patientPortal.directions')}</span>
                    </a>

                    {/* Prescription download */}
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => showToast(isArabic ? 'الوصفة الطبية جاهزة للاستلام من صيدلية المركز الطبي.' : 'Prescription is ready for pickup at clinic pharmacy.', 'info')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-200 bg-teal-50/50 text-xs font-bold text-teal-800 hover:bg-teal-100 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        <span>{t('patientPortal.prescription')}</span>
                      </button>
                    )}

                    {/* Rate & Review Visit */}
                    {(isCompleted || isConfirmed) && !isReviewed && (
                      <button
                        type="button"
                        onClick={() => setReviewingAppt(appt)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{t('patientPortal.rateVisit')}</span>
                      </button>
                    )}

                    {isReviewed && (
                      <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('patientPortal.reviewed')}</span>
                      </span>
                    )}

                    {/* Rebook on Cancelled */}
                    {isCancelled && (
                      <Link
                        to={`/book/doctor/${appt.doctorId}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t('patientPortal.rebook')}</span>
                      </Link>
                    )}

                    {/* Reschedule */}
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => navigate(`/book/doctor/${appt.doctorId}`)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {t('patientPortal.reschedule')}
                      </button>
                    )}

                    {/* Cancel button */}
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => setCancellingAppt(appt)}
                        className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        {t('patientPortal.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. MODALS ── */}
      {cancellingAppt && (
        <CancelModal
          appointment={cancellingAppt}
          onClose={() => setCancellingAppt(null)}
          onConfirm={handleCancelConfirm}
        />
      )}

      {reviewingAppt && (
        <ReviewModal
          appointment={reviewingAppt}
          onClose={() => setReviewingAppt(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

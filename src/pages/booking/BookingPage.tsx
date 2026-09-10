import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  MapPin,
  Building2,
  Phone,
  Mail,
  User,
  ExternalLink,
  X,
  Stethoscope,
  ArrowRight,
  Eye,
  Check,
  Lock,
  LogIn,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../context/ToastContext';
import { INITIAL_DOCTORS } from '../../data/mockDoctors';
import { useTranslation } from '../../i18n';

// ─── Guest Login Modal (intercepts booking when not authenticated) ────────────
interface GuestLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
  doctorName: string;
}

const GuestLoginModal: React.FC<GuestLoginModalProps> = ({ onSuccess, onClose, doctorName }) => {
  const { login, quickLoginAs } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [mode, setMode] = useState<'options' | 'email' | 'otp'>('options');
  const [email, setEmail] = useState('patient@meetadr.demo');
  const [password, setPassword] = useState('Patient@123');
  const [mobile, setMobile] = useState('52 412 2794');
  const [countryCode, setCountryCode] = useState('+971');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Signed in! Completing your booking...', 'success');
      onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Login failed. Check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!mobile.trim()) { showToast('Enter your mobile number.', 'error'); return; }
    setOtpSent(true);
    showToast(`OTP sent to ${countryCode} ${mobile}. (Demo: 1234)`, 'info');
  };

  const handleVerifyOtp = async () => {
    if (otp.trim() !== '1234') { showToast('Invalid OTP. Demo code is 1234.', 'error'); return; }
    setIsLoading(true);
    try {
      await login('patient@meetadr.demo', 'Patient@123');
      showToast('Verified! Completing your booking...', 'success');
      onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Verification failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    try {
      await quickLoginAs('patient');
      showToast('Quick login done! Completing your booking...', 'success');
      onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Quick login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="w-5 h-5" />
                <span className="font-bold text-sm">{t('auth.loginTitle')}</span>
              </div>
              <p className="text-xs text-teal-100 leading-relaxed">
                You're one step away from booking with <strong>{doctorName}</strong>.<br />
                Sign in to save and track your appointment.
              </p>
            </div>
            <button onClick={onClose} className="text-teal-200 hover:text-white p-1 cursor-pointer shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {mode === 'options' && (
            <div className="space-y-3">
              {/* Quick Demo Login */}
              <button
                type="button"
                onClick={handleQuickDemo}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-all cursor-pointer disabled:opacity-60 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap className="w-5 h-5" />}
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-sm font-bold text-slate-900">{t('auth.demoPatient')}</p>
                  <p className="text-[11px] text-slate-500">Enter as patient instantly — for demo/review</p>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 ml-auto rtl:ml-0 rtl:mr-auto rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] text-slate-400 font-semibold">{t('common.or', 'or')}</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Email Login */}
              <button
                type="button"
                onClick={() => setMode('email')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-sm font-bold text-slate-800">{t('auth.email')}</p>
                  <p className="text-[11px] text-slate-500">Use your meetAdr account credentials</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto rtl:ml-0 rtl:mr-auto rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* OTP Login */}
              <button
                type="button"
                onClick={() => setMode('otp')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-sm font-bold text-slate-800">Sign in with Mobile OTP</p>
                  <p className="text-[11px] text-slate-500">Receive a 4-digit SMS code</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto rtl:ml-0 rtl:mr-auto rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <p className="text-center text-[11px] text-slate-400 pt-1">
                New here?{' '}
                <Link to="/login" className="text-teal-600 font-bold hover:underline">
                  {t('auth.registerPatient')}
                </Link>
              </p>
            </div>
          )}

          {mode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <button type="button" onClick={() => setMode('options')} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" /> {t('common.back')}
              </button>

              {/* Demo hint */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs">
                <p className="font-bold text-teal-700 mb-1">Demo credentials pre-filled</p>
                <p className="text-teal-600 font-mono text-[11px]">{email} / {password}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                {isLoading ? 'Signing in...' : 'Sign In & Book'}
              </button>
            </form>
          )}

          {mode === 'otp' && (
            <div className="space-y-4">
              <button type="button" onClick={() => { setMode('options'); setOtpSent(false); setOtp(''); }} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" /> {t('common.back')}
              </button>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('booking.mobileNumber')}</label>
                <div className="flex gap-2">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-xs font-bold focus:outline-hidden">
                    <option value="+971">+971 UAE</option>
                    <option value="+965">+965 KWT</option>
                    <option value="+966">+966 KSA</option>
                  </select>
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
                    placeholder="52 412 2794"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:border-teal-500 focus:outline-hidden transition-all" />
                </div>
              </div>

              {otpSent ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Enter OTP</label>
                    <input
                      type="text" maxLength={4} value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest focus:border-teal-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-teal-600 font-bold text-center mt-1">Demo code: 1234</p>
                  </div>
                  <button
                    type="button" onClick={handleVerifyOtp} disabled={isLoading}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {isLoading ? 'Verifying...' : 'Verify & Book'}
                  </button>
                </div>
              ) : (
                <button type="button" onClick={handleSendOtp}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Smartphone className="w-4 h-4" />
                  Send OTP via SMS
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Pending booking flag — set to true when user fills form but isn't logged in yet
  const [pendingBooking, setPendingBooking] = useState(false);
  const { showToast } = useToast();
  const { t, language, translateSpecialty } = useTranslation();

  const allDoctors = INITIAL_DOCTORS;

  // Selected doctor (defaulting to Dr. Sarah Chen or the param)
  const [selectedDocId, setSelectedDocId] = useState<string>(
    doctorId || 'doc_sarah_chen'
  );

  const doctor = useMemo(() => {
    return allDoctors.find((d) => d.id === selectedDocId) || allDoctors[0];
  }, [allDoctors, selectedDocId]);

  // Departments that THIS specific doctor actually has
  const doctorDepartments = useMemo(() => {
    const spec = (doctor.specialty || '').trim();
    const lower = spec.toLowerCase();

    if (lower.includes('cardio')) {
      return ['Cardiology', 'Interventional Cardiology', 'Cardiovascular Prevention'];
    }
    if (lower.includes('general') || lower.includes('family')) {
      return ['General Practice', 'Family Medicine', 'Primary Health Screening'];
    }
    if (lower.includes('derma')) {
      return ['Dermatology', 'Clinical Dermatology', 'Cosmetic Dermatology'];
    }
    if (lower.includes('neuro')) {
      return ['Neurology', 'Clinical Neurophysiology', 'Headache & Stroke Care'];
    }
    if (lower.includes('pedia')) {
      return ['Pediatrics', 'Child Health & Immunization', 'Pediatric Wellness'];
    }
    if (lower.includes('ortho')) {
      return ['Orthopedics', 'Sports Medicine', 'Joint & Arthroscopy'];
    }
    return [spec || 'Specialist Consultation'];
  }, [doctor]);

  // Form inputs
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(doctorDepartments[0]);

  // Update selected specialty when doctor changes
  React.useEffect(() => {
    setSelectedSpecialty(doctorDepartments[0]);
  }, [doctorDepartments]);

  const [patientName, setPatientName] = useState(user ? user.name : '');
  const [countryCode, setCountryCode] = useState('+971');
  const [mobileNumber, setMobileNumber] = useState(user ? user.phone || '524122794' : '');
  const [patientEmail, setPatientEmail] = useState(user ? user.email : '');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Generate date options (today + next 7 days)
  const nextDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? t('booking.today') : i === 1 ? t('booking.tomorrow') : d.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'short' });
      const display = d.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { month: 'short', day: 'numeric' });
      const fullDisplay = d.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      dates.push({ date: iso, dayName, display, fullDisplay });
    }
    return dates;
  }, [language, t]);

  const [selectedDateObj, setSelectedDateObj] = useState(nextDates[0]);
  const [selectedSlot, setSelectedSlot] = useState(doctor.availableSlots[0] || '10:00 AM');

  // Booking completion state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // Form validation for dynamic button styling
  const isFormValid = useMemo(() => {
    return (
      patientName.trim().length > 0 &&
      mobileNumber.trim().length >= 7 &&
      Boolean(selectedSlot) &&
      termsAccepted
    );
  }, [patientName, mobileNumber, selectedSlot, termsAccepted]);

  const handleSelectDoctor = (id: string) => {
    setSelectedDocId(id);
    const found = allDoctors.find((d) => d.id === id);
    if (found) {
      setSelectedSlot(found.availableSlots[0] || '10:00 AM');
    }
  };

  // Core booking logic — called directly when authenticated
  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      const fullPhone = `${countryCode} ${mobileNumber.trim()}`;
      const newAppt = await bookingService.createAppointment({
        patientId: user ? user.id : 'guest_patient',
        patientName: patientName.trim(),
        patientPhone: fullPhone,
        patientEmail: patientEmail.trim() || undefined,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorPhoto: doctor.photo,
        specialty: selectedSpecialty,
        hospitalId: doctor.hospitalId || 'hosp_cmc',
        facilityName: doctor.hospitalName || 'CMC (Clemenceau Medical Center Hospital Dubai)',
        date: selectedDateObj.date,
        timeSlot: selectedSlot,
      });
      setBookedAppointment(newAppt);
      showToast(t('booking.bookingConfirmedTitle'), 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'Failed to place booking.', 'error');
    } finally {
      setIsSubmitting(false);
      setPendingBooking(false);
    }
  };

  // Called after successful login inside the modal — resumes the pending booking
  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    setPendingBooking(false);
    await submitBooking();
  };

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!patientName.trim()) {
        showToast('Please enter the patient full name.', 'error');
        return;
      }
      if (!mobileNumber.trim() || mobileNumber.trim().length < 7) {
        showToast('Please enter a valid mobile number for SMS confirmation.', 'error');
        return;
      }
      if (!termsAccepted) {
        showToast('Please accept the Terms and Conditions to proceed.', 'error');
        return;
      }
      return;
    }

    // ── GUEST GATE: show login modal instead of booking ──────────────────────
    if (!isAuthenticated) {
      setPendingBooking(true);
      setShowLoginModal(true);
      return;
    }

    // Logged in — proceed directly
    await submitBooking();
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525252] hover:text-[#000000] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('booking.backToDoctors')}</span>
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#008B74] bg-[#E6F4F1] px-3.5 py-1.5 rounded-full border border-[#B2E2D9]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008B74] shrink-0" />
            <span>{t('booking.inPersonPayAtReception')}</span>
          </span>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: BOOKING COMPLETED SCREEN                                         */}
        {/* ========================================================================= */}
        {bookedAppointment ? (
          <div className="bg-white rounded-3xl border border-[#E5DFCD] p-8 sm:p-10 shadow-xs animate-in fade-in zoom-in-95 duration-200">
            {/* Success Icon & Heading */}
            <div className="text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#E6F4F1] border border-[#B2E2D9] text-[#008B74] flex items-center justify-center mx-auto mb-4 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                {t('booking.bookingConfirmedTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
                {t('booking.bookingConfirmedSubtitle')}
              </p>

              <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5DFCD] text-xs font-mono font-bold text-[#111827]">
                <span className="text-[#6B7280]">{t('booking.bookingReference')}:</span>
                <span className="text-[#008B74]">#MADR-{bookedAppointment.id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            {/* Appointment Summary Box */}
            <div className="mt-8 bg-[#FAF9F5] rounded-2xl border border-[#E5DFCD] p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-[#E5DFCD]">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E5DFCD] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-[#111827]">{doctor.name}</h3>
                  <p className="text-xs font-semibold text-[#008B74]">{translateSpecialty(selectedSpecialty)}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#008B74] shrink-0" />
                    <span>{doctor.hospitalName || 'CMC Hospital Dubai'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[#6B7280] block">{t('booking.dateTimeLabel')}:</span>
                  <p className="font-bold text-[#111827] text-sm">
                    {selectedDateObj.fullDisplay} at <span className="text-[#008B74]">{selectedSlot}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#6B7280] block">{t('booking.patientLabel')}:</span>
                  <p className="font-bold text-[#111827] text-sm">{patientName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#6B7280] block">{t('booking.contactLabel')}:</span>
                  <p className="font-semibold text-[#111827]">{countryCode} {mobileNumber}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#6B7280] block">{t('booking.feeNote')}:</span>
                  <p className="font-semibold text-[#008B74]">{t('booking.payAtReception')} ({t('booking.zeroUpfrontPayment')})</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DFCD] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#4B5563]">
                  <MapPin className="w-4 h-4 text-[#008B74] shrink-0" />
                  <span className="truncate">Dubai Healthcare City Phase 2 - Al Jaddaf</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="font-bold text-[#008B74] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>{t('booking.viewMap')}</span>
                  <ExternalLink className="w-3 h-3 rtl:mr-1" />
                </button>
              </div>
            </div>

            {/* Notification notice */}
            <div className="mt-5 p-4 rounded-xl bg-[#E6F4F1] border border-[#B2E2D9] flex items-start gap-3">
              <Check className="w-4 h-4 text-[#008B74] mt-0.5 shrink-0" />
              <p className="text-xs text-[#284E46] leading-relaxed">
                An SMS confirmation has been dispatched to <strong>{countryCode} {mobileNumber}</strong>. You can view, track, or cancel this booking anytime from your Patient Portal.
              </p>
            </div>

            {/* The 2 Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/patient/dashboard"
                className="w-full sm:w-1/2 py-3.5 px-5 bg-[#008B74] hover:bg-[#007461] text-white text-xs sm:text-sm font-bold rounded-xl text-center transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{t('booking.viewBookingsBtn')}</span>
              </Link>
              <button
                type="button"
                onClick={() => navigate('/doctors')}
                className="w-full sm:w-1/2 py-3.5 px-5 bg-[#FAF9F5] hover:bg-[#E5DFCD] text-[#111827] text-xs sm:text-sm font-bold rounded-xl text-center transition-all border border-[#E5DFCD] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{t('booking.goBack')}</span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setBookedAppointment(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] underline cursor-pointer"
              >
                {t('booking.bookAnotherBtn')}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: DEDICATED BOOKING PAGE                                            */
          /* ========================================================================= */
          <div className="bg-white rounded-3xl border border-[#E5DFCD] p-6 sm:p-8 shadow-xs">
            
            {/* Page Header */}
            <div className="pb-5 border-b border-[#E5DFCD]">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                {t('booking.pageTitle')}
              </h1>
              <p className="text-xs text-[#6B7280] mt-1">
                {t('booking.pageSubtitle')}
              </p>
            </div>

            {/* Doctor Profile Banner */}
            <div className="mt-5 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5DFCD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E5DFCD] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#111827]">
                      {doctor.name}
                    </h2>
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#008B74] border border-[#B2E2D9]">
                      {t('booking.verifiedSpecialist')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#008B74] mt-0.5">
                    {translateSpecialty(doctor.specialty)}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#008B74] shrink-0" />
                    <span>{doctor.hospitalName || 'CMC Hospital Dubai'}</span>
                  </p>
                </div>
              </div>

              {/* Doctor switcher dropdown */}
              <div className="sm:text-right rtl:sm:text-left shrink-0">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1">
                  {t('booking.changeDoctor')}
                </label>
                <div className="relative inline-block">
                  <select
                    value={selectedDocId}
                    onChange={(e) => handleSelectDoctor(e.target.value)}
                    className="appearance-none text-xs bg-white border border-[#E5DFCD] rounded-xl pl-3 pr-7 rtl:pl-7 rtl:pr-3 py-2 font-medium text-[#111827] cursor-pointer focus:outline-hidden hover:border-[#BAC7AD]"
                  >
                    {allDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({translateSpecialty(d.specialty)})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <form onSubmit={handleBookNow} className="mt-6 space-y-6">
              
              {/* =================================================================== */}
              {/* STYLED DEPARTMENT DROPDOWN                                          */}
              {/* =================================================================== */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#008B74]" />
                    <span>{t('booking.specialtyLabel')}</span>
                  </label>
                  <span className="text-[10px] font-semibold text-[#008B74] bg-[#E6F4F1] px-2 py-0.5 rounded-md border border-[#B2E2D9]">
                    {t('booking.doctorsSpecialties')}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-[#008B74]">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full appearance-none bg-[#FAF9F5] hover:bg-white focus:bg-white border border-[#E5DFCD] hover:border-[#BAC7AD] focus:border-[#008B74] focus:ring-2 focus:ring-[#008B74]/20 rounded-2xl pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-3.5 text-xs sm:text-sm font-semibold text-[#111827] transition-all cursor-pointer outline-hidden shadow-2xs"
                  >
                    {doctorDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {translateSpecialty(dept)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 rtl:right-auto rtl:left-0 rtl:pr-0 rtl:pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-[#6B7280] mt-1.5">
                  {t('booking.showingDepartments', { name: doctor.name })}
                </p>
              </div>

              {/* =================================================================== */}
              {/* DATE SELECTION (7-DAY STRIP)                                       */}
              {/* =================================================================== */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#008B74]" />
                    <span>{t('booking.selectDate')}</span>
                  </label>
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    {selectedDateObj.fullDisplay}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {nextDates.map((d) => {
                    const isSelected = selectedDateObj.date === d.date;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDateObj(d)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#008B74] text-white border-[#008B74] shadow-xs scale-[1.02]'
                            : 'bg-[#FAF9F5] border-[#E5DFCD] text-[#4B5563] hover:bg-white hover:border-[#BAC7AD]'
                        }`}
                      >
                        <span className="text-[10px] block font-bold capitalize">
                          {d.dayName}
                        </span>
                        <span className="text-xs font-semibold block mt-0.5">
                          {d.display}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================================== */}
              {/* TIME SLOTS (30-MINUTE INTERVALS)                                   */}
              {/* =================================================================== */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#008B74]" />
                    <span>{t('booking.selectTime')}</span>
                  </label>
                  <span className="text-xs font-bold text-[#008B74]">
                    {t('booking.selectedSlotLabel')}: {selectedSlot}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {doctor.availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-2 text-center rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#008B74] text-white border-[#008B74] font-bold shadow-xs'
                            : 'bg-[#FAF9F5] hover:bg-white text-[#1F2937] border-[#E5DFCD] hover:border-[#BAC7AD]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================================== */}
              {/* PATIENT DETAILS                                                    */}
              {/* =================================================================== */}
              <div className="pt-4 border-t border-[#E5DFCD] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#008B74]" />
                    <span>{t('booking.patientInfoTitle')}</span>
                  </h3>
                  <span className="text-[11px] text-[#6B7280]">
                    * {t('common.required', 'Required fields')}
                  </span>
                </div>

                {/* Patient Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-[#374151] mb-1.5">
                    {t('booking.fullName')} *
                  </label>
                  <div className="bg-[#FAF9F5] hover:bg-white focus-within:bg-white rounded-2xl border border-[#E5DFCD] focus-within:border-[#008B74] focus-within:ring-2 focus-within:ring-[#008B74]/20 px-4 py-3 flex items-center transition-all">
                    <User className="w-4 h-4 text-[#6B7280] mr-2.5 rtl:mr-0 rtl:ml-2.5 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder={t('booking.fullNamePlaceholder')}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-[#111827] focus:outline-hidden font-medium placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                {/* Patient Mobile with Country Code */}
                <div>
                  <label className="block text-[11px] font-bold text-[#374151] mb-1.5">
                    {t('booking.mobileNumber')} *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-32 shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full appearance-none bg-[#FAF9F5] border border-[#E5DFCD] rounded-2xl px-3 py-3 text-xs font-bold text-[#111827] focus:outline-hidden focus:border-[#008B74] cursor-pointer"
                      >
                        <option value="+971">+971 (UAE)</option>
                        <option value="+965">+965 (KWT)</option>
                        <option value="+966">+966 (KSA)</option>
                        <option value="+974">+974 (QAT)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+1">+1 (US)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="flex-1 bg-[#FAF9F5] hover:bg-white focus-within:bg-white rounded-2xl border border-[#E5DFCD] focus-within:border-[#008B74] focus-within:ring-2 focus-within:ring-[#008B74]/20 px-4 py-3 flex items-center transition-all">
                      <Phone className="w-4 h-4 text-[#6B7280] mr-2.5 rtl:mr-0 rtl:ml-2.5 shrink-0" />
                      <input
                        type="tel"
                        required
                        placeholder={t('booking.mobilePlaceholder')}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm text-[#111827] focus:outline-hidden font-medium placeholder:text-[#9CA3AF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#374151] mb-1.5">
                    {t('booking.email')} <span className="text-[#6B7280] font-normal">({t('common.optional', 'Optional')})</span>
                  </label>
                  <div className="bg-[#FAF9F5] hover:bg-white focus-within:bg-white rounded-2xl border border-[#E5DFCD] focus-within:border-[#008B74] focus-within:ring-2 focus-within:ring-[#008B74]/20 px-4 py-3 flex items-center transition-all">
                    <Mail className="w-4 h-4 text-[#6B7280] mr-2.5 rtl:mr-0 rtl:ml-2.5 shrink-0" />
                    <input
                      type="email"
                      placeholder={t('booking.emailPlaceholder')}
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-[#111827] focus:outline-hidden font-medium placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Payment Notice */}
              <div className="bg-[#E6F4F1] border border-[#B2E2D9] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#284E46]">
                <ShieldCheck className="w-5 h-5 text-[#008B74] mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-[#008B74] block">{t('booking.zeroUpfrontPayment')}</span>
                  <p className="leading-relaxed">
                    {t('booking.zeroUpfrontDesc')}
                  </p>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded-sm border-[#E5DFCD] text-[#008B74] focus:ring-[#008B74] cursor-pointer"
                />
                <label htmlFor="termsCheckbox" className="text-xs text-[#4B5563] cursor-pointer leading-snug">
                  {t('booking.termsText')}
                </label>
              </div>

              {/* Guest notice — shown when not signed in */}
              {!isAuthenticated && isFormValid && (
                <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <LogIn className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-800 leading-snug">
                    {t('booking.signInRequiredNotice')}
                  </p>
                </div>
              )}

              {/* PRIMARY SUBMIT BUTTON */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 ${
                    !isFormValid
                      ? 'bg-[#8D9B7B] text-white/80 cursor-not-allowed opacity-75 shadow-none'
                      : 'bg-[#008B74] hover:bg-[#007461] active:scale-[0.99] text-white cursor-pointer shadow-md hover:shadow-lg shadow-[#008B74]/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('booking.confirmingWithHospital')}</span>
                    </>
                  ) : !isAuthenticated && isFormValid ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{t('booking.signInAndBook')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('booking.confirmAndBook')}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>

                {!isFormValid && (
                  <p className="text-center text-[11px] text-[#6B7280] mt-2">
                    {t('booking.fillRequiredNotice')}
                  </p>
                )}
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Show Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-[#E5DFCD] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111827]">{t('booking.hospitalLocation')}</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-[#6B7280] hover:text-[#111827] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-16/9 bg-[#FAF9F5] rounded-2xl overflow-hidden border border-[#E5DFCD] flex items-center justify-center relative">
              <iframe
                title="CMC Hospital Map"
                src="https://maps.google.com/maps?q=Clemenceau+Medical+Center+Hospital+Dubai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <p className="text-xs text-[#4B5563]">
              {t('booking.address')}: Dubai Healthcare City Phase 2 - Al Jaddaf - Dubai, UAE
            </p>

            <button
              type="button"
              onClick={() => setShowMapModal(false)}
              className="w-full py-2.5 bg-[#008B74] hover:bg-[#007461] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              {t('booking.close')}
            </button>
          </div>
        </div>
      )}

      {/* Guest Login Modal — intercepts booking when user is not authenticated */}
      {showLoginModal && (
        <GuestLoginModal
          doctorName={doctor.name}
          onSuccess={handleLoginSuccess}
          onClose={() => { setShowLoginModal(false); setPendingBooking(false); }}
        />
      )}
    </div>
  );
};

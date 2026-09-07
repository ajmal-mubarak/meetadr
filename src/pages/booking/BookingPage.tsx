import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  MapPin,
  Building2,
  Phone,
  Mail,
  User,
  AlertCircle,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../context/ToastContext';
import { INITIAL_DOCTORS } from '../../data/mockDoctors';
import { INITIAL_HOSPITALS } from '../../data/mockHospitals';

export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const allDoctors = INITIAL_DOCTORS;
  const allHospitals = INITIAL_HOSPITALS;

  // Selected doctor (defaulting to Dr. Sarah Chen or the param)
  const [selectedDocId, setSelectedDocId] = useState<string>(
    doctorId || 'doc_sarah_chen'
  );

  const doctor = useMemo(() => {
    return allDoctors.find((d) => d.id === selectedDocId) || allDoctors[0];
  }, [allDoctors, selectedDocId]);

  // Form inputs matching Client PDF Page 6
  const [selectedSpecialty, setSelectedSpecialty] = useState(doctor.specialty);
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
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const display = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ date: iso, dayName, display, fullDisplay: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) });
    }
    return dates;
  }, []);

  const [selectedDateObj, setSelectedDateObj] = useState(nextDates[0]);
  const [selectedSlot, setSelectedSlot] = useState(doctor.availableSlots[0] || '10:00 AM');

  // Interactive Live Confirmation state
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cancel Booking states (from Client PDF Page 6)
  const [cancelReason, setCancelReason] = useState<string>('Unforeseen Event');
  const [showMapModal, setShowMapModal] = useState(false);

  const handleSelectDoctor = (id: string) => {
    setSelectedDocId(id);
    const found = allDoctors.find((d) => d.id === id);
    if (found) {
      setSelectedSpecialty(found.specialty);
      setSelectedSlot(found.availableSlots[0] || '10:00 AM');
    }
  };

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      showToast('Please accept the Terms and Conditions to proceed.', 'error');
      return;
    }

    if (!patientName.trim()) {
      showToast('Please enter the patient full name.', 'error');
      return;
    }

    if (!mobileNumber.trim()) {
      showToast('Please enter a valid mobile number for SMS confirmation.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = `${countryCode} ${mobileNumber}`;
      const newAppt = await bookingService.createAppointment({
        patientId: user ? user.id : 'guest_patient',
        patientName,
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

      setConfirmedBookingId(newAppt.id);
      showToast('Appointment successfully placed! CMC Hospital will reach out shortly.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to place booking.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirmedBookingId) return;
    try {
      await bookingService.cancelAppointment(confirmedBookingId, cancelReason);
      showToast('Booking cancelled.', 'info');
      setConfirmedBookingId(null);
    } catch (err: any) {
      showToast('Unable to cancel booking: ' + err.message, 'error');
    }
  };

  return (
    <div className="bg-[#F6F5EE] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#525252] hover:text-[#000000] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Doctors</span>
          </Link>
          <span className="text-xs font-semibold text-[#8D9B7B] bg-white px-3 py-1 rounded-full border border-[#E5DFCD]">
            Instant In-Person Booking
          </span>
        </div>

        {/* 2-Column Layout matching Client PDF Page 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Booking Form (Client PDF Page 6)                             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DFCD] p-6 sm:p-8 shadow-xs">
            
            {/* Header facility card */}
            <div className="flex items-start gap-4 pb-6 border-b border-[#E5DFCD]">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#E5DFCD] shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#000000]">
                    {doctor.name}
                  </h2>
                  <select
                    value={selectedDocId}
                    onChange={(e) => handleSelectDoctor(e.target.value)}
                    className="text-xs bg-[#F6F5EE] border border-[#E5DFCD] rounded-lg px-2 py-1 font-medium text-[#000000] cursor-pointer"
                  >
                    {allDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Change: {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs font-semibold text-[#8D9B7B] mt-0.5">
                  {doctor.hospitalName || 'CMC (Clemenceau Medical Center Hospital Dubai)'}
                </p>
                <p className="text-[11px] text-[#737373] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8D9B7B] shrink-0" />
                  <span>Dubai Healthcare City Phase 2 - Al Jaddaf - Dubai, Dubai</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleBookNow} className="mt-6 space-y-6">
              
              {/* Specialty Selector */}
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-2">
                  Speciality
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-4 py-3 text-xs font-semibold text-[#000000] focus:outline-hidden"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Practice">General Practice</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              {/* Date & Time Section (Client PDF Page 6) */}
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-2">
                  Choose Preferred Date and Time
                </label>

                {/* Date Strip */}
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-4">
                  {nextDates.slice(0, 4).map((d) => {
                    const isSelected = selectedDateObj.date === d.date;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDateObj(d)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#8D9B7B] text-white border-[#8D9B7B] shadow-xs'
                            : 'bg-white border-[#E5DFCD] text-[#525252] hover:bg-[#F6F5EE]'
                        }`}
                      >
                        <span className="text-[11px] block font-bold capitalize">
                          {d.dayName}
                        </span>
                        <span className="text-xs block mt-0.5">
                          {d.display}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 30-Minute Interval notice */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#737373] font-medium">
                    Show Time with gap of 30 Minutes Gaps
                  </span>
                  <span className="text-xs font-bold text-[#8D9B7B]">
                    Slot: {selectedSlot}
                  </span>
                </div>

                {/* 30-Minute Slots Grid (Client PDF Page 6) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {doctor.availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2 text-center rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#8D9B7B] text-white border-[#8D9B7B] font-bold shadow-xs'
                            : 'bg-[#F6F5EE]/60 hover:bg-white text-[#262626] border-[#E5DFCD]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-2">
                  Patient&apos;s Full Name
                </label>
                <div className="bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
                  <User className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#000000] focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Patient Mobile Number with Country Code Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-2">
                  Patient&apos;s Mobile
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-3 py-3 text-xs font-bold text-[#000000] focus:outline-hidden cursor-pointer"
                  >
                    <option value="+971">+971 (UAE)</option>
                    <option value="+965">+965 (KWT)</option>
                    <option value="+966">+966 (KSA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (US)</option>
                  </select>

                  <div className="flex-1 bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
                    <Phone className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      placeholder="52 412 2794"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#000000] focus:outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Patient Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-2">
                  Patient&apos;s Email (Optional)
                </label>
                <div className="bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
                  <Mail className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#000000] focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Terms Checkbox from Client PDF Page 6 */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded-sm border-[#E5DFCD] text-[#8D9B7B] focus:ring-[#8D9B7B] cursor-pointer"
                />
                <label htmlFor="termsCheckbox" className="text-xs text-[#525252] cursor-pointer leading-snug">
                  I have read the provisions of the Terms and Conditions and accept them as binding on me.
                </label>
              </div>

              {/* Book Now Button in Palette Sage Green */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#8D9B7B] hover:bg-[#748263] text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming with Hospital...' : 'Book Now'}
              </button>
            </form>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Confirmation & Cancellation Preview (Client PDF Page 6)     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Confirmation Box (Client PDF Page 6) */}
            <div className="bg-white rounded-2xl border border-[#E5DFCD] p-6 shadow-xs space-y-5">
              
              {/* Green status notification */}
              <div className="bg-[#EFF3EC] border border-[#BAC7AD] rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-[#6C7A5B]">
                  Appointment will confirm shortly
                </p>
                <p className="text-[11px] text-[#525252] mt-1">
                  Hospital/Clinic will reach out to you at provided mobile number
                </p>
              </div>

              {/* Doctor and Hospital Details Card */}
              <div className="border border-[#E5DFCD] rounded-xl p-4 space-y-3 bg-[#F6F5EE]/40">
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E5DFCD]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#000000]">{doctor.name}</h4>
                    <p className="text-xs text-[#8D9B7B] font-semibold">{doctor.hospitalName || 'CMC Hospital Dubai'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5DFCD] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Date :</span>
                    <strong className="text-[#000000] font-semibold">{selectedDateObj.fullDisplay}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Time :</span>
                    <strong className="text-[#000000] font-semibold">{selectedSlot}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Hospital :</span>
                    <strong className="text-[#000000] font-semibold text-right max-w-[65%] line-clamp-1">
                      CMC, Jaddaf, Dubai
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Location :</span>
                    <button
                      type="button"
                      onClick={() => setShowMapModal(true)}
                      className="text-xs font-bold text-[#8D9B7B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Show Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Department :</span>
                    <strong className="text-[#000000] font-semibold">{selectedSpecialty}</strong>
                  </div>
                </div>
              </div>

              {/* Cancel Booking Section (Client PDF Page 6) */}
              <div className="pt-4 border-t border-[#E5DFCD]">
                <h4 className="text-xs font-bold text-[#000000] mb-2">
                  Cancel Booking ?
                </h4>
                <p className="text-[11px] text-[#737373] mb-3">
                  If your schedule changes, please inform the facility early.
                </p>

                <div className="space-y-2 mb-4">
                  {['Unforeseen Event', 'Wrongly Scheduled', 'Others'].map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-2 text-xs text-[#525252] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="text-[#8D9B7B] focus:ring-[#8D9B7B]"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="w-full py-2.5 border border-[#E5DFCD] bg-white hover:bg-[#F6F5EE] text-xs font-bold text-[#000000] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel Booking
                </button>
              </div>

            </div>

            {/* In-Person Care Guarantee Note */}
            <div className="bg-[#EFF3EC] border border-[#BAC7AD] rounded-2xl p-5 text-xs text-[#525252] space-y-2">
              <div className="flex items-center gap-2 text-[#6C7A5B] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#8D9B7B]" />
                <span>Zero Online Payment Required</span>
              </div>
              <p className="leading-relaxed">
                MeetAdr appointments are 100% in-person clinic consultations. Consultation fees or insurance copays are settled directly at the hospital reception upon arrival.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Show Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E5DFCD] shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#000000]">CMC Hospital Dubai Location</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-[#737373] hover:text-[#000000] p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-16/9 bg-[#F6F5EE] rounded-xl overflow-hidden border border-[#E5DFCD] flex items-center justify-center relative">
              <iframe
                title="CMC Hospital Map"
                src="https://maps.google.com/maps?q=Clemenceau+Medical+Center+Hospital+Dubai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <p className="text-xs text-[#525252]">
              Address: Dubai Healthcare City Phase 2 - Al Jaddaf - Dubai, UAE
            </p>

            <button
              onClick={() => setShowMapModal(false)}
              className="w-full py-2.5 bg-[#8D9B7B] text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

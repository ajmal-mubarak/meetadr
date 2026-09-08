import React, { useState } from 'react';
import { Building2, Stethoscope, CheckCircle2, Phone, Mail, MapPin, Globe, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { providerService } from '../../services/providerService';
import { useToast } from '../../context/ToastContext';

export const JoinProviderPage: React.FC = () => {
  const { showToast } = useToast();

  // Multi-type selection from Page 7 (Hospital, Clinic, Doctor)
  const [isHospital, setIsHospital] = useState(true);
  const [isClinic, setIsClinic] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [countryCode, setCountryCode] = useState('+965');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [location, setLocation] = useState('Dubai');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !contactNumber || !email) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    if (!isHospital && !isClinic && !isDoctor) {
      showToast('Please select at least one entity type (Hospital, Clinic, or Doctor).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedTypes: string[] = [];
      if (isHospital) selectedTypes.push('hospital');
      if (isClinic) selectedTypes.push('clinic');
      if (isDoctor) selectedTypes.push('doctor');

      await providerService.submitJoinRequest({
        providerType: (selectedTypes[0] as any) || 'hospital',
        name: entityName || applicantName,
        contactNumber: `${countryCode} ${contactNumber}`,
        email,
        country,
        location,
      });

      setIsSuccess(true);
      showToast('Application sent successfully. Our team member will connect with you soon.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 15 Partner Hospital Badges from Client PDF Page 7
  const partnerHospitalsList = [
    { id: 1, name: 'Christian Medical College', location: 'Vellore' },
    { id: 2, name: 'Apollo Hospitals', location: 'Chennai' },
    { id: 3, name: 'Medanta - The Medicity', location: 'Gurugram' },
    { id: 4, name: 'Indraprastha Apollo Hospitals', location: 'Delhi' },
    { id: 5, name: 'Kokilaben Dhirubhai Ambani Hospital', location: 'Mumbai' },
    { id: 6, name: 'Sir Ganga Ram Hospital', location: 'Delhi' },
    { id: 7, name: 'Apollo Health City', location: 'Hyderabad' },
    { id: 8, name: 'Manipal Hospital, HAL Airport Rd', location: 'Bengaluru' },
    { id: 9, name: 'P.D. Hinduja Hospital', location: 'Mumbai' },
    { id: 10, name: 'Max Super Speciality Hospital', location: 'Delhi' },
    { id: 11, name: 'Amrita Institute of Medical Science', location: 'Kochi' },
    { id: 12, name: 'Lilavati Hospital & Research', location: 'Mumbai' },
    { id: 13, name: 'Jaslok Hospital & Research', location: 'Mumbai' },
    { id: 14, name: 'Deenanath Mangeshkar Hospital', location: 'Pune' },
    { id: 15, name: 'Aster Medcity', location: 'Kochi' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 mb-2">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Healthcare Partner Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Join with us, it&apos;s free
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Connect your facility with patients seeking in-person consultations across UAE.
          </p>
        </div>

        {/* 2-Column Layout matching Client PDF Page 7 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Registration Form (PDF Page 7)                               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">
              Join with us, it&apos;s free
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details below and our team member will connect you soon.
            </p>

            {isSuccess ? (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Application Received</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{applicantName}</strong>. Our team member will connect with you soon regarding <strong>{entityName || 'your facility'}</strong>.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Checkboxes: Hospital | Clinic | Doctor */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    Select Classification
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHospital}
                        onChange={(e) => setIsHospital(e.target.checked)}
                        className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Hospital</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isClinic}
                        onChange={(e) => setIsClinic(e.target.checked)}
                        className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Clinic</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDoctor}
                        onChange={(e) => setIsDoctor(e.target.checked)}
                        className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Doctor</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contact person / Doctor name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 font-medium"
                  />
                </div>

                {/* Name (Hospital / Clinic / Dr.) */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Name (Hospital / Clinic / Dr.)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Facility name or Practice name"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-500 font-medium"
                  />
                </div>

                {/* Contact Number with Country Code Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Contact Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-28 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
                    >
                      <option value="+965">+965 (KWT)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+966">+966 (KSA)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+1">+1 (US)</option>
                    </select>

                    <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 flex items-center">
                      <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile / Phone number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-900 focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Email
                  </label>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="info@facility.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-900 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                {/* Country & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City / Area (e.g. Al Jaddaf, Dubai)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Sending details...' : 'Send'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-slate-500 font-medium">
                  Our team member will connect you soon
                </p>
              </form>
            )}
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Our Partners (Client PDF Page 7)                            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Our Partners .......
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Accredited medical centers and hospital networks on MeetAdr
              </p>
            </div>

            {/* Featured UAE Hospital Badges (from PDF Page 7) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#9B1D50] text-white rounded-xl text-center flex flex-col items-center justify-center font-bold text-xs">
                <span>MED</span>
                <span>CARE</span>
              </div>

              <div className="p-3 bg-[#112F4E] text-white rounded-xl text-center flex flex-col items-center justify-center font-bold text-[11px] leading-tight">
                <span className="text-[10px] text-sky-300">CSH</span>
                <span>Canadian Specialist</span>
              </div>

              <div className="p-3 bg-[#0A3D62] text-white rounded-xl text-center flex flex-col items-center justify-center font-bold text-[11px] leading-tight">
                <span>Aster</span>
                <span className="text-[9px] text-sky-200">HOSPITAL</span>
              </div>

              <div className="p-3 bg-[#0B2545] text-white rounded-xl text-center flex flex-col items-center justify-center font-bold text-[11px] leading-tight border border-slate-700">
                <span>HOSPITALS</span>
                <span className="text-[9px] text-teal-400">IN UAE</span>
              </div>
            </div>

            {/* 15 Partner Hospital Badges Grid */}
            <div className="border-t border-slate-100 pt-5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                15+ Leading Hospital Affiliates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {partnerHospitalsList.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-400 transition-all flex items-center gap-2.5"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {partner.id}
                    </span>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {partner.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {partner.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Direct integration with hospital outpatient clinic rosters. Zero setup fees or hardware installations needed.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

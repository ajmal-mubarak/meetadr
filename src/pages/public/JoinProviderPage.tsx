import React, { useState } from 'react';
import { Building2, Stethoscope, CheckCircle2, ShieldAlert, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { providerService } from '../../services/providerService';
import { useToast } from '../../context/ToastContext';

export const JoinProviderPage: React.FC = () => {
  const { showToast } = useToast();
  const [providerType, setProviderType] = useState<'hospital' | 'clinic' | 'doctor'>('hospital');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [location, setLocation] = useState('Dubai');
  const [doctorCount, setDoctorCount] = useState('10-25 Doctors');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactNumber || !email) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await providerService.submitJoinRequest({
        providerType,
        name,
        contactNumber,
        email,
        country,
        location,
      });
      setIsSuccess(true);
      showToast('Provider application received successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit application.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F6F5EE] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#E5DFCD] p-8 sm:p-12 shadow-xs">
        
        {/* Badge & Title from Client PDF Page 7 */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-[#EFF3EC] border border-[#BAC7AD] text-xs font-bold text-[#6C7A5B] mb-3">
            Partner With meetAdr
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
            Register as a Doctor or Hospital
          </h1>
          <p className="text-xs sm:text-sm text-[#525252] mt-2 max-w-md mx-auto">
            Fill empty calendar slots, expand patient discovery, and deliver seamless in-person consultations.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-[#EFF3EC] border border-[#BAC7AD] rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-[#8D9B7B] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#000000]">Application Under Review</h3>
            <p className="text-xs text-[#525252] max-w-md mx-auto leading-relaxed">
              Our clinical network onboarding team has received your details for <strong>{name}</strong>. We will contact you at <strong>{contactNumber}</strong> within 24 business hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 px-6 py-2.5 bg-[#8D9B7B] text-white text-xs font-bold rounded-xl"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Provider Type Selection */}
            <div>
              <label className="block text-xs font-bold text-[#000000] mb-2">
                Select Provider Classification
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setProviderType('hospital')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    providerType === 'hospital'
                      ? 'bg-[#8D9B7B] text-white border-[#8D9B7B] shadow-xs'
                      : 'bg-[#F6F5EE]/70 border-[#E5DFCD] text-[#525252] hover:bg-[#F6F5EE]'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-bold">Hospital</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProviderType('clinic')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    providerType === 'clinic'
                      ? 'bg-[#8D9B7B] text-white border-[#8D9B7B] shadow-xs'
                      : 'bg-[#F6F5EE]/70 border-[#E5DFCD] text-[#525252] hover:bg-[#F6F5EE]'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-bold">Clinic</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProviderType('doctor')}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    providerType === 'doctor'
                      ? 'bg-[#8D9B7B] text-white border-[#8D9B7B] shadow-xs'
                      : 'bg-[#F6F5EE]/70 border-[#E5DFCD] text-[#525252] hover:bg-[#F6F5EE]'
                  }`}
                >
                  <Stethoscope className="w-5 h-5" />
                  <span className="text-xs font-bold">Doctor</span>
                </button>
              </div>
            </div>

            {/* Entity Name */}
            <div>
              <label className="block text-xs font-bold text-[#000000] mb-1.5">
                {providerType === 'doctor' ? 'Full Doctor Name & Title' : 'Facility Name'}
              </label>
              <input
                type="text"
                required
                placeholder={providerType === 'doctor' ? 'e.g. Dr. John Smith, MD' : 'e.g. CMC Hospital Dubai'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-4 py-3 text-xs text-[#000000] placeholder-[#737373] focus:outline-hidden"
              />
            </div>

            {/* Official Contact Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1.5">
                  Official Contact Phone
                </label>
                <div className="bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
                  <Phone className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
                  <input
                    type="tel"
                    required
                    placeholder="+971 52 412 2794"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#000000] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1.5">
                  Official Email
                </label>
                <div className="bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
                  <Mail className="w-4 h-4 text-[#737373] mr-2 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="partners@facility.ae"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#000000] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Location & Emirate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1.5">
                  Emirate / City
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-3 py-3 text-xs font-bold text-[#000000] focus:outline-hidden cursor-pointer"
                >
                  <option value="Dubai - Al Jaddaf">Dubai - Al Jaddaf</option>
                  <option value="Dubai - Healthcare City">Dubai - Healthcare City</option>
                  <option value="Dubai - Downtown">Dubai - Downtown</option>
                  <option value="Abu Dhabi - Al Maryah">Abu Dhabi - Al Maryah</option>
                  <option value="Sharjah - Al Majaz">Sharjah - Al Majaz</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1.5">
                  Doctor Capacity
                </label>
                <select
                  value={doctorCount}
                  onChange={(e) => setDoctorCount(e.target.value)}
                  className="w-full bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-3 py-3 text-xs font-bold text-[#000000] focus:outline-hidden cursor-pointer"
                >
                  <option value="1-5 Doctors">1-5 Doctors</option>
                  <option value="5-15 Doctors">5-15 Doctors</option>
                  <option value="15-50 Doctors">15-50 Doctors</option>
                  <option value="50+ Doctors">50+ Doctors</option>
                </select>
              </div>
            </div>

            {/* In-person Care Acknowledgment */}
            <div className="bg-[#EFF3EC] border border-[#BAC7AD] rounded-xl p-4 text-xs text-[#525252]">
              <span className="font-bold text-[#000000] block mb-1">
                Zero Integration Friction
              </span>
              MeetAdr connects directly into your existing scheduling workflow without requiring specialized hardware. Appointments are scheduled with instant mobile verification.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#8D9B7B] hover:bg-[#748263] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Submitting Application...' : 'Submit Partnership Application'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

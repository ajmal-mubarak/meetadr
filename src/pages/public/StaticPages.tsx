import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Clock,
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  CheckCircle2,
  Send,
  Users,
  Building,
  FileText,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// 1. ABOUT
export const AboutPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">About Us</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Transforming Healthcare Scheduling
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          MeetAdr was founded with a single mission: to eliminate friction in medical scheduling, making quality healthcare accessible, transparent, and seamless for patients and practitioners alike.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
          <Clock className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">Real-Time Slots</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Eliminate phone queues with guaranteed 30-minute consultation slots directly linked with hospitals.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
          <Shield className="w-6 h-6 text-emerald-600 mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">Verified Credentials</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Every practitioner and clinical center on our platform is vetted for active regional licensing.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <HeartHandshake className="w-6 h-6 text-slate-700 mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">Free for Patients</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Zero hidden booking fees or processing markups. Patients pay medical fees directly at the clinic.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">Our Vision</h2>
        <p>
          We envision an integrated digital health ecosystem where patients can discover the most suitable specialists in seconds, schedule consultations without bureaucratic delays, and receive timely reminders and follow-ups.
        </p>
      </div>
    </div>
  </div>
);

// 2. SERVICES
export const ServicesPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Platform Capabilities</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Our Healthcare Services
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          From patient discovery to clinical enterprise management, MeetAdr powers modern healthcare workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 space-y-2">
          <h3 className="text-base font-bold text-slate-900">Patient Appointment Scheduling</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Real-time appointment discovery by doctor specialty, location, hospital, or specific health condition with instant confirmation.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 space-y-2">
          <h3 className="text-base font-bold text-slate-900">Hospital & Clinic Operations</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Centralized schedule management, multi-doctor roster visibility, and patient appointment tracking with zero double-booking.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 space-y-2">
          <h3 className="text-base font-bold text-slate-900">Physician Practice Portals</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Specialist-specific dashboards displaying today's patient queue, consultation records, and upcoming weekly schedules.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 space-y-2">
          <h3 className="text-base font-bold text-slate-900">Healthcare Analytics & Reports</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Operational summaries of appointments by specialty, doctor load, confirmed rates, and patient visit volumes.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// 3. PARTNERS
export const PartnersPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Collaborations</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Our Healthcare Partners
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          MeetAdr proudly collaborates with leading hospital groups, ambulatory medical centers, and specialized diagnostic laboratories across the region.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        {['City Care Health Group', 'Apex Medical Consortium', 'Al Noor Hospital Trust', 'Gulf Central Clinics', 'Marina Gateway Surgical', 'Sharjah Academic Hospital', 'Prime Dermatology Group', 'NeuroCure Specialized'].map((partner) => (
          <div key={partner} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-800">{partner}</span>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Become an Official Partner</h3>
          <p className="text-xs text-slate-600 mt-1">Join our network of over 100+ accredited facilities.</p>
        </div>
        <Link
          to="/join"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0"
        >
          Join as Provider
        </Link>
      </div>
    </div>
  </div>
);

// 4. CONTACT
export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received. Our team will contact you shortly.', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact Support & Inquiries
          </h1>
          <p className="text-base text-slate-600 mt-2">
            Have questions about booking an appointment, provider onboarding, or system integration?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <Phone className="w-5 h-5 text-blue-600 mb-2" />
            <strong className="block text-slate-900 font-semibold text-sm">Phone Support</strong>
            <span>+971 4 800 MEETADR</span>
            <span className="block text-slate-400">Sun - Thu: 8am - 8pm</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <Mail className="w-5 h-5 text-blue-600 mb-2" />
            <strong className="block text-slate-900 font-semibold text-sm">Email Inquiries</strong>
            <span>support@meetadr.demo</span>
            <span className="block text-slate-400">Response within 24 hours</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <MapPin className="w-5 h-5 text-blue-600 mb-2" />
            <strong className="block text-slate-900 font-semibold text-sm">Headquarters</strong>
            <span>Dubai Healthcare City</span>
            <span className="block text-slate-400">Bldg 42, Dubai, UAE</span>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">Thank you for your message!</h3>
            <p className="text-xs text-emerald-800">Our patient support team will reach out to your email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Appointment query or provider partnership..."
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can we assist you today?"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 5. FAQ
export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'Do I have to pay any fee to book an appointment through MeetAdr?',
      a: 'No. MeetAdr is 100% free for patients. There are zero booking fees, platform charges, or cancellation penalties. Any medical consultation fees are paid directly at the hospital or clinic during your visit.',
    },
    {
      q: 'How do I know my appointment is confirmed?',
      a: 'Immediately upon completing your booking on MeetAdr, your appointment is scheduled in the system with status Confirmed. The hospital or clinic reception will call or SMS your registered mobile number prior to the visit.',
    },
    {
      q: 'Can I cancel or reschedule my appointment?',
      a: 'Yes. You can visit My Bookings from your Patient Portal or click your booking link to cancel with a single click. Simply choose a cancellation reason and the slot is immediately released.',
    },
    {
      q: 'Are the doctors and clinics verified?',
      a: 'Yes, every doctor, hospital, and clinic on MeetAdr undergoes verification against regional medical licensing standards.',
    },
    {
      q: 'What should I bring to my appointment?',
      a: 'Please bring your regional Emirates ID or national identification card, any existing medical records or lab test results, and your health insurance card if applicable.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Help & Answers</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-4 pt-2">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. HELP
export const HelpPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Support Center</span>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Need Assistance?</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        Our customer care specialists are available 7 days a week to help you locate specialists, manage upcoming visits, or coordinate urgent appointments.
      </p>
      <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
        <strong className="block text-sm font-bold">24/7 Patient Helpline</strong>
        <p>Call toll-free: <strong>+971 4 800 MEETADR</strong></p>
        <p>Email: <strong>support@meetadr.demo</strong></p>
      </div>
    </div>
  </div>
);

// 7. PRIVACY POLICY
export const PrivacyPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Legal Compliance</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: January 2025</p>
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          MeetAdr collects patient contact information (such as full name, contact mobile number, and email address) exclusively to facilitate scheduling between patients and authorized healthcare providers.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Medical Data Privacy</h2>
        <p>
          We do not store complete electronic medical health records or sensitive diagnosis history. Consultation details entered during appointment booking are transmitted securely to the designated clinic.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Third-Party Sharing</h2>
        <p>
          We do not sell, rent, or trade patient personal information to third-party advertisers. Information is only shared with the specific hospital, clinic, or doctor with whom you request an appointment.
        </p>
      </div>
    </div>
  </div>
);

// 8. TERMS & CONDITIONS
export const TermsPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Terms of Use</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Terms and Conditions</h1>
        <p className="text-xs text-slate-500 mt-1">Effective Date: January 2025</p>
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By booking an appointment or using MeetAdr, you agree to comply with and be legally bound by these Terms and Conditions. If you do not agree, please do not use our services.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. No Medical Advice</h2>
        <p>
          MeetAdr is a technology scheduling and marketplace platform. MeetAdr does NOT provide medical advice, diagnosis, or clinical treatment. Always seek the advice of your qualified physician with any questions regarding a medical condition.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Appointments and Cancellations</h2>
        <p>
          Appointments booked on MeetAdr are subject to doctor availability and hospital verification. While we make every effort to ensure prompt scheduling, clinics may adjust appointments in unforeseen clinical emergencies.
        </p>

        <h2 className="text-base font-bold text-slate-900">4. Emergency Situations</h2>
        <p>
          Do not use MeetAdr for medical emergencies. In the event of an urgent medical emergency, call 998 / 999 or proceed immediately to the nearest hospital emergency department.
        </p>
      </div>
    </div>
  </div>
);

// 9. ACCESSIBILITY
export const AccessibilityPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Universal Access</span>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Accessibility Statement</h1>
      <p>
        MeetAdr is dedicated to ensuring digital accessibility for all users, including those with visual, auditory, cognitive, or motor impairments. We conform to WCAG 2.1 AA guidelines with accessible color contrasts, screen-reader semantics, and responsive keyboard navigation.
      </p>
    </div>
  </div>
);

// 10. CAREERS
export const CareersPage: React.FC = () => (
  <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Join Our Mission</span>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Careers at MeetAdr</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        Help us build the future of connected digital healthcare. We are always seeking passionate engineers, clinical network managers, and customer experience specialists.
      </p>
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <strong className="block text-sm font-bold text-slate-900">Open Opportunities</strong>
        <p>Send your resume and portfolio to <strong>careers@meetadr.demo</strong>.</p>
      </div>
    </div>
  </div>
);

// 11. REFER A FRIEND
export const ReferPage: React.FC = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Spread the Word</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Refer a Friend or Family Member</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Help your friends and loved ones discover top-rated doctors and book verified appointments with zero hassle.
        </p>
        <div className="max-w-md mx-auto flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
          <input
            type="text"
            readOnly
            value={window.location.origin}
            className="flex-1 bg-transparent px-3 text-xs text-slate-700 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

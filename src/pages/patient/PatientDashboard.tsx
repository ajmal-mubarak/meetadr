import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getAllAppointments();
      setAppointments(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCancelConfirm = async (reason: string) => {
    if (!cancellingAppt) return;
    try {
      await bookingService.cancelAppointment(
        cancellingAppt.id,
        reason,
        'patient',
        user?.name || 'Sarah Jenkins'
      );
      showToast('Appointment successfully cancelled.', 'info');
      setCancellingAppt(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  const upcoming = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending');
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  const displayedAppointments =
    activeTab === 'upcoming' ? upcoming : activeTab === 'completed' ? completed : cancelled;

  return (
    <div className="bg-[#F6F5EE] min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner (Client PDF Page 9: Patient Portal) */}
      <div className="bg-white rounded-2xl border border-[#E5DFCD] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#EFF3EC] border border-[#BAC7AD] text-xs font-bold text-[#6C7A5B] mb-2">
            Patient Portal (Page 9)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
            Welcome back, {user?.name || 'Sarah Jenkins'}
          </h1>
          <p className="text-xs text-[#525252] mt-1">
            Manage your in-person clinical consultations, schedule reminders, and hospital visits.
          </p>
        </div>

        <Link
          to="/book/doctor/doc_sarah_chen"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#8D9B7B] hover:bg-[#748263] text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFCD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
              Upcoming Visits
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF3EC] text-[#8D9B7B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#000000] mt-2 block">
            {upcoming.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-0.5 block">Scheduled with hospital</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5DFCD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF3EC] text-[#8D9B7B] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#000000] mt-2 block">
            {completed.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-0.5 block">Past consultations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5DFCD] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">
              Cancelled
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F6F5EE] text-[#737373] flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#737373] mt-2 block">
            {cancelled.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-0.5 block">Cancelled appointments</span>
        </div>
      </div>

      {/* Main Appointments Section */}
      <div className="bg-white rounded-2xl border border-[#E5DFCD] p-6 shadow-xs space-y-6">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5DFCD] pb-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#8D9B7B] text-white shadow-xs'
                : 'bg-white text-[#525252] hover:bg-[#F6F5EE] border border-transparent'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#8D9B7B] text-white shadow-xs'
                : 'bg-white text-[#525252] hover:bg-[#F6F5EE] border border-transparent'
            }`}
          >
            Completed ({completed.length})
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-[#8D9B7B] text-white shadow-xs'
                : 'bg-white text-[#525252] hover:bg-[#F6F5EE] border border-transparent'
            }`}
          >
            Cancelled ({cancelled.length})
          </button>
        </div>

        {/* Appointment Cards List */}
        {displayedAppointments.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <CalendarCheck className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
            <p className="text-xs text-[#737373]">
              No appointments found in this category.
            </p>
            <Link
              to="/doctors"
              className="inline-block px-4 py-2 bg-[#8D9B7B] text-white text-xs font-bold rounded-xl"
            >
              Browse Specialists
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-[#F6F5EE]/40 rounded-2xl border border-[#E5DFCD] p-5 space-y-4 hover:border-[#8D9B7B] transition-colors"
              >
                {/* Doctor info & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={appt.doctorPhoto || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                      alt={appt.doctorName}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E5DFCD]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#000000]">
                        {appt.doctorName}
                      </h4>
                      <p className="text-xs font-semibold text-[#8D9B7B]">
                        {appt.specialty}
                      </p>
                      <p className="text-[11px] text-[#525252] mt-0.5 line-clamp-1">
                        {appt.hospitalName || 'CMC Hospital Dubai'}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={appt.status} />
                </div>

                {/* Date & Time Bar */}
                <div className="bg-white rounded-xl border border-[#E5DFCD] p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#000000] font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#8D9B7B]" />
                    <span>{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8D9B7B] font-mono font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{appt.timeSlot}</span>
                  </div>
                </div>

                {/* Facility Address */}
                <p className="text-[11px] text-[#737373] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8D9B7B] shrink-0" />
                  <span>Dubai Healthcare City Phase 2 - Al Jaddaf, Dubai</span>
                </p>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E5DFCD] flex items-center justify-between gap-2">
                  <a
                    href="https://maps.google.com/maps?q=Clemenceau+Medical+Center+Hospital+Dubai"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#8D9B7B] hover:underline flex items-center gap-1"
                  >
                    <span>View Map Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {appt.status !== 'cancelled' && (
                    <button
                      onClick={() => setCancellingAppt(appt)}
                      className="text-xs font-semibold text-[#737373] hover:text-red-600 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {cancellingAppt && (
        <CancelModal
          appointment={cancellingAppt}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancellingAppt(null)}
        />
      )}
    </div>
  );
};

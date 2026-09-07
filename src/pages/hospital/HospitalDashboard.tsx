import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Phone,
  Plus,
  Filter,
  Check,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';
import { doctorService } from '../../services/doctorService';
import { Appointment, Doctor } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';

export const HospitalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reachedOutIds, setReachedOutIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allAppts, allDocs] = await Promise.all([
        bookingService.getAllAppointments(),
        doctorService.getAllDoctors(),
      ]);
      setAppointments(allAppts);
      setDoctors(allDocs);
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
        'hospital',
        user?.name || 'CMC Hospital Administration'
      );
      showToast('Appointment marked cancelled.', 'info');
      setCancellingAppt(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  const handleMarkConfirmed = async (apptId: string) => {
    try {
      await bookingService.updateAppointmentStatus(apptId, 'confirmed');
      showToast('Appointment confirmed with patient.', 'success');
      loadData();
    } catch (err: any) {
      showToast('Failed to confirm appointment: ' + err.message, 'error');
    }
  };

  const handleMarkCompleted = async (apptId: string) => {
    try {
      await bookingService.updateAppointmentStatus(apptId, 'completed');
      showToast('Consultation marked completed.', 'success');
      loadData();
    } catch (err: any) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const toggleReachedOut = (id: string, phone: string) => {
    setReachedOutIds((prev) => ({ ...prev, [id]: !prev[id] }));
    showToast(`Reached out to patient at ${phone}.`, 'info');
  };

  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const pending = appointments.filter((a) => a.status === 'pending');
  const completed = appointments.filter((a) => a.status === 'completed');

  const filteredAppts = appointments.filter((a) => {
    if (filterDoctor !== 'all' && a.doctorId !== filterDoctor) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="bg-[#F6F5EE] min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner (Client PDF Page 8: Hospital Dashboard) */}
      <div className="bg-white rounded-2xl border border-[#E5DFCD] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#EFF3EC] border border-[#BAC7AD] text-xs font-bold text-[#6C7A5B] mb-2">
            Hospital Administration Portal (Page 8)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
            CMC (Clemenceau Medical Center Hospital Dubai)
          </h1>
          <p className="text-xs text-[#525252] mt-1">
            Dubai Healthcare City Phase 2 - Al Jaddaf • In-Person Appointments & Patient Intake Roster
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/book/doctor/doc_sarah_chen"
            className="px-4 py-2.5 bg-white border border-[#E5DFCD] hover:bg-[#F6F5EE] text-[#000000] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8D9B7B]" />
            <span>View Live Booking Page</span>
          </Link>

          <Link
            to="/hospital/doctors"
            className="px-4 py-2.5 bg-[#8D9B7B] hover:bg-[#748263] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-[#E5DFCD] p-5 shadow-2xs">
          <span className="text-xs font-bold text-[#737373] uppercase tracking-wider block">
            Total Bookings
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#000000] mt-2 block">
            {appointments.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-1 block">In-person consultations</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5DFCD] p-5 shadow-2xs">
          <span className="text-xs font-bold text-[#6C7A5B] uppercase tracking-wider block">
            Confirmed
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#8D9B7B] mt-2 block">
            {confirmed.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-1 block">Ready for reception check-in</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5DFCD] p-5 shadow-2xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Pending Reach-Out
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-800 mt-2 block">
            {pending.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-1 block">Call patient to verify slot</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5DFCD] p-5 shadow-2xs">
          <span className="text-xs font-bold text-[#737373] uppercase tracking-wider block">
            Completed
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#000000] mt-2 block">
            {completed.length}
          </span>
          <span className="text-[11px] text-[#525252] mt-1 block">Consultation concluded</span>
        </div>
      </div>

      {/* Main Appointment Table Section */}
      <div className="bg-white rounded-2xl border border-[#E5DFCD] p-6 shadow-xs space-y-6">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#000000]">
              Patient Appointments Roster
            </h2>
            <p className="text-xs text-[#525252]">
              Real-time bookings scheduled through MeetAdr platform
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Doctor */}
            <div className="flex items-center gap-1 bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-[#737373]" />
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#000000] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1 bg-[#F6F5EE] border border-[#E5DFCD] rounded-xl px-3 py-1.5">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#000000] focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        {filteredAppts.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#737373]">
            No appointments found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5DFCD] text-[11px] font-bold uppercase text-[#737373] tracking-wider">
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4">Date & 30-Min Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reach Out</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFCD] text-xs">
                {filteredAppts.map((appt) => {
                  const isReachedOut = reachedOutIds[appt.id];
                  return (
                    <tr key={appt.id} className="hover:bg-[#F6F5EE]/40 transition-colors">
                      {/* Patient Details */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#000000] block">{appt.patientName}</span>
                        <a
                          href={`tel:${appt.patientPhone}`}
                          className="text-[11px] text-[#8D9B7B] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{appt.patientPhone}</span>
                        </a>
                      </td>

                      {/* Doctor & Specialty */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#000000] block">{appt.doctorName}</span>
                        <span className="text-[11px] text-[#737373] block">{appt.specialty}</span>
                      </td>

                      {/* Date & Slot */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-[#000000] block">{appt.date}</span>
                        <span className="text-[11px] text-[#8D9B7B] font-mono font-bold block">{appt.timeSlot}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={appt.status} />
                      </td>

                      {/* Reach Out / Call Patient Button */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => toggleReachedOut(appt.id, appt.patientPhone)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isReachedOut
                              ? 'bg-[#EFF3EC] text-[#6C7A5B] border-[#BAC7AD]'
                              : 'bg-white text-[#000000] border-[#E5DFCD] hover:bg-[#F6F5EE]'
                          }`}
                        >
                          <Phone className="w-3 h-3 text-[#8D9B7B]" />
                          <span>{isReachedOut ? 'Contacted ✓' : 'Call Patient'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2">
                        {appt.status === 'pending' && (
                          <button
                            onClick={() => handleMarkConfirmed(appt.id)}
                            className="px-2.5 py-1 bg-[#8D9B7B] text-white rounded-md text-[11px] font-bold hover:bg-[#748263]"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status === 'confirmed' && (
                          <button
                            onClick={() => handleMarkCompleted(appt.id)}
                            className="px-2.5 py-1 bg-black text-white rounded-md text-[11px] font-bold hover:bg-neutral-800"
                          >
                            Complete
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button
                            onClick={() => setCancellingAppt(appt)}
                            className="px-2.5 py-1 bg-white border border-[#E5DFCD] text-[#737373] hover:text-red-600 rounded-md text-[11px] font-bold"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

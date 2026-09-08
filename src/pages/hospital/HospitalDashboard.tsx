import React, { useState, useEffect, useMemo } from 'react';
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
  BarChart3,
  FileSpreadsheet,
  Download,
  Search,
  UserCheck,
  ArrowRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';
import { doctorService } from '../../services/doctorService';
import { Appointment, Doctor } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';

export const HospitalDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // 4 Primary Navigation Tabs from Client PDF Page 8
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'patients' | 'reports'>('appointments');

  // Appointments filter by time from Client PDF Page 8: Today | Tomorrow | Specific Date
  const [appointmentDateFilter, setAppointmentDateFilter] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customFilterDate, setCustomFilterDate] = useState('2026-07-04');

  // Reports time criteria from Client PDF Page 8: Date | Week | Month
  const [reportCriteria, setReportCriteria] = useState<'date' | 'week' | 'month'>('month');

  // Data states
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [reachedOutIds, setReachedOutIds] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Quick hospital credentials display state
  const [hospitalEmail, setHospitalEmail] = useState('administration@cmc-dubai.ae');
  const [hospitalPassword, setHospitalPassword] = useState('••••••••••••');

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

  // Today & Tomorrow date strings
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Filtered and sorted appointments by time
  const appointmentsByTime = useMemo(() => {
    return [...appointments]
      .filter((a) => {
        if (appointmentDateFilter === 'today') {
          return a.date === todayStr || !a.date;
        }
        if (appointmentDateFilter === 'tomorrow') {
          return a.date === tomorrowStr;
        }
        if (appointmentDateFilter === 'custom') {
          return a.date === customFilterDate;
        }
        return true;
      })
      .sort((a, b) => {
        return (a.timeSlot || '').localeCompare(b.timeSlot || '');
      });
  }, [appointments, appointmentDateFilter, customFilterDate, todayStr, tomorrowStr]);

  // Patients list extracted from appointments
  const patientsList = useMemo(() => {
    const map = new Map<string, { patientName: string; patientPhone: string; patientEmail?: string; lastTime: string; lastDate: string; doctorName: string; status: string }>();
    appointments.forEach((appt) => {
      if (!map.has(appt.patientPhone)) {
        map.set(appt.patientPhone, {
          patientName: appt.patientName,
          patientPhone: appt.patientPhone,
          patientEmail: appt.patientEmail,
          lastTime: appt.timeSlot,
          lastDate: appt.date,
          doctorName: appt.doctorName,
          status: appt.status,
        });
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* ========================================================================= */}
      {/* TOP BAR: Hospital Credentials & Quick Info (Client PDF Page 8)           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-800 mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Hospital Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            CMC (Clemenceau Medical Center Hospital Dubai)
          </h1>
          <p className="text-xs text-slate-500">
            Dubai Healthcare City Phase 2 - Al Jaddaf • Outpatient Clinic Roster
          </p>
        </div>

        {/* Hospital Login Credentials Bar (Client PDF Page 8) + Sign Out */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
              <span className="font-semibold text-slate-800">{hospitalEmail}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Password</span>
              <span className="font-mono text-slate-600 tracking-wider">{hospitalPassword}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-[10px]">
              Active Session
            </span>
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              showToast('Signed out successfully.', 'info');
              navigate('/login');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 PRIMARY TABS: Appointments | Doctors | Patients | Reports (PDF Page 8)  */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'appointments' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {appointments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'doctors'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctors</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'doctors' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {doctors.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('patients')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'patients'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Patients</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'patients' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {patientsList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reports</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            MVP Access
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: APPOINTMENTS TAB (Filter Today / Tomorrow / Date -> By Time)      */}
      {/* ========================================================================= */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Display Appointments by Time
              </h2>
              <p className="text-xs text-slate-500">
                Consultation slots arranged chronologically by schedule time
              </p>
            </div>

            {/* Date Filter Pills (Client PDF Page 8: Today | Tomorrow | July-04-2026) */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAppointmentDateFilter('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  appointmentDateFilter === 'today'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => setAppointmentDateFilter('tomorrow')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  appointmentDateFilter === 'tomorrow'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tomorrow
              </button>

              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300">
                <input
                  type="date"
                  value={customFilterDate}
                  onChange={(e) => {
                    setCustomFilterDate(e.target.value);
                    setAppointmentDateFilter('custom');
                  }}
                  className={`text-xs font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    appointmentDateFilter === 'custom'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          {appointmentsByTime.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700">No appointments scheduled for this date.</p>
              <p>Try switching to &quot;Today&quot; or booking a test appointment on the booking page.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Time Slot</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Doctor & Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Patient Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {appointmentsByTime.map((appt) => {
                    const isReachedOut = reachedOutIds[appt.id];
                    return (
                      <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                        {/* Time slot */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                            {appt.timeSlot}
                          </span>
                        </td>

                        {/* Patient Name */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {appt.patientName}
                        </td>

                        {/* Doctor & Specialty */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">{appt.doctorName}</span>
                          <span className="text-[11px] text-slate-500 block">{appt.specialty}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={appt.status} />
                        </td>

                        {/* Reach out / Call */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => toggleReachedOut(appt.id, appt.patientPhone)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isReachedOut
                                ? 'bg-teal-50 text-teal-800 border-teal-300'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Phone className="w-3 h-3 text-teal-600" />
                            <span>{isReachedOut ? 'Contacted ✓' : appt.patientPhone}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {appt.status === 'pending' && (
                            <button
                              onClick={() => handleMarkConfirmed(appt.id)}
                              className="px-2.5 py-1 bg-teal-600 text-white rounded-md text-[11px] font-bold hover:bg-teal-700 cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status === 'confirmed' && (
                            <button
                              onClick={() => handleMarkCompleted(appt.id)}
                              className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[11px] font-bold hover:bg-slate-800 cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'cancelled' && (
                            <button
                              onClick={() => setCancellingAppt(appt)}
                              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 hover:text-red-600 rounded-md text-[11px] font-bold cursor-pointer"
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
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DOCTORS TAB (Display Dr Name and their appointments - PDF Page 8) */}
      {/* ========================================================================= */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Display Dr Name and their appointments
            </h2>
            <p className="text-xs text-slate-500">
              Physicians roster and their scheduled outpatient consultation slots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doc) => {
              const docAppts = appointments.filter((a) => a.doctorId === doc.id);
              return (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4 hover:border-teal-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 truncate">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h3>
                      <p className="text-xs font-semibold text-teal-700">{doc.specialty}</p>
                      <span className="text-[11px] text-slate-500">{doc.experience} • Rating {doc.rating} ★</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 shrink-0">
                      {docAppts.length} Bookings
                    </span>
                  </div>

                  {/* Sub-appointments list for this doctor */}
                  <div className="border-t border-slate-200 pt-3 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Scheduled Patient Slots:
                    </span>
                    {docAppts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No appointments booked yet for this doctor.</p>
                    ) : (
                      docAppts.map((a) => (
                        <div key={a.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 block">{a.patientName}</span>
                            <span className="text-[11px] text-slate-500">{a.date} • {a.patientPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                              {a.timeSlot}
                            </span>
                            <StatusBadge status={a.status} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: PATIENTS TAB (Display Patient Name and Time - PDF Page 8)         */}
      {/* ========================================================================= */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Display Patient Name and Time
            </h2>
            <p className="text-xs text-slate-500">
              Registered patient directory with consultation time details
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Scheduled Time</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {patientsList.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {pt.patientName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                        {pt.lastTime}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {pt.lastDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {pt.doctorName}
                    </td>
                    <td className="py-3.5 px-4 text-teal-700 font-medium">
                      {pt.patientPhone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {pt.patientEmail || 'Not provided'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: REPORTS TAB (Minimal Reports & Report Slot Mockup - PDF Page 8)   */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-8">
          
          {/* Header & Date Criteria Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Minimal Reports
              </h2>
              <p className="text-xs text-slate-500">
                Total Appointment, Appointment by Date, Week, Month
              </p>
            </div>

            {/* Criteria: Date | Week | Month */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['date', 'week', 'month'] as const).map((crit) => (
                <button
                  key={crit}
                  type="button"
                  onClick={() => setReportCriteria(crit)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    reportCriteria === crit
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  By {crit}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Appointments</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">{appointments.length}</span>
              <span className="text-[10px] text-teal-700 font-bold mt-1 block">100% In-Person</span>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <span className="text-[11px] font-bold uppercase text-teal-700 block">Confirmed</span>
              <span className="text-3xl font-black text-teal-700 mt-1 block">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Patient verified</span>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <span className="text-[11px] font-bold uppercase text-amber-700 block">Pending Call</span>
              <span className="text-3xl font-black text-amber-700 mt-1 block">
                {appointments.filter((a) => a.status === 'pending').length}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Awaiting intake</span>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Completed</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">
                {appointments.filter((a) => a.status === 'completed').length}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Finished visits</span>
            </div>
          </div>

          {/* MVP Report Slot Mockup Card (Client PDF Page 8 specification) */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-md border border-slate-700 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MVP Report Slot Active</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Executive Consultation & Department Analytics Report
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  In MVP – Show only report slot image – which should feel the clients, they have access.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Exporting CSV summary report...', 'info')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Generating official PDF hospital report...', 'info')}
                  className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            {/* Visual Report Slot Mockup Grid */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] text-teal-300 uppercase font-bold">Top Specialty Intake</span>
                <span className="text-sm font-bold text-white block">Cardiology Outpatient</span>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full w-3/4"></div>
                </div>
                <span className="text-[10px] text-slate-400">75% slot capacity utilized</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] text-teal-300 uppercase font-bold">Average Wait Time</span>
                <span className="text-sm font-bold text-white block">Under 8 Minutes</span>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full w-1/4"></div>
                </div>
                <span className="text-[10px] text-slate-400">Reception check-in to exam room</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <span className="text-[10px] text-teal-300 uppercase font-bold">Patient Satisfaction</span>
                <span className="text-sm font-bold text-white block">4.9 / 5.0 (DHA Survey)</span>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full w-[95%]"></div>
                </div>
                <span className="text-[10px] text-slate-400">Direct booking verified reviews</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
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

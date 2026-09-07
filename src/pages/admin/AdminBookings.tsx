import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Phone, Trash2 } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';
import { useToast } from '../../context/ToastContext';

export const AdminBookings: React.FC = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
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
  }, []);

  const handleCancelConfirm = async (reason: string) => {
    if (!cancellingAppt) return;
    try {
      await bookingService.cancelAppointment(
        cancellingAppt.id,
        reason,
        'admin',
        'System Administrator'
      );
      showToast('Appointment cancelled by Administrator.', 'info');
      setCancellingAppt(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  const filtered = appointments.filter((a) => {
    if (status !== 'all' && a.status !== status) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.facilityName.toLowerCase().includes(q) ||
        a.patientPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Platform Appointments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global register of every scheduled patient consultation across UAE facilities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold w-full sm:w-auto">
            {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  status === st
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking ID, patient..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Patient & Contact</th>
                <th className="px-5 py-3">Doctor & Specialty</th>
                <th className="px-5 py-3">Facility</th>
                <th className="px-5 py-3">Date & Slot</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 font-bold">
                    #{appt.id}
                  </td>
                  <td className="px-5 py-3.5 text-slate-900 font-medium">
                    <div className="font-bold">{appt.patientName}</div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-600" />
                      <span>{appt.patientPhone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-800">
                    <div className="font-semibold">{appt.doctorName}</div>
                    <div className="text-[11px] text-blue-600">{appt.specialty}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{appt.facilityName}</td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <div>{appt.date}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{appt.timeSlot}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {appt.status === 'confirmed' ? (
                      <button
                        onClick={() => setCancellingAppt(appt)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cancellingAppt && (
        <CancelModal
          appointment={cancellingAppt}
          onClose={() => setCancellingAppt(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

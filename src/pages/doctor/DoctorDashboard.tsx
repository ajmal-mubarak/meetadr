import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  FileText,
  User,
  AlertCircle,
  Check,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n';
import { bookingService } from '../../services/bookingService';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CancelModal } from '../../components/common/CancelModal';

export const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t, isRTL, isArabic } = useTranslation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // In mock mode, doctor sees appointments matching their name or all doctor appointments
      const all = await bookingService.getAllAppointments();
      setAppointments(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleMarkCompleted = async (id: string) => {
    try {
      await bookingService.completeAppointment(id);
      showToast(t('doctorPortal.completeSuccess'), 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || t('doctorPortal.failedUpdate'), 'error');
    }
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!cancellingAppt) return;
    try {
      await bookingService.cancelAppointment(
        cancellingAppt.id,
        reason,
        'doctor',
        user?.name || (isArabic ? 'د. طارق المنصور' : 'Dr. Tariq Al-Mansoor')
      );
      showToast(t('doctorPortal.cancelSlotReleased'), 'info');
      setCancellingAppt(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || t('doctorPortal.failedCancel'), 'error');
    }
  };

  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {t('doctorPortal.portalTitle')}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            {user?.name || (isArabic ? 'د. طارق المنصور' : 'Dr. Tariq Al-Mansoor')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('doctorPortal.departmentCardiology')}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('doctorPortal.activeClinicHours')}
          </span>
          <button
            type="button"
            onClick={async () => {
              await logout();
              showToast(isArabic ? 'تم تسجيل الخروج بنجاح.' : 'Signed out successfully.', 'info');
              navigate('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('doctorPortal.totalQueue')}
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{appointments.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{t('doctorPortal.allAppointments')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('doctorPortal.upcomingPending')}
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">{confirmed.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{t('doctorPortal.readyForConsultation')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('doctorPortal.completedVisits')}
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{completed.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{t('doctorPortal.finishedConsultations')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('doctorPortal.cancelled')}
          </span>
          <div className="text-3xl font-extrabold text-slate-600 mt-2">{cancelled.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">{t('doctorPortal.cancelledDesc')}</p>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t('doctorPortal.queueTitle')}</h3>
            <p className="text-xs text-slate-500">
              {t('doctorPortal.queueSubtitle')}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            {confirmed.length} {t('doctorPortal.pendingToday')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">{t('doctorPortal.patientName')}</th>
                <th className="px-5 py-3">{t('doctorPortal.dateSlot')}</th>
                <th className="px-5 py-3">{t('doctorPortal.contactPhone')}</th>
                <th className="px-5 py-3">{t('doctorPortal.symptomsNotes')}</th>
                <th className="px-5 py-3">{t('doctorPortal.status')}</th>
                <th className="px-5 py-3 text-right rtl:text-left">{t('doctorPortal.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {appt.patientName.charAt(0)}
                      </div>
                      <div>
                        <div>{appt.patientName}</div>
                        <div className="text-slate-400 text-[10px] font-mono">#{appt.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    <div className="font-medium">{appt.date}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{appt.timeSlot}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-800 font-mono">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span dir="ltr">{appt.patientPhone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                    {appt.notes || <span className="text-slate-400 italic">{t('doctorPortal.noNotes')}</span>}
                    {appt.cancelReason && (
                      <div className="text-rose-600 text-[10px] mt-0.5">
                        {t('doctorPortal.cancelled')}: {appt.cancelReason}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right rtl:text-left">
                    {appt.status === 'confirmed' ? (
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                        <button
                          onClick={() => handleMarkCompleted(appt.id)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Mark Consultation Complete"
                        >
                          <Check className="w-3 h-3" />
                          <span>{t('doctorPortal.completeBtn')}</span>
                        </button>
                        <button
                          onClick={() => setCancellingAppt(appt)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          title="Cancel Consultation"
                        >
                          {t('doctorPortal.cancelBtn')}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] capitalize">{appt.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Modal */}
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

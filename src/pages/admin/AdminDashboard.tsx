import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Sparkles,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  FileBarChart,
  ShieldCheck,
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { bookingService } from '../../services/bookingService';
import { providerService } from '../../services/providerService';
import { waitlistService } from '../../services/waitlistService';
import { Appointment, ProviderRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<Appointment[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ProviderRequest[]>([]);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [kpis, appts, requests, waitlist] = await Promise.all([
          reportService.getSystemOverview(),
          bookingService.getAllAppointments(),
          providerService.getAllRequests(),
          waitlistService.getWaitlist(),
        ]);
        setStats(kpis);
        setRecentBookings(appts.slice(0, 5));
        setPendingRequests(requests.filter((r) => r.status === 'pending'));
        setWaitlistCount(waitlist.length);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            System Administration
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">MeetAdr Control Console</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global healthcare ecosystem oversight, provider onboarding, and appointment registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileBarChart className="w-4 h-4" />
            <span>Operational Reports</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Doctors</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats ? stats.totalDoctors : '...'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Hospitals</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats ? stats.totalHospitals : '...'}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Accredited</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Clinics</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats ? stats.totalClinics : '...'}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Specialized</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Bookings</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {stats ? stats.totalBookings : '...'}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">All-time visits</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Waitlist</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{waitlistCount}</div>
          <span className="text-[10px] text-amber-700 font-medium">Subscribers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Join Requests</span>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">
            {pendingRequests.length}
          </div>
          <span className="text-[10px] text-purple-700 font-medium">Pending Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Global Bookings (Col 1 & 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Ecosystem Bookings</h3>
              <p className="text-xs text-slate-500">Live feed of scheduled patient consultations</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Date & Slot</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      <div>{appt.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{appt.patientPhone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-800">
                      <div>{appt.doctorName}</div>
                      <div className="text-[10px] text-slate-500">{appt.facilityName}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      <div>{appt.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{appt.timeSlot}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Provider Join Requests (Col 3) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Provider Applications</h3>
                <p className="text-xs text-slate-500">Inbound clinical onboarding</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                {pendingRequests.length} New
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending provider requests at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{req.name}</span>
                      <span className="capitalize text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                        {req.providerType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {req.location}, {req.country}
                    </p>
                    <p className="text-[11px] text-slate-600 font-mono">{req.contactNumber}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/admin/requests"
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Manage All Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

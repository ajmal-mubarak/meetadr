import React, { useState, useEffect } from 'react';
import { Building2, Phone, Mail, MapPin, Check, X, Clock } from 'lucide-react';
import { providerService } from '../../services/providerService';
import { ProviderRequest } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminRequests: React.FC = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await providerService.getAllRequests();
      setRequests(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await providerService.updateRequestStatus(id, newStatus);
      showToast(`Application marked as ${newStatus}.`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update request', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Provider Partnership Applications</h1>
        <p className="text-xs text-slate-500 mt-1">
          Inbound requests submitted through "Join as Provider". Review credentials and approve or reject.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Applicant Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Phone & Email</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{r.name}</td>
                  <td className="px-5 py-3.5 capitalize">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700">
                      {r.providerType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-800">
                    <div className="font-mono">{r.contactNumber}</div>
                    <div className="text-slate-400 text-[11px]">{r.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {r.location}, {r.country}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        r.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {r.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'approved')}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'rejected')}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] capitalize">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

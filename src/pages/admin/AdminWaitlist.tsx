import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Mail, User, Calendar } from 'lucide-react';
import { waitlistService } from '../../services/waitlistService';
import { WaitlistEntry } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminWaitlist: React.FC = () => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await waitlistService.getWaitlist();
        setEntries(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleExportCSV = () => {
    const headers = 'ID,Email,Name,Created At\n';
    const rows = entries
      .map((e) => `"${e.id}","${e.email}","${e.name || ''}","${e.createdAt}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meetadr-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Waitlist CSV exported successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Waitlist Registry</h1>
          <p className="text-xs text-slate-500 mt-1">
            Subscribed users requesting priority early access and health screening alerts.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Total Waitlist Subscribers: {entries.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Signed Up At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-semibold text-blue-700 font-mono">
                    {item.email}
                  </td>
                  <td className="px-5 py-3.5 text-slate-900">
                    {item.name || <span className="text-slate-400 italic">Not provided</span>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
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

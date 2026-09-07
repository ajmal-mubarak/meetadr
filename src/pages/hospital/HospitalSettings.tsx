import React, { useState } from 'react';
import { Building2, MapPin, Phone, Clock, Save, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HospitalSettings: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('City Care Specialty Hospital');
  const [address, setAddress] = useState('Building 42, Dubai Healthcare City, Dubai, UAE');
  const [phone, setPhone] = useState('+971 4 362 4700');
  const [operatingHours, setOperatingHours] = useState('Mon - Sat: 08:00 - 21:00');
  const [emergency, setEmergency] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Facility settings saved successfully.', 'success');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Facility Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Public profile, emergency status, and facility operational contacts.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Hours</label>
            <input
              type="text"
              required
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <strong className="text-xs font-bold text-slate-900 block">24/7 Emergency Department</strong>
            <span className="text-[11px] text-slate-500">
              Display emergency badge on public listings and search results.
            </span>
          </div>
          <input
            type="checkbox"
            checked={emergency}
            onChange={(e) => setEmergency(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 border-slate-300"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

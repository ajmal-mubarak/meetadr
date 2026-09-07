import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Star, MapPin, Search, ShieldCheck } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { clinicService } from '../../services/clinicService';
import { Hospital, Clinic } from '../../types';

export const AdminProviders: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [type, setType] = useState<'all' | 'hospital' | 'clinic'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const [h, c] = await Promise.all([
        hospitalService.getAllHospitals(),
        clinicService.getAllClinics(),
      ]);
      setHospitals(h);
      setClinics(c);
    }
    load();
  }, []);

  const allProviders = [
    ...hospitals.map((h) => ({ ...h, providerCategory: 'Hospital' as const })),
    ...clinics.map((c) => ({ ...c, providerCategory: 'Clinic' as const })),
  ];

  const filtered = allProviders.filter((p) => {
    if (type !== 'all' && p.providerCategory.toLowerCase() !== type) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospitals & Clinics Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered medical institutions, licensing verifications, and doctor rosters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            {(['all', 'hospital', 'clinic'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  type === t
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All' : `${t}s`}
              </button>
            ))}
          </div>

          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search facility..."
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
                <th className="px-5 py-3">Facility Name</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Verification</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        item.providerCategory === 'Hospital'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.providerCategory}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{item.location}</td>
                  <td className="px-5 py-3.5 text-slate-700 font-mono">{item.phone}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-bold">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={
                        item.providerCategory === 'Hospital'
                          ? `/hospitals/${item.id}`
                          : `/clinics/${item.id}`
                      }
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Details
                    </Link>
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

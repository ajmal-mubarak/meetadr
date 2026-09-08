import React, { useState } from 'react';
import { User, Mail, Phone, Heart, Save, Plus, Trash2, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Dependent {
  id: string;
  name: string;
  relation: string;
  dob: string;
  bloodGroup: string;
}

export const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Personal info
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'patient@meetadr.demo');
  const [phone, setPhone] = useState(user?.phone || '+971 52 412 2794');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('+971 55 987 6543 (Spouse)');
  const [allergies, setAllergies] = useState('Penicillin (Mild)');
  const [insuranceProvider, setInsuranceProvider] = useState('Daman — National Health Insurance Company');
  const [insuranceNumber, setInsuranceNumber] = useState('DAM-9482-UAE-2024');

  // Dependents (PDF: "Profile & Dependents")
  const [dependents, setDependents] = useState<Dependent[]>([
    { id: 'd1', name: 'James Jenkins', relation: 'Spouse', dob: '1985-06-12', bloodGroup: 'A+' },
    { id: 'd2', name: 'Lily Jenkins', relation: 'Child', dob: '2015-03-20', bloodGroup: 'O+' },
  ]);
  const [showAddDependent, setShowAddDependent] = useState(false);
  const [newDep, setNewDep] = useState<Omit<Dependent, 'id'>>({ name: '', relation: 'Spouse', dob: '', bloodGroup: 'O+' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Patient health profile updated successfully.', 'success');
  };

  const handleAddDependent = () => {
    if (!newDep.name.trim() || !newDep.dob) {
      showToast('Please enter dependent name and date of birth.', 'error');
      return;
    }
    setDependents((prev) => [...prev, { ...newDep, id: `d${Date.now()}` }]);
    setNewDep({ name: '', relation: 'Spouse', dob: '', bloodGroup: 'O+' });
    setShowAddDependent(false);
    showToast(`${newDep.name} added as a dependent.`, 'success');
  };

  const handleRemoveDependent = (id: string) => {
    const dep = dependents.find((d) => d.id === id);
    setDependents((prev) => prev.filter((d) => d.id !== id));
    showToast(`${dep?.name} removed from dependents.`, 'info');
  };

  return (
    <div className="max-w-3xl space-y-6">

      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Patient Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, insurance information, dependents, and emergency medical summary.
        </p>
      </div>

      {/* ── PERSONAL & CONTACT ── */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-4">Personal & Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Mobile <span className="text-slate-400 font-normal">(used for hospital SMS & confirmation)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── INSURANCE ── */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-4">Insurance Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Insurance Provider</label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Policy / Card Number</label>
              <input
                type="text"
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* ── EMERGENCY HEALTH SUMMARY ── */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-4">Emergency Health Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Emergency Contact</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Known Allergies / Medical Notes</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </form>

      {/* ── DEPENDENTS / FAMILY (PDF: "Profile & Dependents") ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Users className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Dependents & Family Members</h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Book appointments for your family members using your account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddDependent((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Dependent
          </button>
        </div>

        {/* Add Dependent Form */}
        {showAddDependent && (
          <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-teal-700">New Dependent Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newDep.name}
                  onChange={(e) => setNewDep((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Ahmed Al-Mansoor"
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relationship</label>
                <select
                  value={newDep.relation}
                  onChange={(e) => setNewDep((p) => ({ ...p, relation: e.target.value }))}
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none transition-all"
                >
                  {['Spouse', 'Child', 'Parent', 'Sibling', 'Other'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={newDep.dob}
                  onChange={(e) => setNewDep((p) => ({ ...p, dob: e.target.value }))}
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Blood Group</label>
                <select
                  value={newDep.bloodGroup}
                  onChange={(e) => setNewDep((p) => ({ ...p, bloodGroup: e.target.value }))}
                  className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none transition-all"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddDependent(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDependent}
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Add Member
              </button>
            </div>
          </div>
        )}

        {/* Dependents List */}
        {dependents.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No dependents added yet. Add family members to book on their behalf.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dependents.map((dep) => (
              <div
                key={dep.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{dep.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {dep.relation} · DOB: {dep.dob} · Blood: {dep.bloodGroup}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Select a doctor and choose this dependent at booking.', 'info')}
                    className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    Book for them
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveDependent(dep.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>Dependent booking management will be fully functional once the backend is connected. Currently displayed for client demonstration.</span>
        </div>
      </div>
    </div>
  );
};

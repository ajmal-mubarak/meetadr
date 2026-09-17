import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Plus,
  Star,
  MapPin,
  Calendar,
  Clock,
  X,
  Check,
  Award,
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { Doctor } from '../../types';
import { SPECIALTIES } from '../../data/mockSpecialties';
import { useToast } from '../../context/ToastContext';

export const HospitalDoctors: React.FC = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form fields
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [experience, setExperience] = useState('8 years');
  const [education, setEducation] = useState('MD - Internal Medicine, Board Certified');
  const [about, setAbout] = useState('');
  const [photo, setPhoto] = useState(
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter the doctor name.', 'error');
      return;
    }

    try {
      await doctorService.createDoctor({
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        specialty,
        experience,
        education,
        about:
          about ||
          `${name} is a board-certified specialist dedicated to compassionate and evidence-based patient care.`,
        photo,
        hospitalId: 'hosp-1',
        hospitalName: 'City Care Specialty Hospital',
        location: 'Dubai Healthcare City',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        availableSlots: [
          '09:00 - 09:30',
          '09:30 - 10:00',
          '10:00 - 10:30',
          '11:00 - 11:30',
          '14:00 - 14:30',
          '15:00 - 15:30',
        ],
      });

      showToast(`Dr. ${name} added to hospital roster successfully.`, 'success');
      setShowAddModal(false);
      setName('');
      setAbout('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add doctor', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Medical Staff</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage practicing specialists, clinical affiliations, and appointment schedules.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-teal-700 block">
                    {doc.specialty}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 truncate">{doc.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-teal-700" />
                    <span>{doc.experience} exp.</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {doc.about}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{doc.availableDays.length} Active Days</span>
              <span className="font-semibold text-teal-700">{doc.availableSlots.length} Slots/Day</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Doctor to Roster</h3>
                <p className="text-xs text-slate-500">
                  Register a specialist with consultation credentials and availability.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Doctor Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Hessa Al-Ketbi"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specialty <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-600 focus:outline-none"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 10 years"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Education & Credentials
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Photo URL (Avatar)
                  </label>
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-600 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Biography
                  </label>
                  <textarea
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Brief background and clinical focus..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-600 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

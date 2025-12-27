
import React, { useState, useEffect } from 'react';
import { PatientProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: PatientProfile) => void;
  initialProfile: PatientProfile;
}

const ProfileModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialProfile }) => {
  const [profile, setProfile] = useState<PatientProfile>(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!profile.name.trim()) {
      alert("Please enter a name.");
      return;
    }
    onSave(profile);
    onClose();
  };

  const calculateAge = (dob: string) => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setProfile(prev => ({ ...prev, age }));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-user-circle text-blue-600"></i>
            Patient Profile
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input 
              type="text"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder="e.g. Alex Johnson"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input 
                type="date"
                value={profile.dob}
                onChange={e => {
                  setProfile({...profile, dob: e.target.value});
                  calculateAge(e.target.value);
                }}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Age</label>
              <input 
                type="number"
                value={profile.age || ''}
                onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                placeholder="Years"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Diagnosis</label>
            <input 
              type="text"
              value={profile.diagnosis}
              onChange={e => setProfile({...profile, diagnosis: e.target.value})}
              placeholder="e.g. Papillary Thyroid Carcinoma"
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Diagnosis Date</label>
              <input 
                type="date"
                value={profile.diagnosisDate}
                onChange={e => setProfile({...profile, diagnosisDate: e.target.value})}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Staging (Optional)</label>
              <input 
                type="text"
                value={profile.stage}
                onChange={e => setProfile({...profile, stage: e.target.value})}
                placeholder="e.g. pT2 N1a M0"
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center gap-4 bg-slate-50">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

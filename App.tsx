import React, { useState, useEffect } from 'react';
import { MedicalRecord, RecordType, PatientProfile } from './types';
import { MOCK_RECORDS } from './constants';
import TimelineItem from './components/TimelineItem';
import LabTable from './components/LabTable';
import LabCharts from './components/LabCharts';
import MedicalRecordModal from './components/MedicalRecordModal';
import ProfileModal from './components/ProfileModal';

const DEFAULT_PROFILE: PatientProfile = {
  name: "New Patient",
  dob: "",
  age: 0,
  diagnosis: "Thyroid Condition",
  diagnosisDate: new Date().toISOString().split('T')[0],
  stage: ""
};

const App: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('thyrotrack_records');
      return saved ? JSON.parse(saved) : MOCK_RECORDS;
    } catch (e) {
      return MOCK_RECORDS;
    }
  });
  
  const [profile, setProfile] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem('thyrotrack_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  });

  const [activeTab, setActiveTab] = useState<'timeline' | 'labs'>('timeline');
  const [filterMode, setFilterMode] = useState<'all' | 'milestones'>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | undefined>(undefined);

  // Persistence
  useEffect(() => {
    localStorage.setItem('thyrotrack_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('thyrotrack_profile', JSON.stringify(profile));
  }, [profile]);

  const handleSaveRecord = (newRecord: MedicalRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === newRecord.id);
      if (exists) {
        return prev.map(r => r.id === newRecord.id ? newRecord : r);
      }
      return [...prev, newRecord];
    });
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const majorEventsCount = records.filter(r => r.isMajorEvent).length;
  const latestTg = records
    .filter(r => r.type === RecordType.BLOOD_TEST)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    ?.results?.find(res => res.marker === 'Thyroglobulin')?.value;

  const displayRecords = filterMode === 'milestones' 
    ? records.filter(r => r.isMajorEvent)
    : records;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-notes-medical text-white"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ThyroTrack</h1>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors md:px-4 md:py-2 md:text-sm"
             >
                <i className="fas fa-plus"></i> <span className="hidden sm:inline">Add Record</span>
             </button>
             <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
             <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 transition-colors group"
             >
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-white">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt="avatar" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">{profile.name}</span>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Quick Stats Banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => {
              setActiveTab('timeline');
              setFilterMode('milestones');
            }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all hover:border-blue-200 text-left group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${filterMode === 'milestones' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
              <i className="fas fa-star text-xl"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Milestones</div>
              <div className="text-2xl font-bold text-gray-900">{majorEventsCount} Major Events</div>
            </div>
          </button>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <i className="fas fa-vial text-xl"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Latest Tg Marker</div>
              <div className="text-2xl font-bold text-gray-900">{latestTg ?? 'N/A'} <span className="text-xs font-normal text-gray-400">ng/mL</span></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1 cursor-pointer group" onClick={() => setIsProfileModalOpen(true)}>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
              <i className="fas fa-dna text-xl"></i>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Diagnosis & Age</div>
              <div className="text-lg font-bold text-gray-900">{profile.age ? `${profile.age}y • ` : ''}{profile.stage || profile.diagnosis}</div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8 w-fit overflow-x-auto max-w-full">
          <button 
            onClick={() => {
              setActiveTab('timeline');
              setFilterMode('all');
            }}
            className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all flex-shrink-0 ${activeTab === 'timeline' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-blue-600'}`}
          >
            <i className="fas fa-stream mr-2"></i> Timeline
          </button>
          <button 
             onClick={() => setActiveTab('labs')}
            className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all flex-shrink-0 ${activeTab === 'labs' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-blue-600'}`}
          >
            <i className="fas fa-list-ul mr-2"></i> Lab Comparison
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filterMode === 'milestones' ? 'Major Milestones' : 'Medical Journey'}
                  </h2>
                  <p className="text-gray-500">
                    {filterMode === 'milestones' 
                      ? 'Displaying only your key medical events and surgeries' 
                      : 'A chronological record of tests and procedures'}
                  </p>
                </div>
                {filterMode === 'milestones' && (
                  <button 
                    onClick={() => setFilterMode('all')}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Show All Records
                  </button>
                )}
              </div>
              
              <div className="max-w-3xl mx-auto">
                {displayRecords.length > 0 ? (
                  displayRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record, index) => (
                    <TimelineItem 
                      key={record.id} 
                      record={record} 
                      isLast={index === displayRecords.length - 1} 
                      onEdit={() => handleEditRecord(record)}
                      onDelete={() => handleDeleteRecord(record.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-gray-200">
                    <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 font-medium">No records found matching your selection.</p>
                    <button onClick={handleAddNew} className="text-blue-600 font-bold text-sm mt-2 hover:underline">Add your first record</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-8">
              <LabCharts records={records} />
              <LabTable 
                records={records} 
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            </div>
          )}
        </div>
      </main>

      <MedicalRecordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        initialRecord={editingRecord}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={(newProfile) => setProfile(newProfile)}
        initialProfile={profile}
      />

      <footer className="bg-white border-t border-gray-200 py-8 mt-12 print:hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <i className="fas fa-shield-halved text-blue-600"></i>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Local-Only Secure Storage</span>
          </div>
          <p className="text-sm text-gray-500">&copy; 2025 ThyroTrack Medical History Management. All data stored locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
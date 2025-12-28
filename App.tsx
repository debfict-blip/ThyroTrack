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
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [profile, setProfile] = useState<PatientProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'labs'>('timeline');
  const [filterMode, setFilterMode] = useState<'all' | 'milestones'>('all');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | undefined>(undefined);

  // Initialize data strictly once
  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem('thyrotrack_records_v1');
      const savedProfile = localStorage.getItem('thyrotrack_profile_v1');
      
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      } else {
        setRecords(MOCK_RECORDS);
      }

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error("Local storage initialization failed", e);
      setRecords(MOCK_RECORDS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save updates
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('thyrotrack_records_v1', JSON.stringify(records));
      localStorage.setItem('thyrotrack_profile_v1', JSON.stringify(profile));
    }
  }, [records, profile, isLoaded]);

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
    if (window.confirm("Delete this record permanently?")) {
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
  
  // Find latest Tg safely
  const bloodTests = records.filter(r => r.type === RecordType.BLOOD_TEST);
  const sortedTests = [...bloodTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestTg = sortedTests[0]?.results?.find(res => res.marker === 'Thyroglobulin')?.value;

  const displayRecords = filterMode === 'milestones' 
    ? records.filter(r => r.isMajorEvent)
    : records;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Medical History...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col safe-top safe-bottom">
      {/* App Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <i className="fas fa-notes-medical text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ThyroTrack</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
             <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-100"
             >
                <i className="fas fa-plus"></i> <span className="hidden sm:inline">Add Record</span>
             </button>
             <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
             >
                <img className="w-7 h-7 rounded-full" src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} alt="avatar" />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Profile Card / Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div 
            onClick={() => { setActiveTab('timeline'); setFilterMode('milestones'); }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${filterMode === 'milestones' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-slate-900 hover:border-blue-200'}`}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Milestones</div>
            <div className="text-2xl font-black">{majorEventsCount}</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100 text-slate-900">
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Latest Tg</div>
            <div className="text-2xl font-black text-blue-600">{latestTg ?? '—'}<span className="text-[10px] font-normal text-slate-400 ml-1">ng/mL</span></div>
          </div>
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="p-4 bg-white rounded-2xl border border-gray-100 text-slate-900 cursor-pointer hover:border-blue-200 col-span-2 lg:col-span-1"
          >
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Diagnosis</div>
            <div className="text-sm font-bold truncate">{profile.stage || profile.diagnosis}</div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-6 w-full max-w-xs mx-auto md:mx-0">
          <button 
            onClick={() => { setActiveTab('timeline'); setFilterMode('all'); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider tab-transition ${activeTab === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Timeline
          </button>
          <button 
             onClick={() => setActiveTab('labs')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider tab-transition ${activeTab === 'labs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Labs
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900">
                  {filterMode === 'milestones' ? 'Key Milestones' : 'Medical Journey'}
                </h2>
                {filterMode === 'milestones' && (
                  <button onClick={() => setFilterMode('all')} className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    Show All
                  </button>
                )}
              </div>
              
              <div className="max-w-2xl">
                {displayRecords.length > 0 ? (
                  [...displayRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record, index) => (
                    <TimelineItem 
                      key={record.id} 
                      record={record} 
                      isLast={index === displayRecords.length - 1} 
                      onEdit={() => handleEditRecord(record)}
                      onDelete={() => handleDeleteRecord(record.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <i className="fas fa-folder-open text-slate-300"></i>
                    </div>
                    <p className="text-slate-400 font-medium text-sm">No records found.</p>
                    <button onClick={handleAddNew} className="text-blue-600 font-bold text-xs mt-3 uppercase tracking-widest">Add your first record</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-6">
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

      <footer className="py-10 text-center opacity-30 select-none">
        <div className="flex items-center justify-center gap-2 mb-2">
          <i className="fas fa-lock text-[10px]"></i>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Offline Secured</span>
        </div>
        <p className="text-[10px] font-medium">Data stored locally on your device.</p>
      </footer>
    </div>
  );
};

export default App;
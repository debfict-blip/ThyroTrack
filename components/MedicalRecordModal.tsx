
import React, { useState, useEffect } from 'react';
import { MedicalRecord, RecordType, LabResult } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MedicalRecord) => void;
  initialRecord?: MedicalRecord;
}

const MedicalRecordModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialRecord }) => {
  const [record, setRecord] = useState<Partial<MedicalRecord>>({
    type: RecordType.BLOOD_TEST,
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    results: []
  });

  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord);
    } else {
      setRecord({
        type: RecordType.BLOOD_TEST,
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        results: []
      });
    }
  }, [initialRecord, isOpen]);

  if (!isOpen) return null;

  const handleAddResult = () => {
    setRecord(prev => ({
      ...prev,
      results: [...(prev.results || []), { marker: '', value: 0, unit: '' }]
    }));
  };

  const handleRemoveResult = (index: number) => {
    setRecord(prev => ({
      ...prev,
      results: prev.results?.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateResult = (index: number, field: keyof LabResult, value: string | number) => {
    const newResults = [...(record.results || [])];
    newResults[index] = { ...newResults[index], [field]: value };
    setRecord(prev => ({ ...prev, results: newResults }));
  };

  const handleSave = () => {
    if (!record.title || !record.date) {
      alert("Please enter a title and date.");
      return;
    }
    onSave({
      ...record,
      id: record.id || Math.random().toString(36).substr(2, 9),
    } as MedicalRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-gray-900">
            {initialRecord ? 'Edit Medical Record' : 'Add New Record'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Record Type</label>
              <select 
                value={record.type}
                onChange={e => setRecord({...record, type: e.target.value as RecordType})}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              >
                {Object.values(RecordType).map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
              <input 
                type="date"
                value={record.date}
                onChange={e => setRecord({...record, date: e.target.value})}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
            <input 
              type="text"
              placeholder="e.g., Blood Panel, Neck Ultrasound"
              value={record.title}
              onChange={e => setRecord({...record, title: e.target.value})}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description / Notes</label>
            <textarea 
              rows={3}
              placeholder="Any specific notes or clinical observations..."
              value={record.description}
              onChange={e => setRecord({...record, description: e.target.value})}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="isMajor"
              checked={record.isMajorEvent}
              onChange={e => setRecord({...record, isMajorEvent: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isMajor" className="text-sm font-medium text-gray-700">Mark as Major Milestone</label>
          </div>

          {record.type === RecordType.BLOOD_TEST && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <i className="fas fa-flask text-blue-500"></i>
                  Lab Results
                </h3>
                <button 
                  onClick={handleAddResult}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <i className="fas fa-plus mr-1"></i> Add Marker
                </button>
              </div>

              {record.results && record.results.length > 0 ? (
                <div className="space-y-3">
                  {record.results.map((res, index) => (
                    <div key={index} className="flex flex-wrap sm:flex-nowrap items-end gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Marker</label>
                        <input 
                          list="common-markers"
                          value={res.marker}
                          onChange={e => handleUpdateResult(index, 'marker', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="TSH, Tg..."
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Value</label>
                        <input 
                          type="number"
                          step="0.01"
                          value={res.value}
                          onChange={e => handleUpdateResult(index, 'value', parseFloat(e.target.value))}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-20">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unit</label>
                        <input 
                          value={res.unit}
                          onChange={e => handleUpdateResult(index, 'unit', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="ng/mL"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveResult(index)}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  ))}
                  <datalist id="common-markers">
                    <option value="TSH" />
                    <option value="Thyroglobulin" />
                    <option value="TgAb" />
                    <option value="Free T4" />
                    <option value="Calcium" />
                    <option value="PTH" />
                    <option value="Calcitonin" />
                    <option value="Vitamin D" />
                  </datalist>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm italic">
                  No lab markers added yet.
                </div>
              )}
            </div>
          )}

          {record.type === RecordType.IMAGING && (
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Imaging Findings</label>
              <textarea 
                rows={3}
                placeholder="Paste key findings from the radiology report..."
                value={record.imagingFindings}
                onChange={e => setRecord({...record, imagingFindings: e.target.value})}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          )}
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
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;

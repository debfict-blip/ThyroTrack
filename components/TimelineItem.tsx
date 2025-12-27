
import React from 'react';
import { MedicalRecord, RecordType } from '../types';

interface Props {
  record: MedicalRecord;
  isLast: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TimelineItem: React.FC<Props> = ({ record, isLast, onEdit, onDelete }) => {
  const getIcon = (type: RecordType) => {
    switch (type) {
      case RecordType.BLOOD_TEST: return 'fa-flask text-blue-500';
      case RecordType.IMAGING: return 'fa-x-ray text-purple-500';
      case RecordType.SURGERY: return 'fa-scalpel text-red-500';
      case RecordType.PATHOLOGY: return 'fa-microscope text-green-500';
      case RecordType.APPOINTMENT: return 'fa-calendar-check text-orange-500';
      default: return 'fa-file-medical text-gray-500';
    }
  };

  const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex relative pb-8 group">
      {!isLast && (
        <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-200 transition-colors" />
      )}
      
      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-white flex-shrink-0 ${record.isMajorEvent ? 'border-blue-600 scale-110' : 'border-gray-200'}`}>
        <i className={`fas ${getIcon(record.type)} text-lg`}></i>
      </div>

      <div className="ml-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-1 gap-2">
          <div>
            <h3 className={`text-lg font-bold leading-tight ${record.isMajorEvent ? 'text-blue-700' : 'text-gray-900'}`}>
              {record.title}
              {record.isMajorEvent && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium inline-block align-middle">Major Event</span>
              )}
            </h3>
            <span className="text-sm font-medium text-gray-400">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit record"
            >
              <i className="fas fa-edit text-xs"></i>
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-all"
              title="Delete record"
            >
              <i className="fas fa-trash-alt text-xs"></i>
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3 text-sm">{record.description}</p>

        {record.results && record.results.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-2">
            <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-3">Lab Values</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {record.results.map((res, i) => (
                <div key={i} className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-sm transition-transform hover:scale-[1.02]">
                  <div className="text-[10px] text-gray-400 font-bold uppercase truncate">{res.marker}</div>
                  <div className="text-sm font-black text-gray-800">{res.value} <span className="text-[10px] font-medium text-gray-400">{res.unit}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {record.imagingFindings && (
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
             <h4 className="text-[10px] font-bold text-purple-800 uppercase tracking-widest mb-2">Imaging Report Highlights</h4>
             <p className="text-sm text-purple-900 italic font-medium">"{record.imagingFindings}"</p>
          </div>
        )}

        {record.pathologyStaging && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
             <h4 className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-1">Pathology Staging</h4>
             <p className="text-sm font-bold text-green-900">{record.pathologyStaging}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;


import React, { useMemo, useState } from 'react';
import { MedicalRecord, RecordType } from '../types';

interface Props {
  records: MedicalRecord[];
  onEditRecord?: (record: MedicalRecord) => void;
  onDeleteRecord?: (id: string) => void;
}

const LabTable: React.FC<Props> = ({ records, onEditRecord, onDeleteRecord }) => {
  // Extract all unique markers from the records
  const allAvailableMarkers = useMemo(() => {
    const markers = new Set<string>();
    records.forEach(r => {
      if (r.type === RecordType.BLOOD_TEST) {
        r.results?.forEach(res => markers.add(res.marker));
      }
    });
    return Array.from(markers).sort();
  }, [records]);

  // Default to showing common markers if they exist
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>(
    allAvailableMarkers.filter(m => ['TSH', 'Thyroglobulin', 'Free T4'].includes(m)).length > 0
    ? allAvailableMarkers.filter(m => ['TSH', 'Thyroglobulin', 'Free T4'].includes(m))
    : allAvailableMarkers.slice(0, 3)
  );

  const toggleMarker = (marker: string) => {
    setSelectedMarkers(prev => 
      prev.includes(marker) 
        ? prev.filter(m => m !== marker) 
        : [...prev, marker]
    );
  };

  // Group and sort records by date
  const tableData = useMemo(() => {
    const bloodTests = records
      .filter(r => r.type === RecordType.BLOOD_TEST)
      .map(r => {
        const rowData: Record<string, any> = {
          id: r.id,
          date: r.date,
          title: r.title,
          fullRecord: r, // Keep a reference for editing
        };
        r.results?.forEach(res => {
          rowData[res.marker] = {
            value: res.value,
            unit: res.unit
          };
        });
        return rowData;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return bloodTests;
  }, [records]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Lab Result Comparison</h2>
            <p className="text-sm text-gray-500">Select markers to add or remove columns from the table</p>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={() => window.print()} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
             >
               <i className="fas fa-print"></i> Export
             </button>
          </div>
        </div>

        {/* Marker Selector Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allAvailableMarkers.map(marker => (
            <button
              key={marker}
              onClick={() => toggleMarker(marker)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                selectedMarkers.includes(marker)
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {selectedMarkers.includes(marker) ? (
                <i className="fas fa-check-circle text-blue-500"></i>
              ) : (
                <i className="fas fa-plus-circle text-gray-300"></i>
              )}
              {marker}
            </button>
          ))}
          {allAvailableMarkers.length === 0 && (
            <div className="text-sm text-gray-400 italic py-2">No blood test markers found in your records.</div>
          )}
        </div>

        {/* The Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-20">Date</th>
                {selectedMarkers.map(marker => (
                  <th key={marker} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {marker}
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{row.title}</span>
                      </div>
                    </td>
                    {selectedMarkers.map(marker => (
                      <td key={marker} className="px-6 py-4 whitespace-nowrap">
                        {row[marker] ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-blue-600">{row[marker].value}</span>
                            <span className="text-[10px] text-gray-400">{row[marker].unit}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right print:hidden">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                          onClick={() => onEditRecord?.(row.fullRecord)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit row"
                         >
                           <i className="fas fa-edit text-xs"></i>
                         </button>
                         <button 
                          onClick={() => onDeleteRecord?.(row.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete row"
                         >
                           <i className="fas fa-trash-alt text-xs"></i>
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedMarkers.length + 2} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-vial-circle-check text-4xl mb-3 opacity-20"></i>
                      <p>No lab records found to display.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {selectedMarkers.length === 0 && allAvailableMarkers.length > 0 && (
          <div className="mt-6 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">Please select at least one biomarker to display the comparison table.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabTable;

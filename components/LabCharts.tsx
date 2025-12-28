import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MedicalRecord, RecordType } from '../types';

interface Props {
  records: MedicalRecord[];
}

const LabCharts: React.FC<Props> = ({ records }) => {
  const [selectedMarker, setSelectedMarker] = useState<string>('Thyroglobulin');

  const chartData = useMemo(() => {
    return records
      .filter(r => r.type === RecordType.BLOOD_TEST && r.results?.some(res => res.marker === selectedMarker))
      .map(r => ({
        date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        rawDate: new Date(r.date).getTime(),
        value: r.results?.find(res => res.marker === selectedMarker)?.value
      }))
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [records, selectedMarker]);

  const markers = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.type === RecordType.BLOOD_TEST) {
        r.results?.forEach(res => set.add(res.marker));
      }
    });
    return Array.from(set).sort();
  }, [records]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lab Trends</h2>
          <p className="text-sm text-gray-500">Track your blood work markers over time</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {markers.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMarker(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedMarker === m 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                animationDuration={1000}
                name={selectedMarker}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <i className="fas fa-chart-line text-4xl mb-2 opacity-20"></i>
            <p className="text-sm">Need at least one record with "{selectedMarker}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabCharts;
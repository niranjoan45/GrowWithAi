import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart2, TrendingUp, DownloadCloud } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const { childrenData } = useAppData();
  const [selectedChildId, setSelectedChildId] = useState(childrenData[0]?.id);

  const activeChild = childrenData.find(c => c.id === selectedChildId);

  // Mock data for charts
  const monthlyProgress = [
    { month: 'Jan', progress: 20 },
    { month: 'Feb', progress: 35 },
    { month: 'Mar', progress: 50 },
    { month: 'Apr', progress: activeChild?.progress || 0 },
  ];

  const categoryStats = activeChild ? [
    { name: 'Physical', completed: activeChild.milestones.filter(m => m.category === 'Physical' && m.completed).length, total: activeChild.milestones.filter(m => m.category === 'Physical').length },
    { name: 'Language', completed: activeChild.milestones.filter(m => m.category === 'Language' && m.completed).length, total: activeChild.milestones.filter(m => m.category === 'Language').length },
    { name: 'Social', completed: activeChild.milestones.filter(m => m.category === 'Social' && m.completed).length, total: activeChild.milestones.filter(m => m.category === 'Social').length },
    { name: 'Cognitive', completed: activeChild.milestones.filter(m => m.category === 'Cognitive' && m.completed).length, total: activeChild.milestones.filter(m => m.category === 'Cognitive').length },
  ] : [];

  if (!activeChild) {
    return <div className="p-4 max-w-4xl mx-auto">Please add a child profile to view reports.</div>;
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 size={28} className="text-primary" />
          <h1 className="text-2xl font-bold m-0">Progress Reports</h1>
        </div>
        
        <div className="flex gap-4">
          <select 
            className="card p-2 border border-gray-200 shadow-sm"
            value={selectedChildId} 
            onChange={(e) => setSelectedChildId(Number(e.target.value))}
            style={{ width: 'auto' }}
          >
            {childrenData.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <button className="btn btn-outline flex items-center gap-2">
            <DownloadCloud size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md-grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Overall Progress</h3>
          <div className="text-3xl font-bold text-primary">{activeChild.progress}%</div>
          <div className="text-xs text-secondary mt-2 flex items-center justify-center gap-1">
            <TrendingUp size={14} /> +15% this month
          </div>
        </div>
        <div className="card text-center">
          <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Milestones Met</h3>
          <div className="text-3xl font-bold">{activeChild.milestones.filter(m => m.completed).length}</div>
          <div className="text-xs text-muted mt-2">out of {activeChild.milestones.length} total</div>
        </div>
        <div className="card text-center">
          <h3 className="text-sm text-muted uppercase tracking-wider mb-2">Current Status</h3>
          <div className={`text-xl font-bold mt-2 ${activeChild.status === 'Normal' ? 'text-secondary' : 'text-warning'}`}>
            {activeChild.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Growth Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgress} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="progress" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-6">Category Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="completed" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

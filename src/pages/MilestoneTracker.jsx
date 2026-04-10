import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { CheckCircle2, Circle } from 'lucide-react';
import './MilestoneTracker.css';

const MilestoneTracker = () => {
  const { childrenData, toggleMilestone } = useAppData();
  const [selectedChildId, setSelectedChildId] = useState(childrenData[0]?.id);
  const [expandedCat, setExpandedCat] = useState('All');

  const activeChild = childrenData.find(c => c.id === selectedChildId);

  if (!activeChild) {
    return <div className="p-4">Please add a child profile first.</div>;
  }

  const categories = ['All', ...new Set((activeChild.milestones || []).map(m => m.category))];

  const filteredMilestones = expandedCat === 'All' 
    ? (activeChild.milestones || []) 
    : (activeChild.milestones || []).filter(m => m.category === expandedCat);

  const stats = {
    total: (activeChild.milestones || []).length,
    completed: (activeChild.milestones || []).filter(m => m.completed).length
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Milestone Tracker</h1>
          <p className="text-muted m-0">Track development for different age stages.</p>
        </div>
        
        <select 
          className="card p-2 border border-gray-200 shadow-sm"
          value={selectedChildId} 
          onChange={(e) => setSelectedChildId(Number(e.target.value))}
          style={{ width: 'auto' }}
        >
          {childrenData.map(child => (
            <option key={child.id} value={child.id}>{child.name} ({child.age})</option>
          ))}
        </select>
      </div>

      <div className="card mb-8 text-center pt-8 pb-8">
        <div className="text-muted mb-2 font-medium">Overall Progress - {activeChild.age}</div>
        <div className="text-4xl font-bold text-primary mb-4">{activeChild.progress}%</div>
        <div className="progress-bg max-w-md mx-auto h-3">
          <div 
            className={`progress-fill ${activeChild.progress > 80 ? 'success' : ''}`} 
            style={{ width: `${activeChild.progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-muted mt-2">{stats.completed} of {stats.total} milestones completed</div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`badge ${expandedCat === cat ? 'bg-primary text-white' : 'bg-surface text-muted border border-gray-200'} px-4 py-2 cursor-pointer font-medium whitespace-nowrap`}
            onClick={() => setExpandedCat(cat)}
            style={expandedCat === cat ? { backgroundColor: 'var(--primary)', color: 'white' } : { backgroundColor: 'white', border: '1px solid #E2E8F0', color: 'var(--text-muted)' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filteredMilestones.map(milestone => (
          <div 
            key={milestone.id} 
            className={`card flex items-center justify-between cursor-pointer transition-all hover-border-primary border border-transparent ${milestone.completed ? 'bg-secondary-light' : ''}`}
            onClick={() => toggleMilestone(activeChild.id, milestone.id)}
          >
            <div className="flex items-center gap-4">
              {milestone.completed ? (
                <CheckCircle2 className="text-secondary" size={24} />
              ) : (
                <Circle className="text-muted" size={24} />
              )}
              <div>
                <h4 className={`m-0 font-medium ${milestone.completed ? 'line-through text-muted' : ''}`}>
                  {milestone.title}
                </h4>
                <span className="text-xs text-muted uppercase tracking-wider">{milestone.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneTracker;

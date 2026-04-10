import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { Baby, AlertCircle, CheckCircle2, ArrowRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, childrenData } = useAppData();

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <p>Here's an overview of your little ones' development.</p>
        </div>
        <Link to="/profile" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Baby size={20} /> Add Child Profile
        </Link>
      </div>

      <div className="grid-cards">
        {childrenData.map(child => (
          <div key={child.id} className="card dashboard-card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="avatar-lg bg-primary-light text-primary">
                  {(child.name || '?').charAt(0)}
                </div>
                <div>
                  <h3 className="m-0 text-lg">{child.name}</h3>
                  <p className="text-sm m-0">{child.age} • {child.gender}</p>
                </div>
              </div>
              <span className={`badge badge-${(child.status || 'Normal').toLowerCase().replace(' ', '-')}`}>
                {child.status || 'Normal'}
              </span>
            </div>

            <div className="mt-6 mb-2 flex justify-between text-sm font-medium">
              <span>Growth Progress</span>
              <span>{child.progress}%</span>
            </div>
            <div className="progress-bg mb-4">
              <div 
                className={`progress-fill ${(child.progress || 0) > 80 ? 'success' : ''}`} 
                style={{ width: `${child.progress || 0}%` }}
              ></div>
            </div>

            <div className="card bg-primary-light p-3 mb-6 flex justify-between items-center border-none shadow-none">
              <div className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-primary" />
                <span className="text-sm font-bold text-primary">LMS AI Score</span>
              </div>
              <span className="text-xl font-black text-primary">{child.lmsScore || 0}</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted">
                {child.status === 'Delayed' ? (
                  <><AlertCircle size={16} className="text-danger" /> Action Required</>
                ) : child.status === 'Needs Attention' ? (
                  <><AlertCircle size={16} className="text-warning" /> Needs Attention</>
                ) : (
                  <><CheckCircle2 size={16} className="text-secondary" /> On Track</>
                )}
              </div>
              <Link to="/milestones" className="btn btn-flat p-2 m-0 text-primary">
                View Timeline <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {childrenData.length === 0 && (
        <div className="card text-center py-12" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Baby size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-xl">No Profiles Yet</h3>
          <p className="mb-6">Add a child profile to start tracking milestones and get AI insights.</p>
          <Link to="/profile" className="btn btn-primary">
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

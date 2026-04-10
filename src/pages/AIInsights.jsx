import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { BrainCircuit, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';
import './AIInsights.css';

const AIInsights = () => {
  const { childrenData } = useAppData();

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <BrainCircuit size={28} className="text-primary" />
        <h1 className="text-2xl font-bold m-0">AI Insights & Analysis</h1>
      </div>
      <p className="mb-8 text-muted">Powered by pediatric guidelines, our AI analyzes your child's data to provide actionable recommendations.</p>

      {childrenData.length === 0 && (
        <div className="card text-center p-8">No data available for analysis.</div>
      )}

      {childrenData.map(child => (
        <div key={child.id} className="mb-8 text-left">
          <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
            Analysis for {child.name} <span className="text-sm font-normal text-muted">({child.age})</span>
          </h2>

          <div className="grid gap-4">
            <div className={`card ${child.status === 'Normal' ? 'bg-secondary-light border-secondary' : child.status === 'Delayed' ? 'bg-danger-light border-danger' : 'bg-warning-light border-warning'}`}>
              <div className="flex items-start gap-4">
                {child.status === 'Normal' ? <ShieldCheck className="text-secondary mt-1" size={24} /> : 
                 child.status === 'Delayed' ? <AlertTriangle className="text-danger mt-1" size={24} /> :
                 <AlertTriangle className="text-warning mt-1" size={24} />}
                <div>
                  <h3 className="text-lg font-bold mb-1 m-0">Status: {child.status}</h3>
                  <p className="m-0 text-sm opacity-90">
                    {child.status === 'Normal' 
                      ? `${child.name} is hitting all major milestones for their age group. The LMS Score indicates balanced growth across all categories.`
                      : child.status === 'Delayed'
                      ? `Critical Alert: The LMS Score is impacted by inconsistent milestones or a significant growth gap (>50%) between categories.`
                      : `Attention: The AI has detected a slight developmental asymmetry. Focused play in the lagging categories is recommended.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-surface border-primary-light">
               <h3 className="flex items-center gap-2 text-lg mb-4 font-bold m-0 text-primary">
                <BrainCircuit size={20} /> LMS Score Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center mt-2">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xs text-muted font-bold uppercase mb-1">Base</div>
                  <div className="text-xl font-black text-primary">{Math.round((child.progress || 0) * 0.4)}</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xs text-muted font-bold uppercase mb-1">Symmetry</div>
                  <div className="text-xl font-black text-secondary">{Math.round((100 - (child.symmetryGap || 0)) * 0.4)}</div>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="text-xs text-muted font-bold uppercase mb-1">Velocity</div>
                  <div className="text-xl font-black text-warning">18</div>
                </div>
              </div>
              <p className="text-xs text-muted mt-3 italic">
                * LMS Score: {child.lmsScore || 0}. Highly optimized for clinical detection of asymmetric growth patterns.
              </p>
            </div>

            <div className="card">
              <h3 className="flex items-center gap-2 text-lg mb-4 font-bold m-0">
                <Lightbulb size={20} className="text-warning" /> AI Recommendations
              </h3>
              
              <ul className="pl-6 m-0 flex flex-col gap-3 text-sm">
                {child.status === 'Normal' ? (
                  <>
                    <li><strong>Continue Reading:</strong> Read colorful books together pointing out objects and naming them.</li>
                    <li><strong>Social Play:</strong> Arrange playdates to enhance social sharing skills and empathy.</li>
                  </>
                ) : (
                  <>
                    <li><strong>Language Practice:</strong> Narrate your actions throughout the day to expose them to more words contextually.</li>
                    <li><strong>Physical Activity:</strong> Use toys slightly out of reach to encourage moving, crawling or walking.</li>
                    {child.status === 'Delayed' && (
                      <li className="text-danger font-bold mt-2">Suggested Action: Schedule a routine check-up with Dr. Sarah to discuss developmental strategies.</li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;

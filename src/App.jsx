import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppData } from './context/AppDataContext';
import { Baby } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import './App.css';

import Dashboard from './pages/Dashboard';
import ChildProfile from './pages/ChildProfile';
import MilestoneTracker from './pages/MilestoneTracker';
import AIInsights from './pages/AIInsights';
import Reports from './pages/Reports';
import ChatAssistant from './pages/ChatAssistant';
import AIVision from './pages/AIVision';

function App() {
  const { user, loading } = useAppData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <div className="avatar-lg bg-primary-light text-primary animate-pulse">
          <Baby size={48} />
        </div>
        <p className="text-muted font-bold animate-pulse">Connecting to LittleMilestones AI...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="app-container animate-fade-in">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<ChildProfile />} />
            <Route path="/milestones" element={<MilestoneTracker />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/vision" element={<AIVision />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

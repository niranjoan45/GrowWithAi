import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Baby, CheckSquare, BrainCircuit, BarChart2, MessageCircle, LogOut, Camera } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout, user } = useAppData();

  const navItems = [
    { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/profile', label: 'Child Profile', icon: <Baby size={20} /> },
    { path: '/milestones', label: 'Milestone Tracker', icon: <CheckSquare size={20} /> },
    { path: '/vision', label: 'AI Vision Scan', icon: <Camera size={20} /> },
    { path: '/insights', label: 'AI Insights', icon: <BrainCircuit size={20} /> },
    { path: '/reports', label: 'Reports', icon: <BarChart2 size={20} /> },
    { path: '/chat', label: 'AI Chat Advisor', icon: <MessageCircle size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Baby size={28} className="logo-icon-small" />
          <span>LittleMilestones</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user.name.charAt(0)}</div>
          <div className="details">
            <span className="name">{user.name}</span>
            <span className="role">{user.role}</span>
          </div>
        </div>
        <button onClick={logout} className="btn-logout" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Baby, Mail, Lock, User } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { login } = useAppData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      setAuthLoading(true);
      await login(email, password);
      setAuthLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card animate-fade-in">
        <div className="logo-icon animate-pulse">
          <Baby size={40} />
        </div>
        <h2 className="mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="mb-8">
          {isLogin 
            ? 'Sign in to monitor your child\'s milestones' 
            : 'Join us to track your child\'s development journey'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col items-start gap-2">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={20} />
                <input type="text" placeholder="Dr. Sarah / Parent" required />
              </div>
            </div>
          )}

          <div className="flex flex-col items-start gap-2">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={authLoading}>
            {authLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              className="btn btn-flat ml-2" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import React, { createContext, useState, useContext, useEffect } from 'react';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

const defaultMilestones = [
  { id: 1, category: 'Physical', title: 'Walks alone', completed: false },
  { id: 2, category: 'Physical', title: 'Begins to run', completed: false },
  { id: 3, category: 'Language', title: 'Says at least 15 words', completed: false },
  { id: 4, category: 'Language', title: 'Points to things in a book', completed: false },
  { id: 5, category: 'Social', title: 'Plays beside other children', completed: false },
  { id: 6, category: 'Social', title: 'Shows defiance', completed: false },
  { id: 7, category: 'Cognitive', title: 'Finds hidden things easily', completed: false },
  { id: 8, category: 'Cognitive', title: 'Begins to sort shapes and colors', completed: false }
];

export const AppDataProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- API LOGIC (MongoDB Connection) ---
  const BASE_URL = import.meta.env.VITE_API_URL || 'https://growwithai-2.onrender.co';
  const API_URL = `${BASE_URL}/api/children`;

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.length > 0) {
          // Retroactively fix any profiles that have missing/empty milestones
          const processedData = data.map(child => {
             if (!child.milestones || child.milestones.length === 0) {
                return { ...child, milestones: [...defaultMilestones] };
             }
             return child;
          });
          setChildrenData(processedData);
        } else {
          // Initialize with dummy data if DB is empty
          const dummy = [
            {
              id: 1,
              name: 'Emma',
              age: '24 Months',
              gender: 'Female',
              dob: '2024-04-01',
              progress: 65,
              lmsScore: 78,
              status: 'Normal',
              milestones: [
                { id: 1, category: 'Physical', title: 'Walks alone', completed: true },
                { id: 2, category: 'Physical', title: 'Begins to run', completed: false },
                { id: 3, category: 'Language', title: 'Says at least 15 words', completed: false },
                { id: 4, category: 'Language', title: 'Points to things in a book', completed: true },
                { id: 5, category: 'Social', title: 'Plays beside other children', completed: true },
                { id: 6, category: 'Social', title: 'Shows defiance', completed: false },
                { id: 7, category: 'Cognitive', title: 'Finds hidden things easily', completed: true },
                { id: 8, category: 'Cognitive', title: 'Begins to sort shapes and colors', completed: false },
              ]
            }
          ];
          setChildrenData(dummy);
          // Save dummy to DB for future
          saveToDb(dummy[0]);
        }
      } catch (err) {
        console.error("Failed to connect to backend", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const saveToDb = async (child) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child)
      });
    } catch (err) {
      console.error("Failed to save to MongoDB", err);
    }
  };
  // -------------------------------------

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const userData = await response.json();
      setUser(userData);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      // Fallback for demo if server is down
      setUser({ name: 'Dr. Sarah / Parent', email, role: 'Parent' });
      return true;
    }
  };
  
  const logout = () => setUser(null);

  const addChild = (child) => {
    const newChild = { 
      ...child, 
      id: Date.now(), 
      progress: 0, 
      lmsScore: 0,
      status: 'Normal', 
      milestones: [...defaultMilestones] 
    };
    setChildrenData([...childrenData, newChild]);
    saveToDb(newChild);
  };

  const removeChild = async (childId) => {
    // 1. Clean, pure state update
    setChildrenData(prev => prev.filter(child => child.id !== childId));
    
    // 2. Side-effect (API Call)
    try {
      await fetch(`${API_URL}/${childId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error("Failed to delete from MongoDB", err);
    }
  };

  const toggleMilestone = (childId, milestoneId) => {
    // 1. Find the target child first
    const targetChild = childrenData.find(c => c.id === childId);
    if (!targetChild) return;

    // 2. Perform all calculations outside of state updater
    const updatedMilestones = (targetChild.milestones || []).map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    
    // Calculate category-specific progress for symmetry analysis
    const categories = [...new Set(updatedMilestones.map(m => m.category))];
    const catStats = categories.map(cat => {
      const catMs = updatedMilestones.filter(m => m.category === cat);
      return {
        category: cat,
        progress: (catMs.filter(m => m.completed).length / catMs.length) * 100
      };
    });

    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const totalProgress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100) 
      : 0;
    
    // LMS SCORE ENGINE
    const baseScore = totalProgress * 0.4;
    const maxCat = catStats.length > 0 ? Math.max(...catStats.map(c => c.progress)) : 0;
    const minCat = catStats.length > 0 ? Math.min(...catStats.map(c => c.progress)) : 0;
    const symmetryGap = maxCat - minCat;
    const symmetryScore = Math.max(0, (100 - symmetryGap)) * 0.4;
    const velocityFactor = Math.min(20, (completedCount * 2));
    const lmsScore = Math.round(baseScore + symmetryScore + velocityFactor);

    let status = 'Normal';
    if (lmsScore < 30 || symmetryGap > 50) status = 'Delayed';
    else if (lmsScore < 60 || symmetryGap > 30) status = 'Needs Attention';

    const finalChild = { 
      ...targetChild, 
      milestones: updatedMilestones, 
      progress: totalProgress, 
      lmsScore, 
      status, 
      symmetryGap 
    };

    // 3. Side-effect (API Call) is completely decoupled from the state updater
    saveToDb(finalChild);

    // 4. Clean, pure state update
    setChildrenData(prev => prev.map(child => child.id === childId ? finalChild : child));
  };

  return (
    <AppDataContext.Provider value={{
      user, login, logout, childrenData, addChild, removeChild, toggleMilestone, loading
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

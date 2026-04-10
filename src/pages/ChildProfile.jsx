import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Calendar, User, UserPlus } from 'lucide-react';
import './ChildProfile.css';

const ChildProfile = () => {
  const { addChild, childrenData } = useAppData();
  const [formData, setFormData] = useState({ name: '', gender: 'Male', dob: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateAgeStr = (dob) => {
    // simplified age calculation for prototype
    return '12 Months';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addChild({
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      age: calculateAgeStr(formData.dob)
    });
    setFormData({ name: '', gender: 'Male', dob: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Child Profiles</h1>
      <p className="mb-8 text-muted">Manage profiles for the children you are tracking.</p>

      <div className="card mb-8">
        <h2 className="text-lg mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-primary" /> Add New Profile
        </h2>
        
        {showSuccess && (
          <div className="bg-secondary-light text-secondary p-3 rounded-md mb-4 flex items-center gap-2 font-medium">
            Profile created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>Child's Name</label>
            <div className="input-with-icon">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="e.g., Emma" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label>Gender</label>
            <select 
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Date of Birth</label>
            <div className="input-with-icon">
              <Calendar size={20} className="input-icon" />
              <input 
                type="date" 
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4 self-start">
            Save Profile
          </button>
        </form>
      </div>

      <h2 className="text-lg mb-4">Existing Profiles</h2>
      <div className="flex flex-col gap-4">
        {childrenData.map(child => (
          <div key={child.id} className="card flex justify-between items-center bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="avatar">{child.name.charAt(0)}</div>
              <div>
                <h3 className="m-0 font-bold">{child.name}</h3>
                <p className="text-sm m-0 text-muted">{child.age} • {child.gender}</p>
              </div>
            </div>
            <button className="btn btn-outline" disabled style={{ opacity: 0.5 }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildProfile;

import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import './AIVision.css';

const AIVision = () => {
  const [stage, setStage] = useState('upload'); // upload, scanning, results
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setStage('scanning');
      
      // Simulate AI Scanning
      setTimeout(() => {
        setStage('results');
        setAnalysis({
          milestone: "Unsupported Standing / Cruising",
          confidence: "98.4%",
          status: "Verified",
          recommendation: "Child shows excellent postural stability. Suggest introducing 'Push Toys' to encourage the transition to independent walking."
        });
      }, 3000);
    }
  };

  const reset = () => {
    setStage('upload');
    setImage(null);
    setAnalysis(null);
  };

  return (
    <div className="ai-vision-container animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">AI Vision Scan</h1>
        <p className="text-muted">Upload a photo to verify developmental milestones automatically.</p>
      </div>

      {stage === 'upload' && (
        <div 
          className="upload-dropzone card p-12 text-center cursor-pointer border-dashed border-2 hover-border-primary"
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            style={{ display: 'none' }} 
            accept="image/*"
          />
          <div className="upload-icon-circle mx-auto mb-4 bg-primary-light text-primary">
            <Camera size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">Upload or Take Photo</h3>
          <p className="text-sm text-muted mb-6 px-12">
            Upload a clear photo of your child performing a specific action (e.g., sitting, crawling, standing).
          </p>
          <button className="btn btn-primary flex items-center gap-2 mx-auto">
            <Upload size={18} /> Select Image
          </button>
        </div>
      )}

      {stage === 'scanning' && (
        <div className="card p-8 text-center relative overflow-hidden">
          <div className="scanning-image-wrapper mb-6 mx-auto">
            <img src={image} alt="Uploading..." className="scanned-image" />
            <div className="scan-line"></div>
          </div>
          <div className="flex items-center justify-center gap-3 text-primary font-bold animate-pulse">
            <RefreshCw className="animate-spin" size={20} />
            Analyzing Skeletal Dynamics...
          </div>
          <p className="text-sm text-muted mt-4">Our AI is mapping joint positions and stability markers.</p>
        </div>
      )}

      {stage === 'results' && (
        <div className="animate-scale-in">
          <div className="card p-0 overflow-hidden mb-6">
            <div className="bg-secondary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 size={20} /> Milestone Verified
              </div>
              <div className="text-sm opacity-90">AI Confidence: {analysis.confidence}</div>
            </div>
            <div className="p-6">
              <div className="flex gap-6 items-start">
                <img src={image} alt="Result" className="w-24 h-24 object-cover rounded-lg shadow-md" />
                <div>
                  <h3 className="text-xl font-bold mb-1">{analysis.milestone}</h3>
                  <div className="flex items-center gap-2 text-secondary font-medium text-sm mb-4">
                    <ShieldCheck size={16} /> Diagnostic Precision Level: High
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-surface rounded-xl border border-gray-100 italic text-sm text-muted">
                "{analysis.recommendation}"
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn btn-primary flex-1" onClick={() => alert('Milestone logged to tracker!')}>
              Save to Progress Tracker
            </button>
            <button className="btn btn-secondary flex-1" onClick={reset}>
               Scan Another
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 card bg-warning-light border-warning border flex gap-4 items-start">
        <AlertTriangle className="text-warning shrink-0" size={24} />
        <p className="text-xs text-muted m-0">
          <strong>Hackathon Note:</strong> This feature uses simulated computer vision model calls. In a production environment, this would integrate with TensorFlow.js or Azure Cognitive Services for real-time skeletal mapping.
        </p>
      </div>
    </div>
  );
};

export default AIVision;

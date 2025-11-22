import React, { useState, useEffect } from 'react';
import './App.css';

// ... (Keep your Icon component exactly as it was) ...
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    search: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    shieldCheck: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>,
    shieldAlert: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
    mapPin: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    building: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="12" y1="22" x2="12" y2="22.01"></line><line x1="12" y1="2" x2="12" y2="22"></line><line x1="4" y1="10" x2="20" y2="10"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>,
    externalLink: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
    loader2: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>,
    briefcase: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    robot: <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
  };
  return icons[name] || null;
};

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // AI Search States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // 1. Fetch Local Data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://backend-search.vercel.app/api/jobs');
        const data = await response.json();
        if (data.success) setJobs(data.data);
      } catch (err) {
        setError('Backend is offline.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // 2. Filter Logic
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. AI Fallback Function
  const performAiSearch = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const response = await fetch('https://backend-search.vercel.app/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm })
      });
      const data = await response.json();
      if(data.success) setAiResult(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="app-container">
      
      <div className="hero-section">
        <h1 className="title">Job <span className="highlight">Trust</span> Scanner</h1>
        <p className="subtitle">Search for a job. If we don't have it, our AI Agent will find it.</p>
        
        <div className="search-wrapper">
          <Icon name="search" className="search-icon" />
          <input 
            type="text" 
            placeholder="E.g. 'React Developer' or 'Data Entry'..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setAiResult(null); // Reset AI results on typing
            }}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="job-grid">
        {filteredJobs.map((job, index) => (
          <div key={index} className="job-card">
            <div className="card-header">
              {job.verified ? 
                <span className="badge verified"><Icon name="shieldCheck" size={14} /> Verified</span> : 
                <span className="badge unverified"><Icon name="shieldAlert" size={14} /> Public</span>
              }
              <span className="date">{job.datePosted || job.deadline}</span>
            </div>
            <h3 className="job-title">{job.title}</h3>
            <div className="company-row"><Icon name="building" size={16} /> {job.company}</div>
            <div className="meta-box">
              <div className="meta-item"><Icon name="mapPin" size={14} /> {job.location}</div>
            </div>
            <button className="apply-btn btn-blue">Apply Now</button>
          </div>
        ))}
      </div>

      {/* Fallback: AI Agent Interface */}
      {!loading && filteredJobs.length === 0 && searchTerm.length > 2 && (
        <div className="status-message">
          
          {!aiLoading && !aiResult && (
            <div className="ai-prompt-box">
              <Icon name="briefcase" size={48} style={{ opacity: 0.3 }} />
              <h3>No local results for "{searchTerm}"</h3>
              <p>Would you like our AI Agent to analyze this role for you?</p>
              <button className="apply-btn btn-blue" onClick={performAiSearch}>
                 <Icon name="robot" size={18} /> Ask AI Agent
              </button>
            </div>
          )}

          {aiLoading && (
            <div className="loading">
              <div className="spin"><Icon name="loader2" size={32} /></div>
              <p>Gemini AI is analyzing the market for "{searchTerm}"...</p>
            </div>
          )}

          {aiResult && (
            <div className="ai-result-card">
              <div className="card-header">
                <span className="badge verified" style={{background:'#e0e7ff', color:'#4338ca'}}>
                   <Icon name="robot" size={14} /> AI Market Analysis
                </span>
              </div>
              <h3 className="job-title">{searchTerm} Overview</h3>
              <p className="ai-summary">{aiResult.summary}</p>
              
              <div className="meta-box">
                <div className="meta-item"><strong>Salary:</strong> {aiResult.salary_range}</div>
                <div className="meta-item"><strong>Market:</strong> {aiResult.market_status}</div>
              </div>

              <div className="skills-container">
                 {aiResult.skills.map(skill => <span className="tag">{skill}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

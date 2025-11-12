import React, { useEffect, useState } from 'react'
import FormField from '../components/FormField'
import Button from '../components/Button'
import Table from '../components/Table'
import { BRANCHES, JOB_ROLES, SKILLS } from '../utils/constants'

export default function CompanyDashboard(){
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({ title: '', description: '', ctc: '', location: '', cgpaCutoff: 0, eligibleBranches: '', requiredSkills: '' })
  const [closeModal, setCloseModal] = useState({ open: false, job: null, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' })
  const [selectedJob, setSelectedJob] = useState(null) // For viewing applications
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(()=>{ loadJobs() },[])

  async function loadJobs(){
    const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/companies/jobs/my', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setJobs(data || []);
  }

  function openCloseModal(job){
    setCloseModal({ open: true, job, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' })
  }

  async function confirmClose(){
    const job = closeModal.job;
    if(!job) return;
    setCloseModal(d=>({ ...d, saving: true }));
    try{
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/companies/jobs/${job._id}/close`, { 
        method: 'PATCH', 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({ 
          status: closeModal.status, 
          reason: closeModal.reason, 
          hiredCount: closeModal.hiredCount ? parseInt(closeModal.hiredCount) : 0 
        }) 
      });
      const body = await res.json().catch(()=>({}));
      if(res.ok){
        await loadJobs();
        setSuccess(body.msg || 'Recruitment closed successfully');
        setTimeout(() => setSuccess(null), 5000);
        setCloseModal({ open: false, job: null, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' });
      } else {
        setError(body.error || body.msg || `Failed to close recruitment (${res.status})`);
        setTimeout(() => setError(null), 5000);
        await loadJobs();
        setCloseModal({ open: false, job: null, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' });
      }
    }catch(err){
      console.error('Close recruitment failed', err);
      setError('Failed to close recruitment: ' + (err.message || err));
      setTimeout(() => setError(null), 5000);
      await loadJobs();
      setCloseModal({ open: false, job: null, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' });
    }
  }

  function CloseRecruitmentModal(){
    if(!closeModal.open) return null;
    const job = closeModal.job;
    const reasons = [
      'Recruitment Completed',
      'Position Filled',
      'No Longer Hiring',
      'Budget Constraints',
      'Role No Longer Available',
      'Postponed to Next Cycle'
    ];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-70" onClick={()=>setCloseModal({ open: false, job: null, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' })} />
        <div className="relative bg-white dark:bg-gray-800 w-11/12 max-w-lg rounded-xl shadow-2xl dark:shadow-gray-900/50 p-6 z-10">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Close Recruitment</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-5">Closing recruitment for <span className="font-semibold text-gray-800 dark:text-gray-200">"{job?.title}"</span></div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select 
                value={closeModal.status} 
                onChange={e=>setCloseModal(d=>({...d, status: e.target.value}))} 
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition"
              >
                <option value="completed">Completed (Successfully hired)</option>
                <option value="closed">Closed (Not hiring anymore)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Closure Reason</label>
              <select 
                value={closeModal.reason} 
                onChange={e=>setCloseModal(d=>({...d, reason: e.target.value}))} 
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition"
              >
                {reasons.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {closeModal.status === 'completed' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Candidates Hired <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                </label>
                <input 
                  type="number"
                  min="0"
                  value={closeModal.hiredCount} 
                  onChange={e=>setCloseModal(d=>({...d, hiredCount: e.target.value}))} 
                  placeholder="e.g., 5"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition" 
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={()=>setCloseModal({ open: false, job: null, status: 'completed', reason: 'Recruitment Completed', hiredCount: '' })} 
              className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button 
              onClick={confirmClose} 
              disabled={closeModal.saving}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white font-medium hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition shadow-lg disabled:opacity-50"
            >
              {closeModal.saving ? 'Closing...' : 'Close Recruitment'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  async function submit(e){
    e.preventDefault();
    // basic validation
    if(!form.title) {
      setError('Title required');
      setTimeout(() => setError(null), 5000);
      return;
    }
    const payload = Object.assign({}, form, { eligibleBranches: form.eligibleBranches.split(',').map(s=>s.trim()), requiredSkills: form.requiredSkills.split(',').map(s=>s.trim()) });
    const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/companies/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(payload) });
    const data = await res.json();
    if(res.ok){
      setSuccess('Job posted successfully!');
      setTimeout(() => setSuccess(null), 5000);
      setForm({ title: '', description: '', ctc: '', location: '', cgpaCutoff: 0, eligibleBranches: '', requiredSkills: '' });
    } else {
      setError(data.error || 'Failed to post job');
      setTimeout(() => setError(null), 5000);
    }
    loadJobs();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-8 px-6">
      <div className="max-w-[2200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
            Company Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Post job openings and manage applications.</p>
        </div>

        {/* Success and Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">{/* Create Job Form */}
          {/* Create Job Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Create Job</h2>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <form className="space-y-4" onSubmit={submit}>
                <FormField label="Job Role">
                  <select 
                    value={form.title} 
                    onChange={e=>setForm(f=>({...f, title: e.target.value}))} 
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition bg-white" 
                  >
                    <option value="">Select Job Role</option>
                    {JOB_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Description">
                  <textarea 
                    value={form.description} 
                    onChange={e=>setForm(f=>({...f, description: e.target.value}))} 
                    placeholder="Job description and requirements" 
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition h-24" 
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="CTC">
                    <input 
                      value={form.ctc} 
                      onChange={e=>setForm(f=>({...f, ctc: e.target.value}))} 
                      placeholder="e.g., 12 LPA" 
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition" 
                    />
                  </FormField>
                  <FormField label="Location">
                    <input 
                      value={form.location} 
                      onChange={e=>setForm(f=>({...f, location: e.target.value}))} 
                      placeholder="City" 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="CGPA Cutoff">
                    <input 
                      value={form.cgpaCutoff} 
                      onChange={e=>setForm(f=>({...f, cgpaCutoff: e.target.value}))} 
                      placeholder="e.g., 7.5" 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                    />
                  </FormField>
                  <FormField label="Eligible Branches">
                    <select 
                      value=""
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          const current = form.eligibleBranches ? form.eligibleBranches.split(',').map(s => s.trim()) : [];
                          if (!current.includes(value)) {
                            setForm(f=>({...f, eligibleBranches: current.length > 0 ? `${form.eligibleBranches}, ${value}` : value}));
                          }
                        }
                        e.target.value = '';
                      }}
                      className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200"
                    >
                      <option value="">Choose branches to add...</option>
                      {BRANCHES.filter(branch => {
                        const current = form.eligibleBranches ? form.eligibleBranches.split(',').map(s => s.trim()) : [];
                        return !current.includes(branch);
                      }).map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                    {form.eligibleBranches && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {form.eligibleBranches.split(',').map((branch, idx) => branch.trim() && (
                          <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-1">
                            {branch.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const branchesArray = form.eligibleBranches.split(',').map(s => s.trim()).filter(s => s !== branch.trim());
                                setForm(f=>({...f, eligibleBranches: branchesArray.join(', ')}));
                              }}
                              className="hover:text-purple-900 dark:hover:text-purple-100 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </FormField>
                </div>
                <FormField label="Required Skills">
                  <select 
                    value=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const current = form.requiredSkills ? form.requiredSkills.split(',').map(s => s.trim()) : [];
                        if (!current.includes(value)) {
                          setForm(f=>({...f, requiredSkills: current.length > 0 ? `${form.requiredSkills}, ${value}` : value}));
                        }
                      }
                      e.target.value = '';
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">Choose skills to add...</option>
                    {SKILLS.filter(skill => {
                      const current = form.requiredSkills ? form.requiredSkills.split(',').map(s => s.trim()) : [];
                      return !current.includes(skill);
                    }).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  {form.requiredSkills && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.requiredSkills.split(',').map((skill, idx) => skill.trim() && (
                        <span key={idx} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm flex items-center gap-1">
                          {skill.trim()}
                          <button
                            type="button"
                            onClick={() => {
                              const skillsArray = form.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== skill.trim());
                              setForm(f=>({...f, requiredSkills: skillsArray.join(', ')}));
                            }}
                            className="hover:text-pink-900 dark:hover:text-pink-100 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </FormField>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg">
                  Create Job
                </Button>
              </form>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <JobApplicationsView job={selectedJob} onBack={()=>setSelectedJob(null)} />
            ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <CloseRecruitmentModal />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Jobs</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-lg dark:text-gray-300">No jobs posted yet</div>
                  <div className="text-sm mt-2 dark:text-gray-400">Create your first job posting</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map(j=> (
                    <div key={j._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md dark:hover:shadow-gray-900/50 transition dark:bg-gray-700/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                              {j.title.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{j.title}</h3>
                                {j.recruitmentStatus !== 'active' && (
                                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                    j.recruitmentStatus === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {j.recruitmentStatus === 'completed' ? 'Completed' : 'Closed'}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>{j.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{j.ctc}</span>
                                </div>
                                {j.recruitmentStatus === 'completed' && j.hiredCount > 0 && (
                                  <div className="flex items-center gap-1 text-green-600 font-medium">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{j.hiredCount} hired</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={()=>setSelectedJob(j)} 
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition"
                          >
                            View Applications
                          </button>
                          {j.recruitmentStatus === 'active' && (
                            <>
                              <button 
                                onClick={()=>setForm(j)} 
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={()=>openCloseModal(j)} 
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                title="Close Recruitment"
                              >
                                �
                              </button>
                            </>
                          )}
                          {j.recruitmentStatus !== 'active' && (
                            <span className="text-xs text-gray-500 px-3">
                              {j.closureReason}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {form && form._id === j._id && (
                        <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                          <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Edit Job</h4>
                          <div className="space-y-3">
                            <input 
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition" 
                              value={form.title} 
                              onChange={e=>setForm(f=>({...f, title: e.target.value}))} 
                              placeholder="Title"
                            />
                            <textarea 
                              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition h-24" 
                              value={form.description} 
                              onChange={e=>setForm(f=>({...f, description: e.target.value}))} 
                              placeholder="Description"
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={async ()=>{
                                  const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/companies/jobs/${form._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(form) });
                                  if(res.ok){
                                    const updated = await res.json();
                                    setJobs(prev => prev.map(j=> j._id === updated._id ? updated : j));
                                    setSuccess('Job updated successfully!');
                                    setTimeout(() => setSuccess(null), 5000);
                                    setForm(null);
                                  } else {
                                    setError('Failed to save job');
                                    setTimeout(() => setError(null), 5000);
                                    loadJobs();
                                  }
                                }} 
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                              >
                                Save Changes
                              </button>
                                <button 
                                onClick={()=>setForm(f=>null)} 
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function JobApplicationsView({ job, onBack }){
  const [apps, setApps] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() },[job])

  async function load(){
    setLoading(true)
    const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/companies/jobs/${job._id}/applications`, { 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    const data = await res.json();
    setApps(data || [])
    setLoading(false)
  }

  async function changeStatus(appId, status){
    setLoading(true)
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/companies/applications/${appId}/status`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    await load()
  }

  if(!apps) return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 dark:border-purple-500 border-t-transparent"></div>
      </div>
    </div>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Applications for {job.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{apps.length} application{apps.length !== 1 ? 's' : ''} received</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 dark:border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {apps.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-xl font-medium text-gray-700 dark:text-gray-300">No applications yet</div>
          <p className="text-sm mt-2 dark:text-gray-400">Applications will appear here once students apply</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all dark:bg-gray-700/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {app.studentId?.profile?.name?.charAt(0)?.toUpperCase() || app.studentId?.email?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {app.studentId?.profile?.name || 'Student'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{app.studentId?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Branch</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{app.studentId?.profile?.branch || 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">CGPA</div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{app.studentId?.profile?.cgpa || 'N/A'}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Applied On</div>
                      <div className="text-sm font-medium text-gray-800">{new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {app.studentId?.profile?.skills && app.studentId.profile.skills.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {app.studentId.profile.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.resumeSnapshotPath && (
                    <div className="mt-3">
                      <a 
                        href={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/uploads/${app.resumeSnapshotPath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold mb-3 ${
                    app.status === 'Selected' ? 'bg-green-100 text-green-800 border border-green-200' :
                    app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {app.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={()=>changeStatus(app._id, 'Shortlisted')}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  ⭐ Shortlist
                </button>
                <button 
                  onClick={()=>changeStatus(app._id, 'Rejected')}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  Reject
                </button>
                <button 
                  onClick={()=>changeStatus(app._id, 'Selected')}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

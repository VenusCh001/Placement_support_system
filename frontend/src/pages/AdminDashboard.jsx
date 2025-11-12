import React, { useEffect, useState } from 'react'
import Table from '../components/Table'
import { getProfileEditRequests, approveProfileEditRequest, rejectProfileEditRequest, getAllCompanyPermissionRequests, approveCompanyPermissionRequest, rejectCompanyPermissionRequest } from '../lib/api'

function Tabs({ active, onChange }){
  const tabs = [
    { 
      id: 'students', 
      label: 'Students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'companies', 
      label: 'Companies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      id: 'permissions', 
      label: 'Permission Requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      id: 'stats', 
      label: 'Statistics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]
  
  return (
    <div className="flex flex-col gap-2 bg-white p-3 rounded-xl shadow-lg border border-gray-200 sticky top-6">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={()=>onChange(tab.id)} 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
            active===tab.id 
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function AdminDashboard(){
  const [students, setStudents] = useState(null)
  const [companies, setCompanies] = useState(null)
  const [tab, setTab] = useState('students')
  const [deletions, setDeletions] = useState(null)
  const [credentialRequests, setCredentialRequests] = useState(null)
  const [permissionRequests, setPermissionRequests] = useState(null)

  useEffect(()=>{ load() },[])

  async function load(){
    const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/admin/students', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setStudents(data);
    const res2 = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/admin/companies', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const data2 = await res2.json();
    setCompanies(data2);
    // load deletion requests
    const dr = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/admin/deletion-requests', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const drData = await dr.json();
    setDeletions(drData);
    // load credential edit requests
    const cr = await getProfileEditRequests();
    setCredentialRequests(cr);
    // load permission requests
    const pr = await getAllCompanyPermissionRequests();
    setPermissionRequests(pr);
  }

  async function verifyCompany(id){
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/admin/companies/${id}/verify`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    alert('Done');
  }

  if(!students || !companies) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  )
  
  const cols = [
    { label: 'Email', key: 'email' },
    { label: 'Name', key: 'profile', render: r => r.profile?.name || '-' },
    { label: 'Branch', key: 'profile', render: r => r.profile?.branch || '-' },
    { label: 'CGPA', key: 'profile', render: r => r.profile?.cgpa ?? '-' }
  ]
  const compCols = [
    { label: 'Email', key: 'company', render: r => r.company?.email },
    { label: 'Company Name', key: 'company', render: r => r.company?.profile?.companyName || '-' },
    { label: 'Verified', key: 'company', render: r => r.company?.companyVerified ? 'Yes' : 'No' },
    { label: 'Jobs Posted', key: 'jobs', render: r => (r.jobs || []).length }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-6">
      <div className="max-w-[2200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage students, companies, and system operations.</p>
        </div>

        {/* Sidebar Layout */}
        <div className="flex gap-6">
          {/* Sidebar with Tabs */}
          <div className="w-64 flex-shrink-0">
            <Tabs active={tab} onChange={setTab} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
        
        {tab === 'students' && (
          <div className="space-y-6">
            {/* Students List */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Students</h2>
                  <p className="text-sm text-gray-500 mt-1">{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-4xl">🎓</div>
              </div>
              <div className="overflow-x-auto">
                <Table columns={cols} data={students} />
              </div>
            </div>

            {/* Student Profile Edit Requests */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Profile Edit Requests</h2>
                  <p className="text-sm text-gray-500 mt-1">Review and approve student profile changes</p>
                </div>
                <div className="text-4xl">✏️</div>
              </div>
              {credentialRequests === null ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
                </div>
              ) : credentialRequests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-6xl mb-4">✓</div>
                  <div className="text-xl font-medium text-gray-700">No pending credential edit requests</div>
                  <p className="text-sm mt-2">All profile changes have been processed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {credentialRequests.map(req => (
                    <div key={req._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                              {req.studentId?.profile?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">
                                {req.studentId?.profile?.name || 'Unknown Student'}
                              </h3>
                              <div className="text-sm text-gray-600">{req.studentId?.email}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Submitted: {new Date(req.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                          req.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                            <span>📋</span> Current Profile
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2"><span className="font-medium min-w-16">Name:</span> <span className="text-gray-600">{req.studentId?.profile?.name || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Roll:</span> <span className="text-gray-600">{req.studentId?.profile?.rollNumber || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Branch:</span> <span className="text-gray-600">{req.studentId?.profile?.branch || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">CGPA:</span> <span className="text-gray-600">{req.studentId?.profile?.cgpa || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Phone:</span> <span className="text-gray-600">{req.studentId?.profile?.phone || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Skills:</span> <span className="text-gray-600">{(req.studentId?.profile?.skills || []).join(', ') || '-'}</span></div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                          <h4 className="font-semibold text-sm text-blue-800 mb-3 flex items-center gap-2">
                            <span>✨</span> Requested Changes
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2"><span className="font-medium min-w-16">Name:</span> <span className="text-blue-900">{req.requestedChanges.name || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Roll:</span> <span className="text-blue-900">{req.requestedChanges.rollNumber || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Branch:</span> <span className="text-blue-900">{req.requestedChanges.branch || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">CGPA:</span> <span className="text-blue-900">{req.requestedChanges.cgpa || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Phone:</span> <span className="text-blue-900">{req.requestedChanges.phone || '-'}</span></div>
                            <div className="flex gap-2"><span className="font-medium min-w-16">Skills:</span> <span className="text-blue-900">{(req.requestedChanges.skills || []).join(', ') || '-'}</span></div>
                          </div>
                        </div>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="border-t pt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Comments (Optional)</label>
                          <textarea 
                            id={`comment-${req._id}`}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition mb-3" 
                            rows="2"
                            placeholder="Add feedback or comments for the student..."
                          />
                          <div className="flex gap-3">
                            <button 
                              onClick={async ()=>{ 
                                const comments = document.getElementById(`comment-${req._id}`).value;
                                await approveProfileEditRequest(req._id, comments);
                                alert('Request approved successfully!'); 
                                load(); 
                              }} 
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                            >
                              Approve Request
                            </button>
                            <button 
                              onClick={async ()=>{ 
                                const comments = document.getElementById(`comment-${req._id}`).value;
                                if(!comments.trim()) {
                                  alert('Please provide a reason for rejection');
                                  return;
                                }
                                await rejectProfileEditRequest(req._id, comments);
                                alert('Request rejected'); 
                                load(); 
                              }} 
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
                            >
                              Reject Request
                            </button>
                          </div>
                        </div>
                      ) : (
                        req.adminComments && (
                          <div className="border-t pt-4">
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                              <div className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Admin Comments
                              </div>
                              <div className="text-sm text-gray-700 leading-relaxed">{req.adminComments}</div>
                              {req.reviewedAt && (
                                <div className="text-xs text-gray-500 mt-2">
                                  Reviewed: {new Date(req.reviewedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {tab === 'companies' && (
          <div className="space-y-6">
            {/* Companies List */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Companies</h2>
                  <p className="text-sm text-gray-500 mt-1">{companies.length} registered compan{companies.length !== 1 ? 'ies' : 'y'}</p>
                </div>
                <div className="text-4xl">🏢</div>
              </div>
              <div className="overflow-x-auto">
                <Table columns={compCols} data={companies} />
              </div>
            </div>

            {/* Recruitment Closures */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Recruitment Closures</h2>
                  <p className="text-sm text-gray-500 mt-1">Track completed and closed recruitment cycles</p>
                </div>
                <div className="text-4xl">📋</div>
              </div>
              {deletions === null ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
                </div>
              ) : deletions.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-6xl mb-4">✓</div>
                  <div className="text-xl font-medium text-gray-700">No recruitment closures</div>
                  <p className="text-sm mt-2">All recruitment cycles are currently active</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deletions.map(d=> (
                    <div key={d._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-3">
                            {d.jobId?.title || d.jobTitle || 'Job Position'}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🏢</span>
                              <span>Company: <span className="font-semibold text-gray-800">{d.companyId?.profile?.companyName || d.companyId?.email}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📊</span>
                              <span>Applications: <span className="font-semibold text-gray-800">{d.numApplications}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📝</span>
                              <span>Closure Reason: <span className="font-semibold text-gray-800">{d.reason}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📅</span>
                              <span>Closed On: <span className="font-semibold text-gray-800">{new Date(d.createdAt).toLocaleDateString()}</span></span>
                            </div>
                            {d.jobId?.hiredCount > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-lg">👤</span>
                                <span>Hired: <span className="font-semibold text-green-700">{d.jobId.hiredCount} candidate{d.jobId.hiredCount !== 1 ? 's' : ''}</span></span>
                              </div>
                            )}
                          </div>
                          {d.otherReason && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                              <span className="font-medium text-gray-700">Additional details: </span>
                              <span className="text-gray-600">{d.otherReason}</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                            d.status === 'finished' ? 'bg-green-100 text-green-800 border border-green-200' : 
                            d.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {d.status === 'finished' ? 'Completed' : d.status === 'pending' ? 'Pending' : d.status}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Review & Comments</label>
                        <textarea 
                          defaultValue={d.comments || ''} 
                          id={`comments-${d._id}`} 
                          className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition mb-3" 
                          rows="3"
                          placeholder="Add review notes or comments..."
                        />
                        <div className="flex gap-3">
                          <button 
                            onClick={async ()=>{ 
                              const val = document.getElementById(`comments-${d._id}`).value; 
                              await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/admin/deletion-requests/${d._id}`, { 
                                method: 'PATCH', 
                                headers: { 'Content-Type':'application/json','Authorization': `Bearer ${localStorage.getItem('token')}` }, 
                                body: JSON.stringify({ comments: val }) 
                              }); 
                              alert('Comments saved successfully!'); 
                              load(); 
                            }} 
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                          >
                            Save Comments
                          </button>
                          {d.status !== 'finished' && (
                            <button 
                              onClick={async ()=>{ 
                                await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + `/api/admin/deletion-requests/${d._id}`, { 
                                  method: 'PATCH', 
                                  headers: { 'Content-Type':'application/json','Authorization': `Bearer ${localStorage.getItem('token')}` }, 
                                  body: JSON.stringify({ status: 'finished' }) 
                                }); 
                                alert('Marked as finished!'); 
                                load(); 
                              }} 
                              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                            >
                              ✓ Mark as Finished
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'permissions' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Company Permission Requests</h2>
                <p className="text-sm text-gray-500 mt-1">Manage requests from placed students to apply to additional companies</p>
              </div>
              <div className="text-4xl">🔐</div>
            </div>

            {permissionRequests && permissionRequests.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xl font-medium text-gray-700">No permission requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(permissionRequests || []).map(req => (
                  <div key={req._id} className={`border-2 rounded-xl p-6 transition ${
                    req.status === 'Pending' ? 'border-yellow-300 bg-yellow-50' :
                    req.status === 'Approved' ? 'border-green-300 bg-green-50' :
                    'border-red-300 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {req.studentId?.profile?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">
                              {req.studentId?.profile?.name || 'Student'}
                            </h3>
                            <p className="text-sm text-gray-600">{req.studentId?.email}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Company</span>
                            <p className="font-medium text-gray-800">
                              {req.companyId?.profile?.companyName || req.companyId?.email}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Requested</span>
                            <p className="font-medium text-gray-800">
                              {new Date(req.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 bg-white bg-opacity-60 rounded-lg p-4">
                          <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Reason</span>
                          <p className="text-gray-800">{req.reason}</p>
                        </div>
                        {req.adminNote && (
                          <div className="mt-4 bg-blue-100 rounded-lg p-4">
                            <span className="text-xs font-semibold text-blue-700 uppercase block mb-2">Admin Note</span>
                            <p className="text-blue-900">{req.adminNote}</p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${
                          req.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                          req.status === 'Approved' ? 'bg-green-200 text-green-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                    {req.status === 'Pending' && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={async () => {
                            const note = prompt('Add a note (optional):');
                            await approveCompanyPermissionRequest(req._id, note || '');
                            alert('Permission approved!');
                            load();
                          }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition shadow-lg"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={async () => {
                            const note = prompt('Add a note (optional):');
                            await rejectCompanyPermissionRequest(req._id, note || '');
                            alert('Permission rejected');
                            load();
                          }}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition shadow-lg"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'stats' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Platform Statistics</h2>
                <p className="text-sm text-gray-500 mt-1">Overview of placement system metrics</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Students Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🎓</div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Students</span>
                </div>
                <div className="text-4xl font-bold text-blue-900 mb-2">{students.length}</div>
                <div className="text-sm text-blue-700">Registered Students</div>
              </div>

              {/* Companies Stats */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🏢</div>
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Companies</span>
                </div>
                <div className="text-4xl font-bold text-purple-900 mb-2">{companies.length}</div>
                <div className="text-sm text-purple-700">Registered Companies</div>
                <div className="mt-3 text-xs text-purple-600">
                  ✓ Verified: {companies.filter(c => c.company?.companyVerified).length}
                </div>
              </div>

              {/* Jobs Stats */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💼</div>
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Jobs</span>
                </div>
                <div className="text-4xl font-bold text-orange-900 mb-2">
                  {companies.reduce((sum, c) => sum + (c.jobs?.length || 0), 0)}
                </div>
                <div className="text-sm text-orange-700">Active Job Postings</div>
              </div>

              {/* Edit Requests Stats */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">✏️</div>
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Edit Requests</span>
                </div>
                <div className="text-4xl font-bold text-green-900 mb-2">
                  {credentialRequests?.filter(r => r.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-green-700">Pending Approvals</div>
              </div>

              {/* Deletion Requests Stats */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">📋</div>
                  <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Deletions</span>
                </div>
                <div className="text-4xl font-bold text-yellow-900 mb-2">
                  {deletions?.filter(d => d.status === 'pending').length || 0}
                </div>
                <div className="text-sm text-yellow-700">Pending Deletions</div>
              </div>

              {/* System Health */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🚀</div>
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Status</span>
                </div>
                <div className="text-2xl font-bold text-teal-900 mb-2">All Systems</div>
                <div className="text-sm text-teal-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Operational
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

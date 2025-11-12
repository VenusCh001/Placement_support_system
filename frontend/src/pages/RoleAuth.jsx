import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { login, register, uploadResume, parseJwtRole } from '../lib/api'
import FormField from '../components/FormField'
import Button from '../components/Button'
import { isEmail, minLength } from '../utils/validate'
import { BRANCHES, SKILLS } from '../utils/constants'

export default function RoleAuth(){
  const { role } = useParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')

  // Scroll to top when component mounts or role changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [role])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // student fields
  const [name, setName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [branch, setBranch] = useState('CSE')
  const [cgpa, setCgpa] = useState('')
  const [phone, setPhone] = useState('')
  const [skills, setSkills] = useState('')
  const [resumeFile, setResumeFile] = useState(null)

  // company fields
  const [companyName, setCompanyName] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')

  // admin fields
  const [adminCode, setAdminCode] = useState('')

  async function handleLogin(e){
    e.preventDefault(); setError(null); setSuccess(null)
    if(!isEmail(email)){ setError('Enter a valid email'); return }
    if(!minLength(password,6)){ setError('Password must be at least 6 characters'); return }
    
    try {
      const res = await login({ email, password })
      if(res?.token){
        localStorage.setItem('token', res.token)
        const tokenRole = parseJwtRole(res.token)
        const useRole = tokenRole || role
        localStorage.setItem('role', useRole)
        setSuccess('Login successful — redirecting...')
        setTimeout(()=>{
          if(useRole === 'student') navigate('/student')
          else if(useRole === 'company') navigate('/company')
          else if(useRole === 'admin') navigate('/admin')
          else navigate('/')
        }, 1100)
      } else {
        setError(res?.error || res?.msg || 'Login failed')
      }
    } catch(err) {
      console.error('Login error:', err)
      setError('Login failed: ' + (err.message || 'Network error'))
    }
  }

  async function handleRegister(e){
    e.preventDefault(); setError(null); setSuccess(null)
    if(!isEmail(email)){ setError('Enter a valid email'); return }
    if(!minLength(password,6)){ setError('Password must be at least 6 characters'); return }
    
    const payload = { email, password, role }
    if(role === 'student') payload.profile = { name, rollNumber, branch, cgpa: Number(cgpa) || 0, skills: skills.split(',').map(s=>s.trim()).filter(Boolean), phone }
    if(role === 'company') payload.profile = { companyName, phone: companyPhone, website: companyWebsite }
    if(role === 'admin') payload.profile = { adminCode }

    try {
      const res = await register(payload)
      if(res?.msg || res?.message){
        // auto-login
        const auth = await login({ email, password })
        if(auth?.token){
          localStorage.setItem('token', auth.token)
          const tokenRole = parseJwtRole(auth.token)
          localStorage.setItem('role', tokenRole || role)
          
          // Upload resume for students if provided
          try{ 
            if(role === 'student' && resumeFile){ 
              await uploadResume(resumeFile) 
            } 
          } catch(e){ 
            console.warn('resume upload failed', e) 
          }
          
          setSuccess('Registration successful — redirecting...')
          setTimeout(()=>{
            if(role === 'student') navigate('/student')
            else if(role === 'company') navigate('/company')
            else if(role === 'admin') navigate('/admin')
            else navigate('/')
          }, 1100)
          return
        } else {
          setSuccess(res.msg || res.message)
        }
      } else {
        setError(res?.error || 'Registration failed')
      }
    } catch(err) {
      console.error('Registration error:', err)
      setError('Registration failed: ' + (err.message || 'Network error'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Professional card with enhanced styling */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 overflow-hidden">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold capitalize">{role}</h2>
                <p className="text-indigo-100 dark:text-indigo-200 mt-1">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {role === 'student' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  ) : role === 'company' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Form container */}
          <div className="px-8 py-6">
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-800 dark:text-green-300 p-4 rounded mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-800 dark:text-red-300 p-4 rounded mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Mode toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
              <button 
                onClick={()=>{setMode('login'); setError(null); setSuccess(null)}} 
                className={`flex-1 py-2.5 rounded-md font-medium transition-all ${mode==='login'? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
              >
                Login
              </button>
              <button 
                onClick={()=>{setMode('register'); setError(null); setSuccess(null)}} 
                className={`flex-1 py-2.5 rounded-md font-medium transition-all ${mode==='register'? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
              >
                Register
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <FormField label="Email">
                  <input 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter your email"
                  />
                </FormField>
                <FormField label="Password">
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter your password"
                  />
                </FormField>
                <div className="pt-2">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-lg">
                    Sign In
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <FormField label="Email">
                  <input 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter your email"
                  />
                </FormField>
                <FormField label="Password">
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Create a password"
                  />
                </FormField>

                {role === 'student' && (
                  <>
                    <FormField label="Full name">
                      <input 
                        value={name} 
                        onChange={e=>setName(e.target.value)} 
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                        placeholder="Your full name"
                      />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Roll number">
                        <input 
                          value={rollNumber} 
                          onChange={e=>setRollNumber(e.target.value)} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Roll no."
                        />
                      </FormField>
                      <FormField label="Branch">
                        <select 
                          value={branch} 
                          onChange={e=>setBranch(e.target.value)} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition bg-white dark:bg-gray-700 dark:text-gray-200"
                        >
                          <option value="">Select Branch</option>
                          {BRANCHES.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="CGPA">
                        <input 
                          value={cgpa} 
                          onChange={e=>setCgpa(e.target.value)} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                          placeholder="e.g., 8.5"
                        />
                      </FormField>
                      <FormField label="Phone">
                        <input 
                          value={phone} 
                          onChange={e=>setPhone(e.target.value)} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Phone number"
                        />
                      </FormField>
                    </div>
                    <FormField label="Skills">
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Select your skills:</div>
                        <select 
                          value=""
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value && !skills.split(',').map(s => s.trim()).includes(value)) {
                              setSkills(skills ? `${skills}, ${value}` : value);
                            }
                            e.target.value = '';
                          }}
                          className="w-full border border-gray-200 dark:border-gray-600 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-600 dark:text-gray-200"
                        >
                          <option value="">Choose a skill to add...</option>
                          {SKILLS.filter(skill => !skills.split(',').map(s => s.trim()).includes(skill)).map(skill => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
                        {skills && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {skills.split(',').map((skill, idx) => skill.trim() && (
                              <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center gap-1">
                                {skill.trim()}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s !== skill.trim());
                                    setSkills(skillsArray.join(', '));
                                  }}
                                  className="hover:text-indigo-900 dark:hover:text-indigo-100 ml-1 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormField>
                    <FormField label="Resume (optional)">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={e=>setResumeFile(e.target.files[0])}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50"
                      />
                    </FormField>
                  </>
                )}

                {role === 'company' && (
                  <>
                    <FormField label="Company name">
                      <input 
                        value={companyName} 
                        onChange={e=>setCompanyName(e.target.value)} 
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                        placeholder="Your company name"
                      />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Phone">
                        <input 
                          value={companyPhone} 
                          onChange={e=>setCompanyPhone(e.target.value)} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Contact number"
                        />
                      </FormField>
                      <FormField label="Website">
                        <input 
                          value={companyWebsite} 
                          onChange={e=>setCompanyWebsite(e.target.value)} 
                          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                          placeholder="company.com"
                        />
                      </FormField>
                    </div>
                  </>
                )}

                {role === 'admin' && (
                  <FormField label="Admin code (if any)">
                    <input 
                      value={adminCode} 
                      onChange={e=>setAdminCode(e.target.value)} 
                      className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition dark:bg-gray-700 dark:text-gray-200"
                      placeholder="Optional admin verification code"
                    />
                  </FormField>
                )}

                <div className="pt-2">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-lg">
                    Create Account
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
            IGDTUW Placement Support System © 2025
          </div>
        </div>
      </div>
    </div>
  )
}

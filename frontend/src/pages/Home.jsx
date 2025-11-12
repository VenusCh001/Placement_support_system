import React from 'react'
import { Link } from 'react-router-dom'

function RoleTile({ role, gradient, description }){
  const getIcon = () => {
    switch(role) {
      case 'student':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'company':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'admin':
        return (
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  return (
    <Link to={`/auth/${role}`} className="block group">
      <div className="relative rounded-2xl overflow-hidden shadow-xl h-72 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-white z-10">
          {/* Icon */}
          <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
            {getIcon()}
          </div>
          
          {/* Title */}
          <h3 className="text-3xl font-bold capitalize mb-3">{role}</h3>
          
          {/* Description */}
          <p className="text-white/90 text-center text-sm leading-relaxed mb-4">
            {description}
          </p>
          
          {/* Call to action */}
          <div className="mt-auto mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium group-hover:bg-white/30 transition-all">
              Get Started
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
                Welcome to IGDTUW Placement Support System
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                A unified platform connecting students, companies, and administrators to streamline campus placements, job applications, and recruitment processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="#roles" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Get Started
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Cards */}
        <section id="roles" className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Choose Your Portal
            </h2>
            <p className="text-gray-600 text-lg">
              Select your role to access your personalized dashboard
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <RoleTile 
              role="student" 
              gradient="from-blue-500 via-blue-600 to-indigo-700"
              description="Access job postings, submit applications, track your progress, and manage your profile"
            />
            <RoleTile 
              role="company" 
              gradient="from-purple-500 via-purple-600 to-pink-700"
              description="Post job openings, review student applications, and connect with talented candidates"
            />
            <RoleTile 
              role="admin" 
              gradient="from-amber-500 via-orange-600 to-red-700"
              description="Manage users, oversee placement activities, generate reports, and configure system settings"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Monitor application status and get instant notifications</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Platform</h3>
              <p className="text-gray-600">Role-based access control ensuring data privacy and security</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick & Easy</h3>
              <p className="text-gray-600">Streamlined process for seamless campus recruitment</p>
            </div>
          </div>
        </section>

        {/* Statistics & Charts Section */}
        <section className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Placement Statistics & Insights
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Track our success through data-driven insights and comprehensive placement records
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Stat Card 1 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-blue-200 text-sm font-medium">2024-25</div>
              </div>
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-blue-100 text-sm">Total Students</div>
              <div className="mt-4 flex items-center text-blue-100 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +12% from last year
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-green-200 text-sm font-medium">Placement</div>
              </div>
              <div className="text-4xl font-bold mb-2">95.5%</div>
              <div className="text-green-100 text-sm">Success Rate</div>
              <div className="mt-4 flex items-center text-green-100 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                +3.2% improvement
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-purple-200 text-sm font-medium">Companies</div>
              </div>
              <div className="text-4xl font-bold mb-2">250+</div>
              <div className="text-purple-100 text-sm">Recruiters</div>
              <div className="mt-4 flex items-center text-purple-100 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                50+ new this year
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-orange-200 text-sm font-medium">Package</div>
              </div>
              <div className="text-4xl font-bold mb-2">₹45L</div>
              <div className="text-orange-100 text-sm">Highest CTC</div>
              <div className="mt-4 flex items-center text-orange-100 text-xs">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                Avg: ₹8.5 LPA
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Branch-wise Placement Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Branch-wise Placements
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Computer Science (CSE)</span>
                    <span className="text-blue-600 font-semibold">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{width: '98%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Information Technology (IT)</span>
                    <span className="text-purple-600 font-semibold">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Electronics (ECE)</span>
                    <span className="text-green-600 font-semibold">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Electrical (EE)</span>
                    <span className="text-orange-600 font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Mechanical (ME)</span>
                    <span className="text-red-600 font-semibold">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Recruiters & Sectors */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                Top Hiring Sectors
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">IT Services</div>
                      <div className="text-xs text-gray-500">Software Development</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">42%</div>
                    <div className="text-xs text-gray-500">630 offers</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Core Engineering</div>
                      <div className="text-xs text-gray-500">Product & Manufacturing</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-600">28%</div>
                    <div className="text-xs text-gray-500">420 offers</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Analytics & Consulting</div>
                      <div className="text-xs text-gray-500">Data Science & Business</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">18%</div>
                    <div className="text-xs text-gray-500">270 offers</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Finance & Banking</div>
                      <div className="text-xs text-gray-500">Fintech & Investment</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">12%</div>
                    <div className="text-xs text-gray-500">180 offers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Our Achievements
              </h2>
              <p className="text-blue-100 text-lg">
                Recognition and milestones that define our excellence
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">NAAC A+ Accredited</h3>
                <p className="text-blue-100 text-sm">Highest grade in quality education</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Top 100 Engineering</h3>
                <p className="text-blue-100 text-sm">NIRF Ranking 2024</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">₹45L Highest</h3>
                <p className="text-blue-100 text-sm">CTC offered this year</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Success Stories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hear from our successful alumni and recruiters
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The placement cell provided excellent support throughout my journey. Secured my dream job at Google!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Ananya Sharma</div>
                  <div className="text-sm text-gray-500">CSE 2023 | Google</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "IGDTUW students are technically sound and bring fresh perspectives. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Rajesh Kumar</div>
                  <div className="text-sm text-gray-500">HR Manager | Microsoft</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The platform made application tracking so easy. Got placed in my preferred company with great package!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Priya Verma</div>
                  <div className="text-sm text-gray-500">IT 2024 | Amazon</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Hire from IGDTUW Section */}
        <section className="mt-20 mb-16">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Background with pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
            </div>
            
            <div className="relative p-8 md:p-12 text-white">
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-200 text-sm font-semibold mb-4">
                  Premier Women's Technical University
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200">
                  Why Hire from IGDTUW?
                </h2>
                <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
                  Indira Gandhi Delhi Technical University for Women is a premier institution producing world-class women engineers and technology leaders
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Card 1 - Blue Theme */}
                <div className="group relative bg-gradient-to-br from-blue-600/30 to-blue-800/30 backdrop-blur-md rounded-2xl p-6 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-blue-100">Excellence in Academics</h3>
                    <p className="text-blue-200/80 text-sm leading-relaxed">
                      Top-tier curriculum with emphasis on practical learning and industry-relevant skills
                    </p>
                  </div>
                </div>
                
                {/* Card 2 - Purple Theme */}
                <div className="group relative bg-gradient-to-br from-purple-600/30 to-purple-800/30 backdrop-blur-md rounded-2xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-purple-100">Innovation & Research</h3>
                    <p className="text-purple-200/80 text-sm leading-relaxed">
                      Students engaged in cutting-edge research projects and innovative solutions
                    </p>
                  </div>
                </div>
                
                {/* Card 3 - Teal Theme */}
                <div className="group relative bg-gradient-to-br from-teal-600/30 to-teal-800/30 backdrop-blur-md rounded-2xl p-6 border border-teal-400/20 hover:border-teal-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-teal-100">Diverse Talent Pool</h3>
                    <p className="text-teal-200/80 text-sm leading-relaxed">
                      Students from multiple engineering branches with varied skill sets and expertise
                    </p>
                  </div>
                </div>
                
                {/* Card 4 - Orange Theme */}
                <div className="group relative bg-gradient-to-br from-orange-600/30 to-orange-800/30 backdrop-blur-md rounded-2xl p-6 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-orange-100">Industry Ready</h3>
                    <p className="text-orange-200/80 text-sm leading-relaxed">
                      Strong emphasis on internships, projects, and practical exposure to real-world challenges
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                    <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200 mb-2">1500+</div>
                    <div className="text-blue-100 font-medium">Students Enrolled</div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                    <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 mb-2">95%+</div>
                    <div className="text-purple-100 font-medium">Placement Rate</div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                    <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-emerald-200 mb-2">200+</div>
                    <div className="text-teal-100 font-medium">Recruiting Companies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Past Recruiters Section */}
        <section className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Past Recruiters
            </h2>
            <p className="text-gray-600 text-lg">
              Join the league of top companies that have recruited from IGDTUW
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 overflow-hidden">
            {/* Scrolling logos animation */}
            <div className="relative">
              <div className="flex animate-scroll">
                {/* First set of logos */}
                <div className="flex items-center gap-12 px-6">
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">Microsoft</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">Google</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">Amazon</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">Adobe</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">IBM</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">Infosys</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-800">TCS</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">Wipro</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">Oracle</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">Accenture</div>
                    </div>
                  </div>
                </div>
                
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center gap-12 px-6">
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">Microsoft</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">Google</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">Amazon</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">Adobe</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700">IBM</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">Infosys</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-800">TCS</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">Wipro</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">Oracle</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">Accenture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 italic">
                And many more leading organizations from various sectors including IT, Finance, Consulting, and Core Engineering
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

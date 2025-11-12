import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

/**
 * Role-aware top navigation
 * - Shows different links based on the current user's role stored in localStorage or encoded in the JWT
 * - Keeps UI simple: Student / Company / Admin portals and auth links
 */
export default function NavBar({ darkMode, toggleDarkMode }){
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Try to parse role from JWT if role not explicitly saved in localStorage
  try{ if(!role && token){ const payload = JSON.parse(atob(token.split('.')[1])); role = payload.role } }catch(e){}

  function logout(){
    // Clear client-side session and navigate to home
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setMobileMenuOpen(false);
    navigate('/');
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/igdtuw-logo.png" 
                alt="IGDTUW Logo" 
                className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  IGDTUW
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Placement Portal</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home Link */}
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Home
            </Link>

            {/* Role-specific links */}
            {token && role === 'student' && (
              <Link 
                to="/student" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/student')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'company' && (
              <Link 
                to="/company" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/company')
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side - Auth/User section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {!token ? (
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/#roles" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Login
                </Link>
                <Link 
                  to="/#roles" 
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      role === 'student' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                      role === 'company' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      'bg-gradient-to-br from-orange-500 to-red-600'
                    }`}>
                      {name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{name || 'User'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={logout} 
                    className="ml-2 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Home
            </Link>

            {token && role === 'student' && (
              <Link 
                to="/student" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/student')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'company' && (
              <Link 
                to="/company" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/company')
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
            {token && role === 'admin' && (
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}

            {!token ? (
              <>
                <Link 
                  to="/#roles" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Login
                </Link>
                <Link 
                  to="/#roles" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="px-4 py-2 flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    role === 'student' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                    role === 'company' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                    'bg-gradient-to-br from-orange-500 to-red-600'
                  }`}>
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{name || 'User'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</div>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

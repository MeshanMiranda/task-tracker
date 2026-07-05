import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import ConfirmationModal from './components/ConfirmationModal';
import logo from './assets/task_tracker_logo.png';

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col font-sans">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-tight">
            <img src={logo} alt="TaskTracker Logo" className="h-10 w-10 object-contain" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">TaskTracker</span>
          </Link>
          <nav>
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Tasks
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/users" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Users
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'User'}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md transform transition hover:scale-105">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || 'User Name'}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">@{user?.username || 'username'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{user?.email || 'user@example.com'}</p>
                      </div>

                      <div className="py-2">
                        <div className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
                          <button
                            onClick={toggleDarkMode}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isDarkMode ? 'bg-purple-600' : 'bg-gray-300'}`}
                          >
                            <div className={`bg-white dark:bg-gray-800 w-4 h-4 rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-5' : ''}`}></div>
                          </button>
                        </div>

                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Settings
                        </button>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                        <button
                          onClick={() => {
                            setIsLogoutModalOpen(true);
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="w-full mx-auto py-6 px-4 sm:px-8 lg:px-16 xl:px-24">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; 2026 TaskTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;

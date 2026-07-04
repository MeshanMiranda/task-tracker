import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
            TaskTracker
          </Link>
          <nav>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link to="/tasks" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Tasks
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/users" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Users
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
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
                <div className="flex-grow flex items-center justify-center p-4">
                  <div className="text-center max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                      Dashboard
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                      Welcome to your task tracker. Navigate to Tasks to manage your work.
                    </p>
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                      <div className="bg-white rounded-full px-6 py-2 text-sm font-bold text-emerald-600">
                        Authentication Active
                      </div>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
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
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
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

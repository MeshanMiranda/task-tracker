import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/'); // Redirect to dashboard or home
    } catch (error) {
      // Error is handled by context/toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Sign in to manage your tasks
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all`}
                placeholder="johndoe"
                {...register("username", { 
                  required: "Username is required"
                })}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all`}
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-pink-400 hover:text-pink-300 transition-colors">
              Sign up now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

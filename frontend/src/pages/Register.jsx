import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { register: registerForm, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const { register } = useAuth();
  const navigate = useNavigate();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      await register({ name: data.name, username: data.username, email: data.email, password: data.password });
      navigate('/');
    } catch (error) {

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-indigo-900 via-purple-900 to-black text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Join us and start tracking your tasks
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                placeholder="John Doe"
                {...registerForm("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                placeholder="johndoe"
                {...registerForm("username", { required: "Username is required" })}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                placeholder="you@example.com"
                {...registerForm("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
                {...registerForm("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`appearance-none block w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
                {...registerForm("confirmPassword", {
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Sign in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

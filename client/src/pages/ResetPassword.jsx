import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // In a real app, you would send the token to the backend
      // For this demo, we'll simulate the update since we used a dummy token
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        token, 
        password 
      });
      
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl p-10 border border-gray-50 dark:border-gray-900"
      >
        <div className="text-center mb-10">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
            alt="Nike" 
            className="h-6 mx-auto mb-6 dark:invert"
          />
          <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">CREATE NEW PASSWORD</h1>
          <p className="text-gray-500 mt-4 text-sm font-medium">Please enter your new password below.</p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full">
                <CheckCircle size={48} />
              </div>
            </div>
            <h2 className="text-xl font-bold dark:text-white">Password Updated!</h2>
            <p className="text-gray-500 text-sm">Your password has been changed successfully. Redirecting you to login...</p>
            <Link to="/login" className="block text-black dark:text-white font-black underline underline-offset-4 uppercase text-xs tracking-widest">
              Go to Login Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
              <input
                type="password"
                placeholder="New Password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-900 dark:bg-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
              <input
                type="password"
                placeholder="Confirm New Password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-900 dark:bg-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all font-medium"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-black uppercase tracking-tight flex items-center justify-center space-x-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              <span>{isLoading ? 'Updating...' : 'Reset Password'}</span>
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;

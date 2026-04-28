import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { forgotPassword } from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl p-10 border border-gray-50 dark:border-gray-900"
      >
        <div className="text-center mb-10">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
            alt="Nike" 
            className="h-6 mx-auto mb-6 dark:invert"
          />
          <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">RESET PASSWORD</h1>
          {!isSubmitted ? (
            <p className="text-gray-500 mt-4 text-sm font-medium">Enter your email to receive a password reset link.</p>
          ) : (
            <p className="text-green-500 mt-4 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              Reset link sent to your email!
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-900 dark:bg-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-black uppercase tracking-tight flex items-center justify-center space-x-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              We've sent a recovery email to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-black dark:text-white font-black underline underline-offset-4 uppercase text-xs tracking-widest"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-900 text-center">
          <Link to="/login" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

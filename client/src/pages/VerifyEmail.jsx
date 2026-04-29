import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found.');
        return;
      }

      const result = await verifyEmail(token);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        // Automatically redirect to home after 3 seconds since they are now logged in
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    performVerification();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl p-10 border border-gray-50 dark:border-gray-900 text-center"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
          alt="Nike" 
          className="h-6 mx-auto mb-10 dark:invert"
        />

        {status === 'verifying' && (
          <div className="py-10">
            <Loader2 className="h-16 w-16 mx-auto mb-6 text-black dark:text-white animate-spin" />
            <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Verifying your email...</h1>
            <p className="text-gray-500 mt-4 font-medium">Please wait while we confirm your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-10">
            <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-500" />
            <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Account Verified</h1>
            <p className="text-gray-500 mt-4 font-medium">{message}</p>
            <p className="text-sm text-gray-400 mt-2">Redirecting you to the store...</p>
            <Link 
              to="/" 
              className="mt-10 inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black uppercase tracking-tight hover:opacity-90 transition-all active:scale-95"
            >
              <span>Go to Shop</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-10">
            <XCircle className="h-20 w-20 mx-auto mb-6 text-red-500" />
            <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Verification Failed</h1>
            <p className="text-gray-500 mt-4 font-medium">{message}</p>
            <div className="mt-10 space-y-4">
              <Link 
                to="/signup" 
                className="block w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-black uppercase tracking-tight hover:opacity-90 transition-all active:scale-95"
              >
                Try Signing Up Again
              </Link>
              <Link 
                to="/login" 
                className="block w-full border-2 border-gray-100 dark:border-gray-800 text-black dark:text-white py-4 rounded-full font-black uppercase tracking-tight hover:bg-gray-50 dark:hover:bg-gray-900 transition-all active:scale-95"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

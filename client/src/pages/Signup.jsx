import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
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
          <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">BECOME A NIKE MEMBER</h1>
          <p className="text-gray-500 mt-4 text-sm font-medium">Create your Nike Member profile and get first access to the very best of Nike products, inspiration and community.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
            <input
              type="text"
              placeholder="First & Last Name"
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-900 dark:bg-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-900 dark:bg-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-50 dark:border-gray-900 dark:bg-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center pt-2 leading-relaxed">
            By creating an account, you agree to Nike's <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms of Use</a>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-black uppercase tracking-tight flex items-center justify-center space-x-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 mt-8"
          >
            <span>{isLoading ? 'Creating Account...' : 'Join Us'}</span>
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-500 font-medium">
          Already a Member? {' '}
          <Link to="/login" className="text-black dark:text-white font-black underline underline-offset-4">Sign In.</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;

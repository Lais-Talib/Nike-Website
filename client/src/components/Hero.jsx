import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Nike Hero" 
          className="w-full h-full object-cover object-center brightness-90 dark:brightness-[0.4] transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60 dark:to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="inline-block font-black uppercase tracking-[0.4em] text-white/70 text-xs md:text-sm mb-6">
            New Arrival: Air Jordan 1
          </span>
          <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl">
            WIN FROM<br/>WITHIN
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-2xl text-white font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Push your limits with the latest innovation in performance footwear. Built for those who never stop.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link to="/category/men" className="w-full sm:w-auto">
            <button className="bg-white text-black font-black uppercase tracking-tight py-5 px-12 rounded-full hover:bg-gray-100 transition-all w-full transform hover:scale-105 active:scale-95 shadow-2xl">
              Shop Men
            </button>
          </Link>
          <Link to="/category/women" className="w-full sm:w-auto">
            <button className="bg-transparent border-2 border-white text-white font-black uppercase tracking-tight py-5 px-12 rounded-full hover:bg-white hover:text-black transition-all w-full transform hover:scale-105 active:scale-95">
              Shop Women
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Side Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default Hero;

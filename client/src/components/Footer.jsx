import React from 'react';
import { MessageCircle, Share2, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
            alt="Nike" 
            className="h-8 w-auto invert"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase text-sm tracking-wider">Find A Store</h4>
            <h4 className="font-bold uppercase text-sm tracking-wider">Become A Member</h4>
            <h4 className="font-bold uppercase text-sm tracking-wider">Sign Up for Email</h4>
            <h4 className="font-bold uppercase text-sm tracking-wider">Send Us Feedback</h4>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="font-bold uppercase text-sm tracking-wider mb-4">Get Help</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Order Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Payment Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h4 className="font-bold uppercase text-sm tracking-wider mb-4">About Nike</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>
          
          {/* Column 4 - Socials */}
          <div className="flex space-x-4 md:justify-end">
            <a href="#" className="h-10 w-10 bg-gray-500 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300">
              <Globe size={20} />
            </a>
            <a href="#" className="h-10 w-10 bg-gray-500 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="h-10 w-10 bg-gray-500 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300">
              <Share2 size={20} />
            </a>
            <a href="#" className="h-10 w-10 bg-gray-500 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300">
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-white">📍 India</span>
            <span>© 2026 Nike, Inc. All Rights Reserved</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Guides</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Sale</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Nike Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

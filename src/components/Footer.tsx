import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative pt-20 pb-10 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">MeICO</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Building the future of decentralized finance and digital entertainment.Join us as we bridge the gap between culture and crypto, one block at a time.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61566317977775" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/mecoinen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/mecoinen/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Home
                    </Link>
                  </li>
                  <li>
                    <a href="https://www.mecoin.site/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> About Us
                    </a>
                  </li>
                  <li>
                    <Link to="/active-ico" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> ICO's
                    </Link>
                  </li>
                  <li>
                    <a href="https://icopol.mecoin.site/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Get MeCoin
                    </a>
                  </li>
                  <li>
                    <a href="https://info.mecoin.site/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Other Info
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link to="/tokenomics" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Tokenomics
                    </Link>
                  </li>
                  <li>
                    <a href="https://info.mecoin.site/project/editor" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Ecosystem
                    </a>
                  </li>
                  <li>
                    <Link to="/testimonials" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                      <span className="mr-2">›</span> Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-use" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Sitemap
                </Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center">
                  <span className="mr-2">›</span> Career
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Subscribe to our newsletter to get all our news in your inbox. We value your privacy and promise no spam—just valuable information tailored for you.
            </p>
            
            <form className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-5 py-3 text-gray-900 dark:text-white pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-300 dark:border-gray-600 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © Copyright 2024 | All Rights Reserved by <a href="https://www.mecoin.site/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">mecoin.site</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
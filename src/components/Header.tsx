import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import LoginModal from './auth/LoginModal';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [networksDropdownOpen, setNetworksDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  const location = useLocation();
  const { user, signOut, loading, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openLoginModal = (mode: 'signin' | 'signup' | 'forgot') => {
    setLoginMode(mode);
    setLoginModalOpen(true);
  };

  return (
    <>
      <header className={`fixed w-full transition-all duration-300 z-50 ${
        isScrolled 
          ? 'bg-dark-bg/95 backdrop-blur-md py-3 shadow-lg border-b border-dark-accent1/20' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="MeICO Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-2xl font-bold gradient-text">
                MeICO
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className={`transition-colors ${
                    isActive('/') 
                      ? 'text-dark-accent2' 
                      : isScrolled 
                        ? 'text-dark-text hover:text-dark-accent2' 
                        : 'text-dark-text hover:text-dark-accent2'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/active-ico" 
                  className={`transition-colors ${
                    isActive('/active-ico') 
                      ? 'text-dark-accent2' 
                      : isScrolled 
                        ? 'text-dark-text hover:text-dark-accent2' 
                        : 'text-dark-text hover:text-dark-accent2'
                  }`}
                >
                  Active ICO
                </Link>
                <Link 
                  to="/services" 
                  className={`transition-colors ${
                    isActive('/services') 
                      ? 'text-dark-accent2' 
                      : isScrolled 
                        ? 'text-dark-text hover:text-dark-accent2' 
                        : 'text-dark-text hover:text-dark-accent2'
                  }`}
                >
                  Services
                </Link>
                
                <div className="relative group">
                  <button 
                    onClick={() => setNetworksDropdownOpen(!networksDropdownOpen)}
                    className={`flex items-center transition-colors ${
                      isScrolled 
                        ? 'text-dark-text hover:text-dark-accent2' 
                        : 'text-dark-text hover:text-dark-accent2'
                    }`}
                  >
                    Networks <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-dark-bg border border-dark-accent1/20 transition-all duration-200 ${networksDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="py-1">
                      <Link to="/networks/ethereum" className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10">Ethereum</Link>
                      <Link to="/networks/binance" className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10">Binance</Link>
                      <Link to="/networks/coinbase" className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10">Coinbase</Link>
                      <Link to="/networks/polygon" className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10">Polygon</Link>
                      <Link to="/networks/arbitrum" className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10">Arbitrum</Link>
                      <Link to="/networks/blast" className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10">BLAST</Link>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/contact" 
                  className={`transition-colors ${
                    isActive('/contact') 
                      ? 'text-dark-accent2' 
                      : isScrolled 
                        ? 'text-dark-text hover:text-dark-accent2' 
                        : 'text-dark-text hover:text-dark-accent2'
                  }`}
                >
                  Contact Us
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                {/* Auth Section */}
                {loading ? (
                  <div className="w-8 h-8 custom-spinner"></div>
                ) : user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center px-4 py-2 rounded-full bg-dark-button hover:bg-dark-button/80 text-dark-text font-medium transition-all"
                    >
                      {isAdmin && <Shield className="w-4 h-4 mr-2 text-yellow-400" />}
                      <User className="w-4 h-4 mr-2" />
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>

                    {userDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setUserDropdownOpen(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-dark-bg border border-dark-accent1/20 z-50">
                          <div className="py-1">
                            <Link
                              to="/dashboard"
                              className="block px-4 py-2 text-sm text-dark-text hover:bg-dark-accent1/10"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Dashboard
                            </Link>
                            {isAdmin && (
                              <Link
                                to="/admin"
                                className="flex items-center px-4 py-2 text-sm text-yellow-400 hover:bg-dark-accent1/10"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Panel
                              </Link>
                            )}
                            <button
                              onClick={handleSignOut}
                              className="flex items-center w-full px-4 py-2 text-sm text-dark-accent2 hover:bg-dark-accent1/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openLoginModal('signin')}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        isScrolled
                          ? 'text-dark-text hover:text-dark-accent2'
                          : 'text-dark-text hover:text-dark-accent2'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openLoginModal('signup')}
                      className="btn-primary"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 ${
                  isScrolled 
                    ? 'text-dark-text' 
                    : 'text-dark-text'
                }`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-2 bg-dark-bg/95 backdrop-blur-md space-y-3 border-t border-dark-accent1/20">
            <Link to="/" className="block py-2 text-dark-text">Home</Link>
            <Link to="/active-ico" className="block py-2 text-dark-text">Active ICO</Link>
            <Link to="/services" className="block py-2 text-dark-text">Services</Link>
            
            <div>
              <button 
                onClick={() => setNetworksDropdownOpen(!networksDropdownOpen)}
                className="flex items-center py-2 w-full text-dark-text"
              >
                Networks <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className={`pl-4 space-y-1 transition-all duration-200 ${networksDropdownOpen ? 'block' : 'hidden'}`}>
                <Link to="/networks/ethereum" className="block py-1 text-sm text-dark-text/80">Ethereum</Link>
                <Link to="/networks/binance" className="block py-1 text-sm text-dark-text/80">Binance</Link>
                <Link to="/networks/coinbase" className="block py-1 text-sm text-dark-text/80">Coinbase</Link>
                <Link to="/networks/polygon" className="block py-1 text-sm text-dark-text/80">Polygon</Link>
                <Link to="/networks/arbitrum" className="block py-1 text-sm text-dark-text/80">Arbitrum</Link>
                <Link to="/networks/blast" className="block py-1 text-sm text-dark-text/80">BLAST</Link>
              </div>
            </div>
            
            <Link to="/contact" className="block py-2 text-dark-text">Contact Us</Link>
            
            {user ? (
              <div className="space-y-2 pt-4 border-t border-dark-accent1/20">
                <Link
                  to="/dashboard"
                  className="block py-2 text-dark-text"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center py-2 text-yellow-400"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 text-dark-accent2"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 mt-4 mb-2">
                <button
                  onClick={() => openLoginModal('signin')}
                  className="flex-1 py-2 px-4 text-center rounded-lg border border-dark-accent1 text-dark-accent1 hover:bg-dark-accent1/10"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openLoginModal('signup')}
                  className="flex-1 py-2 px-4 text-center rounded-lg btn-custom"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        initialMode={loginMode}
      />
    </>
  );
};

export default Header;
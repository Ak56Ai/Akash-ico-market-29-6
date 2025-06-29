import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: '',
    customCountry: '',
    acceptTerms: false
  });

  const { signIn, signUp, resetPassword } = useAuth();

  // List of 20 countries
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
    'Japan', 'Australia', 'Brazil', 'India', 'China',
    'South Korea', 'Netherlands', 'Sweden', 'Switzerland', 'Singapore',
    'New Zealand', 'Norway', 'Denmark', 'Finland', 'Austria'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signin') {
        console.log('Attempting sign in for:', formData.email);
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        setMessage('Successfully signed in!');
        setMessageType('success');
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!formData.acceptTerms) {
          throw new Error('Please accept the terms and conditions');
        }
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          throw new Error('Please enter your first and last name');
        }
        
        const selectedCountry = formData.country === 'Other' ? formData.customCountry : formData.country;
        if (!selectedCountry.trim()) {
          throw new Error('Please select or enter your country');
        }
        
        console.log('Attempting sign up for:', formData.email, 'with data:', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: selectedCountry
        });
        
        const { error } = await signUp(formData.email, formData.password, {
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          country: selectedCountry.trim()
        });
        
        if (error) throw error;
        
        setMessage('Account created successfully! Please check your email for verification.');
        setMessageType('success');
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          country: '',
          customCountry: '',
          acceptTerms: false
        });
      } else if (mode === 'forgot') {
        console.log('Attempting password reset for:', formData.email);
        const { error } = await resetPassword(formData.email);
        if (error) throw error;
        setMessage('Password reset email sent! Check your inbox.');
        setMessageType('success');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage(error.message || 'An error occurred');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  const getImageAndText = () => {
    switch (mode) {
      case 'signup':
        return {
          image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
          title: 'Join the Future',
          subtitle: 'Create your account and start your crypto journey with us',
          description: 'Access exclusive ICO opportunities and be part of the next generation of blockchain innovation.'
        };
      case 'forgot':
        return {
          image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
          title: 'Reset Password',
          subtitle: 'Secure your account',
          description: 'Enter your email address and we\'ll send you a link to reset your password securely.'
        };
      default:
        return {
          image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
          title: 'Welcome Back',
          subtitle: 'Sign in to your account',
          description: 'Continue your crypto investment journey and access your personalized dashboard.'
        };
    }
  };

  const { image, title, subtitle, description } = getImageAndText();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-bg shadow-xl rounded-2xl">
          <div className="flex min-h-[600px]">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
              <img 
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{title}</h2>
                <p className="text-xl mb-4 text-dark-accent1">{subtitle}</p>
                <p className="text-dark-text/80 leading-relaxed">{description}</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-dark-text">
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Reset Password'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-dark-text/60 hover:text-dark-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  messageType === 'success'
                    ? 'bg-green-900/20 text-green-400 border border-green-700'
                    : 'bg-red-900/20 text-red-400 border border-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-text/80 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent"
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-text/80 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-text/80 mb-2">
                        Country *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent appearance-none"
                        >
                          <option value="">Select your country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                          <option value="Other">Other (specify below)</option>
                        </select>
                      </div>
                    </div>

                    {formData.country === 'Other' && (
                      <div>
                        <label className="block text-sm font-medium text-dark-text/80 mb-2">
                          Enter Country Name *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                          <input
                            type="text"
                            name="customCountry"
                            value={formData.customCountry}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent"
                            placeholder="Enter your country name"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-dark-text/80 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-sm font-medium text-dark-text/80 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 hover:text-dark-accent2"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-dark-text/80 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-accent1 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-dark-accent1/30 rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-dark-accent2 focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 text-dark-accent2 border-dark-accent1/30 rounded focus:ring-dark-accent2 mt-1"
                    />
                    <label className="ml-3 text-sm text-dark-text/80">
                      I agree to the{' '}
                      <a href="/terms-of-use" className="text-dark-accent2 hover:text-dark-accent2/80">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" className="text-dark-accent2 hover:text-dark-accent2/80">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg bg-dark-button hover:bg-dark-button/80 text-dark-text font-medium transition-all transform hover:scale-105 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-dark-text mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Email'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                {mode === 'signin' && (
                  <>
                    <button
                      onClick={() => setMode('forgot')}
                      className="text-dark-accent2 hover:text-dark-accent2/80 text-sm mb-4 block mx-auto"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-sm text-dark-text/60">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setMode('signup')}
                        className="text-dark-accent2 hover:text-dark-accent2/80 font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}

                {mode === 'signup' && (
                  <p className="text-sm text-dark-text/60">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="text-dark-accent2 hover:text-dark-accent2/80 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}

                {mode === 'forgot' && (
                  <button
                    onClick={() => setMode('signin')}
                    className="flex items-center justify-center mx-auto text-dark-accent2 hover:text-dark-accent2/80 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to sign in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
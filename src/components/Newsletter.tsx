import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    
    try {
      console.log('Submitting newsletter subscription...', { email: email.trim() });

      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ 
          email: email.trim(),
          subscribed_at: new Date().toISOString(),
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Newsletter subscription error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        if (error.code === '23505') { // Unique constraint violation
          setMessage('This email is already subscribed!');
          setMessageType('error');
        } else {
          throw error;
        }
      } else {
        console.log('Newsletter subscription successful:', data);
        setMessage('Thank you for subscribing!');
        setMessageType('success');
        setEmail('');
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setMessage(`Failed to subscribe: ${error.message || 'Please try again.'}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gray-900/90 dark:bg-gray-900/90">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/30 to-purple-900/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-800/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-white mb-2">Sign up for newsletter</h3>
              <p className="text-gray-300">
                By signing up, you'll receive the latest updates directly in your inbox. We value your privacy and promise no spam—just valuable information tailored for you.
              </p>
            </div>
            
            <div className="w-full md:w-1/2">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your email address"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-full px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {message && (
                    <div className={`absolute -bottom-7 left-0 text-sm ${
                      messageType === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {message}
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
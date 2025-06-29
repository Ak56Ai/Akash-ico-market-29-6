import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import PaymentModal from './payment/PaymentModal';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';

const DetailedPricing: React.FC = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'silver' | 'gold'>('silver');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user } = useAuth();

  const plans = [
    {
      title: 'Base Plan',
      price: 'FREE',
      icon: '📋',
      planType: null,
      features: [
        { text: 'Standard project listing on our platform.', included: true },
        { text: 'Visibility in the general ICO directory.', included: true },
        { text: 'Basic analytics to track views and engagement.', included: true },
        { text: '24/7 customer support for technical assistance.', included: false },
        { text: 'Priority support with a dedicated account manager.', included: false }
      ]
    },
    {
      title: 'Silver Plan',
      price: '100',
      currency: 'Mecoin',
      icon: '🥈',
      planType: 'silver' as const,
      features: [
        { text: 'Enhanced visibility with priority placement in the "Silver Projects" section.', included: true },
        { text: 'Dedicated project page with custom branding (logo, banner, and description).', included: true },
        { text: 'Advanced analytics, including investor engagement data.', included: true },
        { text: '24/7 customer support for technical assistance.', included: false },
        { text: 'Priority support with a dedicated account manager.', included: false }
      ]
    },
    {
      title: 'Gold Plan',
      price: '500',
      currency: 'MECOIN',
      icon: '🏆',
      planType: 'gold' as const,
      features: [
        { text: 'Maximum exposure with "Gold Spotlight" placement on the homepage.', included: true },
        { text: 'Featured in promotional email campaigns and push notifications.', included: true },
        { text: 'Premium project page with full customization and video integration.', included: true },
        { text: 'Full analytics suite to track investments and investor demographics.', included: true },
        { text: 'Priority support with a dedicated account manager.', included: true }
      ]
    }
  ];

  const handleGetNow = (plan: any) => {
    if (plan.planType) {
      if (!user) {
        setLoginModalOpen(true);
        return;
      }
      setSelectedPlan(plan.planType);
      setPaymentModalOpen(true);
    }
  };

  return (
    <>
      <section className="py-24 relative overflow-hidden bg-gray-100 dark:bg-gray-900/80">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-5 bg-cover bg-fixed"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">ICO Listing Plans</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Choose the perfect plan to launch your ICO and maximize visibility! Whether you're just starting out or looking for premium exposure, we have the right solution for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className="relative group transform transition-all duration-300 hover:scale-105 hover:z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                
                <div className="relative h-full rounded-3xl p-1">
                  <div className="h-full rounded-2xl bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden">
                    {/* Header */}
                    <div className="pt-8 pb-4 px-6 text-center relative">
                      <div className="text-4xl mb-3">{plan.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                          {plan.price}
                        </span>
                        {plan.currency && (
                          <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm">{plan.currency}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Feature list */}
                    <div className="px-6 pb-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start">
                            {feature.included ? (
                              <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                            )}
                            <span className={feature.included ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Button */}
                    <div className="px-6 pb-8 pt-4">
                      <button 
                        onClick={() => handleGetNow(plan)}
                        disabled={!plan.planType}
                        className={`block w-full py-3 px-4 text-center rounded-full font-medium transition-all transform hover:scale-[1.02] ${
                          plan.planType 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600' 
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {plan.planType ? 'Get Now' : 'Current Plan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        planType={selectedPlan}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialMode="signin"
      />
    </>
  );
};

export default DetailedPricing;
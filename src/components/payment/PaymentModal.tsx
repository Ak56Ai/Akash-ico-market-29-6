import React, { useState } from 'react';
import { X, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'silver' | 'gold';
}

interface CurrencyRate {
  symbol: string;
  name: string;
  rate: number; // Rate in terms of MeCoin
  icon: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planType }) => {
  const [showCheckout, setShowCheckout] = useState(false);

  const handleGetNow = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    onClose();
  };

  if (showCheckout) {
    return (
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
        planType={planType}
      />
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upgrade to {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">
                  {planType === 'silver' ? '🥈' : '🏆'}
                </span>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {planType === 'silver' ? 'Silver Plan' : 'Gold Plan'}
              </h4>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {planType === 'silver' 
                  ? 'Enhanced visibility with priority placement and custom branding.'
                  : 'Maximum exposure with homepage spotlight and premium features.'
                }
              </p>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {planType === 'silver' ? '100' : '500'} MeCoin
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  One-time payment
                </div>
              </div>

              <button
                onClick={handleGetNow}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
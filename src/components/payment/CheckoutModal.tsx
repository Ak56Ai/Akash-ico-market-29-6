import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, AlertCircle, QrCode, CreditCard, Coins } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'silver' | 'gold';
}

interface CurrencyRate {
  id: string;
  symbol: string;
  name: string;
  rate: number;
  icon: string;
  logo_url: string;
  is_active: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  planType: string;
  currency: string;
  amount: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  planType, 
  currency, 
  amount 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-75"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Purchase
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Plan:</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{planType} Plan</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 mt-3">Amount:</p>
              <p className="font-semibold text-gray-900 dark:text-white">{amount} {currency}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to proceed with this purchase?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planType }) => {
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState('MECOIN');
  const [amount, setAmount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);

  const planAmounts = {
    silver: 100,
    gold: 500
  };

  const walletAddress = "0x008EE20B704DfDD5019E4C115683b691b4587FEb";

  useEffect(() => {
    if (isOpen) {
      setAmount(planAmounts[planType]);
      fetchCurrencies();
    }
  }, [isOpen, planType]);

  useEffect(() => {
    if (currencies.length > 0) {
      generateQRCode();
    }
  }, [selectedCurrency, currencies]);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('accepted_currencies')
        .select('*')
        .eq('is_active', true)
        .order('symbol');

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      // Fallback to default currencies
      setCurrencies([
        { 
          id: '1',
          symbol: 'MECOIN', 
          name: 'MeCoin', 
          rate: 1, 
          icon: '🪙',
          logo_url: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          is_active: true
        },
        { 
          id: '2',
          symbol: 'USDT', 
          name: 'Tether USD', 
          rate: 0.022, 
          icon: '₮',
          logo_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          is_active: true
        },
        { 
          id: '3',
          symbol: 'USDC', 
          name: 'USD Coin', 
          rate: 0.022, 
          icon: '💵',
          logo_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
          is_active: true
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const qrData = `ethereum:${walletAddress}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const calculateConversion = (mecoinAmount: number, targetCurrency: string) => {
    const currency = currencies.find(c => c.symbol === targetCurrency);
    const rate = currency?.rate || 1;
    return (mecoinAmount * rate).toFixed(6);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmitTransaction = () => {
    if (!txHash.trim()) {
      alert('Please enter a transaction hash');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmPurchase = async () => {
    if (!user) {
      alert('Please sign in to continue');
      return;
    }

    setSubmitting(true);
    setShowConfirmation(false);
    
    try {
      const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency);
      const amountPaid = parseFloat(calculateConversion(amount, selectedCurrency));

      // Insert purchase record
      const { data, error } = await supabase
        .from('plan_purchases')
        .insert([{
          user_id: user.id,
          plan_type: planType,
          currency_symbol: selectedCurrency,
          amount_paid: amountPaid,
          mecoin_equivalent: amount,
          transaction_hash: txHash.trim(),
          payment_address: walletAddress,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('Purchase record created:', data);
      
      setSubmitting(false);
      setShowSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Reset form
        setTxHash('');
        setSelectedCurrency('MECOIN');
      }, 3000);
    } catch (error) {
      console.error('Error submitting purchase:', error);
      setSubmitting(false);
      alert('Error submitting purchase. Please try again.');
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-75"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-gray-900 dark:text-white">Loading payment options...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Checkout - {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Plan Details & Payment Options */}
              <div className="space-y-6">
                {/* Plan Summary */}
                <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <Coins className="w-5 h-5 mr-2" />
                    {planType === 'silver' ? 'Silver Plan' : 'Gold Plan'}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>✅ Enhanced visibility and priority placement</p>
                    <p>✅ Custom branding and dedicated project page</p>
                    <p>✅ Advanced analytics and engagement data</p>
                    {planType === 'gold' && (
                      <>
                        <p>✅ Homepage spotlight placement</p>
                        <p>✅ Featured in promotional campaigns</p>
                        <p>✅ Premium customization options</p>
                        <p>✅ Priority support with account manager</p>
                      </>
                    )}
                  </div>
                  <div className="mt-3 text-lg font-bold text-purple-600 dark:text-purple-400">
                    Total: {planAmounts[planType]} MeCoin
                  </div>
                </div>

                {/* Currency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Currency
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {currencies.map((currency) => (
                      <button
                        key={currency.id}
                        onClick={() => setSelectedCurrency(currency.symbol)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCurrency === currency.symbol
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={currency.logo_url} 
                              alt={currency.symbol}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-sm font-bold hidden"
                            >
                              {currency.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {currency.symbol}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {currency.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900 dark:text-white">
                              {calculateConversion(amount, currency.symbol)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {currency.symbol}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exchange Rate Table */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Current Exchange Rates (1 MeCoin =)
                  </h5>
                  <div className="space-y-2">
                    {currencies.map((currency) => (
                      <div key={currency.id} className="flex justify-between items-center py-1">
                        <span className="flex items-center space-x-2 text-sm">
                          <span>{currency.icon}</span>
                          <span className="font-medium">{currency.symbol}</span>
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {currency.rate} {currency.symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Details */}
              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center justify-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Scan to Pay
                  </h5>
                  <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                    {qrCodeUrl && (
                      <img 
                        src={qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-48 h-48 mx-auto"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Scan with your wallet app to pay
                  </p>
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or send {selectedCurrency} to this address:
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm break-all">
                      {walletAddress}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      title="Copy address"
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Address copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Payment Amount */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-800 dark:text-blue-200">Amount to send:</span>
                    <span className="font-bold text-xl text-blue-900 dark:text-blue-100">
                      {calculateConversion(amount, selectedCurrency)} {selectedCurrency}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Equivalent to {amount} MeCoin
                  </div>
                </div>

                {/* Transaction Hash Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submit Transaction Hash
                  </label>
                  <textarea
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste your transaction hash here after sending the payment..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitTransaction}
                  disabled={!txHash.trim() || submitting}
                  className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all transform hover:scale-105 ${
                    (!txHash.trim() || submitting) ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing Purchase...
                    </div>
                  ) : (
                    'Submit Payment'
                  )}
                </button>

                {/* Instructions */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <p className="font-medium mb-1">Payment Instructions:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Send exactly {calculateConversion(amount, selectedCurrency)} {selectedCurrency} to the address above</li>
                        <li>Copy and paste the transaction hash in the field above</li>
                        <li>Click "Submit Payment" to complete your purchase</li>
                        <li>Your account will be upgraded within 30 minutes after confirmation</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={confirmPurchase}
        onCancel={() => setShowConfirmation(false)}
        planType={planType}
        currency={selectedCurrency}
        amount={calculateConversion(amount, selectedCurrency)}
      />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-75"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Congratulations!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your payment has been submitted successfully!
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Purchase Complete!</strong><br />
                  Please wait 30 minutes for your account to be upgraded to {planType.charAt(0).toUpperCase() + planType.slice(1)} plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutModal;
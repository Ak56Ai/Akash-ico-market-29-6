import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock, AlertCircle, Crown, Star, Shield } from 'lucide-react';

interface PlanPurchase {
  id: string;
  plan_type: 'silver' | 'gold';
  currency_symbol: string;
  amount_paid: number;
  mecoin_equivalent: number;
  transaction_hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at: string;
}

interface PurchasesDashboardProps {
  purchases: PlanPurchase[];
  loading: boolean;
}

const PurchasesDashboard: React.FC<PurchasesDashboardProps> = ({ purchases, loading }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'silver':
        return <Star className="w-5 h-5 text-gray-400" />;
      case 'gold':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'silver':
        return 'from-gray-400 to-gray-600';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark-text">Plan Purchases</h2>
        <span className="text-dark-text/60">{purchases.length} purchase(s)</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="custom-spinner w-12 h-12"></div>
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(purchase.plan_type)} flex items-center justify-center`}>
                        {getPlanIcon(purchase.plan_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-dark-text capitalize">
                          {purchase.plan_type} Plan
                        </h3>
                        <p className="text-sm text-dark-text/60">
                          {formatDate(purchase.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}>
                      {getStatusIcon(purchase.status)}
                      <span className="ml-1 capitalize">{purchase.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-dark-text/60">Amount Paid</p>
                      <p className="font-semibold text-dark-text">
                        {purchase.amount_paid} {purchase.currency_symbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-dark-text/60">MeCoin Equivalent</p>
                      <p className="font-semibold text-dark-text">
                        {purchase.mecoin_equivalent} MECOIN
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-dark-text/60">Currency</p>
                      <p className="font-semibold text-dark-text">
                        {purchase.currency_symbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-dark-text/60">Status</p>
                      <p className="font-semibold text-dark-text capitalize">
                        {purchase.status}
                      </p>
                    </div>
                  </div>

                  {purchase.transaction_hash && (
                    <div className="border-t border-dark-accent1/20 pt-4">
                      <p className="text-sm text-dark-text/60 mb-1">Transaction Hash</p>
                      <p className="font-mono text-sm text-dark-text break-all">
                        {purchase.transaction_hash}
                      </p>
                    </div>
                  )}

                  {purchase.confirmed_at && (
                    <div className="mt-2">
                      <p className="text-sm text-dark-text/60">
                        Confirmed on {formatDate(purchase.confirmed_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
            
            <div className="relative rounded-2xl p-1">
              <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-12">
                <CreditCard className="w-16 h-16 text-dark-text/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-text/60 mb-2">No Purchases Yet</h3>
                <p className="text-dark-text/40 mb-6">Upgrade your plan to unlock premium features.</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-dark-button text-dark-text font-medium transition-all transform hover:scale-105"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesDashboard;
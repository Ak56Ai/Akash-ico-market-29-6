import React, { useState, useEffect } from 'react';
import { Shield, Users, CreditCard, CheckCircle, X, AlertCircle, Crown, Star, RefreshCw, Calendar } from 'lucide-react';
import { supabase, getCachedData, setCachedData } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PlanPurchase {
  id: string;
  user_id: string;
  plan_type: 'silver' | 'gold';
  currency_symbol: string;
  amount_paid: number;
  mecoin_equivalent: number;
  transaction_hash: string;
  payment_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
  user_profiles?: {
    name: string;
    email: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  location: string;
  plan_type: 'free' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchases, setPurchases] = useState<PlanPurchase[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Check cache first
      const cacheKey = 'admin_data';
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setPurchases(cachedData.purchases);
        setUsers(cachedData.users);
        setLoading(false);
        
        // Fetch fresh data in background
        fetchFreshAdminData();
        return;
      }

      await fetchFreshAdminData();
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setMessage('Failed to load admin data');
      setMessageType('error');
      setLoading(false);
    }
  };

  const fetchFreshAdminData = async () => {
    try {
      // Fetch data in parallel
      const [purchasesResult, usersResult] = await Promise.allSettled([
        supabase
          .from('plan_purchases')
          .select(`
            *,
            user_profiles (
              name,
              email
            )
          `)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      // Handle purchases
      if (purchasesResult.status === 'fulfilled') {
        setPurchases(purchasesResult.value.data || []);
      }

      // Handle users
      if (usersResult.status === 'fulfilled') {
        setUsers(usersResult.value.data || []);
      }

      // Cache the data
      setCachedData('admin_data', {
        purchases: purchasesResult.status === 'fulfilled' ? purchasesResult.value.data || [] : [],
        users: usersResult.status === 'fulfilled' ? usersResult.value.data || [] : []
      });

    } catch (error) {
      console.error('Error fetching fresh admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmPurchase = async (purchaseId: string, planType: 'silver' | 'gold', userId: string) => {
    if (!user) return;

    try {
      setProcessing(purchaseId);

      // Update purchase and user profile in parallel
      const [purchaseResult, userResult] = await Promise.allSettled([
        supabase
          .from('plan_purchases')
          .update({
            status: 'confirmed',
            confirmed_by: user.id,
            confirmed_at: new Date().toISOString()
          })
          .eq('id', purchaseId),
        
        supabase
          .from('user_profiles')
          .update({
            plan_type: planType,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
      ]);

      if (purchaseResult.status === 'rejected' || userResult.status === 'rejected') {
        throw new Error('Failed to update purchase or user profile');
      }

      setMessage(`Purchase confirmed! User upgraded to ${planType} plan.`);
      setMessageType('success');

      // Clear cache and refresh data
      setCachedData('admin_data', null);
      await fetchAdminData();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error confirming purchase:', error);
      setMessage('Failed to confirm purchase');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setProcessing(null);
    }
  };

  const rejectPurchase = async (purchaseId: string) => {
    if (!user) return;

    try {
      setProcessing(purchaseId);

      const { error } = await supabase
        .from('plan_purchases')
        .update({
          status: 'failed',
          confirmed_by: user.id,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', purchaseId);

      if (error) throw error;

      setMessage('Purchase rejected.');
      setMessageType('success');

      // Clear cache and refresh data
      setCachedData('admin_data', null);
      await fetchAdminData();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error rejecting purchase:', error);
      setMessage('Failed to reject purchase');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-custom-dark pt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-dark-text mb-4">Access Denied</h1>
                  <p className="text-dark-text/80">
                    You don't have permission to access the admin dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingPurchases = purchases.filter(p => p.status === 'pending');
  const totalUsers = users.length;
  const silverUsers = users.filter(u => u.plan_type === 'silver').length;
  const goldUsers = users.filter(u => u.plan_type === 'gold').length;

  return (
    <div className="min-h-screen bg-custom-dark pt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-text">Admin Panel</h3>
                    <p className="text-dark-text/60 text-sm">
                      {user?.email}
                    </p>
                  </div>
                  
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('purchases')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'purchases'
                          ? 'bg-dark-accent2/20 text-dark-accent2'
                          : 'text-dark-text/80 hover:bg-dark-accent1/10'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      Plan Purchases ({pendingPurchases.length})
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'users'
                          ? 'bg-dark-accent2/20 text-dark-accent2'
                          : 'text-dark-text/80 hover:bg-dark-accent1/10'
                      }`}
                    >
                      <Users className="w-5 h-5 mr-3" />
                      Users ({totalUsers})
                    </button>
                  </nav>
                  
                  <div className="mt-6 pt-6 border-t border-dark-accent1/20">
                    <button
                      onClick={fetchAdminData}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm bg-dark-accent1/20 hover:bg-dark-accent1/30 text-dark-text rounded-lg transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-80"></div>
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6 text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-dark-text">{totalUsers}</p>
                    <p className="text-dark-text/60 text-sm">Total Users</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-80"></div>
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-dark-text">{pendingPurchases.length}</p>
                    <p className="text-dark-text/60 text-sm">Pending Purchases</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-400/20 rounded-2xl blur-xl opacity-80"></div>
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6 text-center">
                    <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-dark-text">{silverUsers}</p>
                    <p className="text-dark-text/60 text-sm">Silver Users</p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 rounded-2xl blur-xl opacity-80"></div>
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6 text-center">
                    <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-dark-text">{goldUsers}</p>
                    <p className="text-dark-text/60 text-sm">Gold Users</p>
                  </div>
                </div>
              </div>
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

            {/* Tab Content */}
            {activeTab === 'purchases' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-dark-text">Plan Purchase Requests</h2>
                  <span className="text-dark-text/60">{purchases.length} total purchase(s)</span>
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
                                    {purchase.plan_type} Plan Purchase
                                  </h3>
                                  <p className="text-sm text-dark-text/60">
                                    {purchase.user_profiles?.name || purchase.user_profiles?.email || 'Unknown User'}
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
                                <p className="text-sm text-dark-text/60">User Email</p>
                                <p className="font-semibold text-dark-text">
                                  {purchase.user_profiles?.email || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-dark-text/60">Date</p>
                                <p className="font-semibold text-dark-text">
                                  {formatDate(purchase.created_at)}
                                </p>
                              </div>
                            </div>

                            {purchase.transaction_hash && (
                              <div className="border-t border-dark-accent1/20 pt-4 mb-4">
                                <p className="text-sm text-dark-text/60 mb-1">Transaction Hash</p>
                                <p className="font-mono text-sm text-dark-text break-all">
                                  {purchase.transaction_hash}
                                </p>
                              </div>
                            )}

                            {purchase.status === 'pending' && (
                              <div className="flex space-x-4">
                                <button
                                  onClick={() => confirmPurchase(purchase.id, purchase.plan_type, purchase.user_id)}
                                  disabled={processing === purchase.id}
                                  className={`flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${
                                    processing === purchase.id ? 'opacity-75 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {processing === purchase.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                  ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                  )}
                                  Confirm Purchase
                                </button>
                                <button
                                  onClick={() => rejectPurchase(purchase.id)}
                                  disabled={processing === purchase.id}
                                  className={`flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ${
                                    processing === purchase.id ? 'opacity-75 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </button>
                              </div>
                            )}

                            {purchase.confirmed_at && (
                              <div className="mt-4 text-sm text-dark-text/60">
                                {purchase.status === 'confirmed' ? 'Confirmed' : 'Rejected'} on {formatDate(purchase.confirmed_at)}
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
                          <h3 className="text-xl font-semibold text-dark-text/60 mb-2">No Purchase Requests</h3>
                          <p className="text-dark-text/40">All purchase requests have been processed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-dark-text">User Management</h2>
                  <span className="text-dark-text/60">{users.length} user(s)</span>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="custom-spinner w-12 h-12"></div>
                  </div>
                ) : users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {users.map((user) => (
                      <div key={user.id} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
                        
                        <div className="relative rounded-2xl p-1">
                          <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-dark-accent1 to-dark-accent2 flex items-center justify-center">
                                  <Users className="w-6 h-6 text-dark-text" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-dark-text">
                                    {user.name || 'Unnamed User'}
                                  </h3>
                                  <p className="text-sm text-dark-text/60">{user.email}</p>
                                </div>
                              </div>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-dark-text bg-gradient-to-r ${getPlanColor(user.plan_type)}`}>
                                {getPlanIcon(user.plan_type)}
                                <span className="ml-1 capitalize">{user.plan_type} Plan</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-dark-text/60">Location:</span>
                                <span className="text-sm text-dark-text">{user.location || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-dark-text/60">Joined:</span>
                                <span className="text-sm text-dark-text">{formatDate(user.created_at)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-dark-text/60">Last Updated:</span>
                                <span className="text-sm text-dark-text">{formatDate(user.updated_at)}</span>
                              </div>
                            </div>
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
                          <Users className="w-16 h-16 text-dark-text/40 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-dark-text/60 mb-2">No Users Found</h3>
                          <p className="text-dark-text/40">No users have registered yet.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
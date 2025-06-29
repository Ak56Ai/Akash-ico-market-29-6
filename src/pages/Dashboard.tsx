import React, { useState, useEffect } from 'react';
import { User, FolderOpen, CreditCard, RefreshCw, Crown, Star, Shield, AlertCircle } from 'lucide-react';
import { supabase, getCachedData, setCachedData } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ProfileDashboard, ProjectsDashboard, PurchasesDashboard } from '../components/dashboard';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  location: string;
  plan_type: 'free' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
}

interface IcoProject {
  id: string;
  name: string;
  description: string;
  image_url: string;
  status: 'active' | 'upcoming' | 'completed';
  website_url: string;
  whitepaper_url: string;
  launch_date: string;
  ticker: string;
  tags: string;
  block_explorer: string;
  twitter: string;
  telegram: string;
  facebook: string;
  linkedin: string;
  created_at: string;
}

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

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<IcoProject[]>([]);
  const [purchases, setPurchases] = useState<PlanPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserData();
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check cache first
      const cacheKey = `user_data_${user.id}`;
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setProfile(cachedData.profile);
        setProjects(cachedData.projects);
        setPurchases(cachedData.purchases);
        setLoading(false);
        
        // Fetch fresh data in background
        fetchFreshData();
        return;
      }

      await fetchFreshData();
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data');
      setMessageType('error');
      setLoading(false);
    }
  };

  const fetchFreshData = async () => {
    if (!user) return;

    try {
      // Fetch all data in parallel for better performance
      const [profileResult, projectsResult, purchasesResult] = await Promise.allSettled([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        
        supabase
          .from('ico_projects')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('plan_purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      // Handle profile
      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        setProfile(profileResult.value.data);
      }

      // Handle projects
      if (projectsResult.status === 'fulfilled') {
        setProjects(projectsResult.value.data || []);
      }

      // Handle purchases
      if (purchasesResult.status === 'fulfilled') {
        setPurchases(purchasesResult.value.data || []);
      }

      // Cache the data
      const cacheKey = `user_data_${user.id}`;
      setCachedData(cacheKey, {
        profile: profileResult.status === 'fulfilled' ? profileResult.value.data : null,
        projects: projectsResult.status === 'fulfilled' ? projectsResult.value.data || [] : [],
        purchases: purchasesResult.status === 'fulfilled' ? purchasesResult.value.data || [] : []
      });

    } catch (error) {
      console.error('Error fetching fresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (profileData: { name: string; location: string }) => {
    if (!user) return;

    try {
      setMessage('');

      const updateData = {
        name: profileData.name.trim() || null,
        location: profileData.location.trim() || null,
        updated_at: new Date().toISOString()
      };

      let result;
      if (profile) {
        result = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('user_profiles')
          .insert([{
            id: user.id,
            email: user.email,
            plan_type: 'free',
            ...updateData
          }])
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) throw error;

      setProfile(data);
      setMessage('Profile updated successfully!');
      setMessageType('success');
      
      // Clear cache to force refresh
      const cacheKey = `user_data_${user.id}`;
      setCachedData(cacheKey, null);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage(`Failed to update profile: ${error.message || 'Please try again.'}`);
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      throw error;
    }
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-custom-dark pt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="custom-spinner w-12 h-12"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-custom-dark pt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-8">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-dark-text mb-4">Dashboard Access</h1>
                  <p className="text-dark-text/80 mb-6">
                    Please sign in to access your dashboard and manage your profile and projects.
                  </p>
                  <div className="text-sm text-dark-text/60">
                    Your account is secure and your data is protected.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-dark-accent1 to-dark-accent2 flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-dark-text" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-text">
                      {profile?.name || user.user_metadata?.name || 'User'}
                    </h3>
                    <p className="text-dark-text/60 text-sm">
                      {user.email}
                    </p>
                    {profile && (
                      <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-dark-text bg-gradient-to-r ${getPlanColor(profile.plan_type)}`}>
                        {getPlanIcon(profile.plan_type)}
                        <span className="ml-1 capitalize">{profile.plan_type} Plan</span>
                      </div>
                    )}
                  </div>
                  
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'profile'
                          ? 'bg-dark-accent2/20 text-dark-accent2'
                          : 'text-dark-text/80 hover:bg-dark-accent1/10'
                      }`}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Profile
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'projects'
                          ? 'bg-dark-accent2/20 text-dark-accent2'
                          : 'text-dark-text/80 hover:bg-dark-accent1/10'
                      }`}
                    >
                      <FolderOpen className="w-5 h-5 mr-3" />
                      Your Projects ({projects.length})
                    </button>

                    <button
                      onClick={() => setActiveTab('purchases')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'purchases'
                          ? 'bg-dark-accent2/20 text-dark-accent2'
                          : 'text-dark-text/80 hover:bg-dark-accent1/10'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      Plan Purchases ({purchases.length})
                    </button>
                  </nav>
                  
                  <div className="mt-6 pt-6 border-t border-dark-accent1/20">
                    <button
                      onClick={fetchUserData}
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
            {activeTab === 'profile' && (
              <ProfileDashboard
                profile={profile}
                loading={loading}
                message={message}
                messageType={messageType}
                onUpdateProfile={handleProfileUpdate}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsDashboard
                projects={projects}
                loading={loading}
              />
            )}

            {activeTab === 'purchases' && (
              <PurchasesDashboard
                purchases={purchases}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
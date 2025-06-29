import React, { useState } from 'react';
import { User, Edit, Save, Crown, Star, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  location: string;
  plan_type: 'free' | 'silver' | 'gold';
  created_at: string;
  updated_at: string;
}

interface ProfileDashboardProps {
  profile: UserProfile | null;
  loading: boolean;
  message: string;
  messageType: 'success' | 'error';
  onUpdateProfile: (data: { name: string; location: string }) => Promise<void>;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  profile,
  loading,
  message,
  messageType,
  onUpdateProfile
}) => {
  const { user } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    location: profile?.location || ''
  });

  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(profileForm);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
      
      <div className="relative rounded-2xl p-1">
        <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-text">Profile Information</h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="flex items-center px-4 py-2 rounded-full bg-dark-accent2/20 hover:bg-dark-accent2/30 text-dark-accent2 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              {editingProfile ? 'Cancel' : 'Edit'}
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

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="custom-spinner w-12 h-12"></div>
            </div>
          ) : editingProfile ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-text/80 mb-2">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-dark-bg border border-dark-accent1/30 rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent2"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text/80 mb-2">Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-dark-bg border border-dark-accent1/30 rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent2"
                  placeholder="Enter your location"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex items-center px-6 py-3 rounded-full bg-dark-button text-dark-text font-medium transition-all transform hover:scale-105 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-6 py-3 rounded-full bg-dark-accent1/20 text-dark-text hover:bg-dark-accent1/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-text/60 mb-1">Email</label>
                <p className="text-dark-text">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text/60 mb-1">Name</label>
                <p className="text-dark-text">{profile?.name || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text/60 mb-1">Location</label>
                <p className="text-dark-text">{profile?.location || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text/60 mb-1">Plan Type</label>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-dark-text bg-gradient-to-r ${getPlanColor(profile?.plan_type || 'free')}`}>
                  {getPlanIcon(profile?.plan_type || 'free')}
                  <span className="ml-2 capitalize font-medium">{profile?.plan_type || 'free'} Plan</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text/60 mb-1">Member Since</label>
                <p className="text-dark-text">{profile ? formatDate(profile.created_at) : 'New user'}</p>
              </div>

              {profile?.updated_at && (
                <div>
                  <label className="block text-sm font-medium text-dark-text/60 mb-1">Last Updated</label>
                  <p className="text-dark-text">{formatDate(profile.updated_at)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
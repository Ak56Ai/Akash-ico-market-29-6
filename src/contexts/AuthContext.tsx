import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCachedData, setCachedData } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: string | null;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  // Admin user configuration
  const ADMIN_USER_ID = 'c4506c4a-ed56-43a2-8a74-da42c0131b7c';
  const ADMIN_EMAIL = 'govindsingh747@gmail.com';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkAdminStatus(session.user);
          
          if (event === 'SIGNED_UP') {
            await createUserProfile(session.user);
          } else if (event === 'SIGNED_IN') {
            await ensureUserProfile(session.user);
          }
        } else {
          setIsAdmin(false);
          setAdminRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User) => {
    // Check cache first
    const cacheKey = `admin_status_${user.id}`;
    const cachedStatus = getCachedData(cacheKey);
    
    if (cachedStatus) {
      setIsAdmin(cachedStatus.isAdmin);
      setAdminRole(cachedStatus.adminRole);
      return;
    }

    try {
      // Try database first (but don't wait too long)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );
      
      const dbPromise = supabase
        .from('admin_roles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      const { data: adminData, error } = await Promise.race([dbPromise, timeoutPromise]) as any;

      if (!error && adminData) {
        setIsAdmin(true);
        setAdminRole(adminData.role);
        setCachedData(cacheKey, { isAdmin: true, adminRole: adminData.role });
        return;
      }
    } catch (error) {
      // Fallback to hardcoded check if database fails or times out
    }

    // Fallback to hardcoded admin check
    const isUserAdmin = user.id === ADMIN_USER_ID || user.email === ADMIN_EMAIL;
    setIsAdmin(isUserAdmin);
    setAdminRole(isUserAdmin ? 'super_admin' : null);
    setCachedData(cacheKey, { isAdmin: isUserAdmin, adminRole: isUserAdmin ? 'super_admin' : null });
  };

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) return;

      // Create new profile
      const profileData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 
              (user.user_metadata?.firstName && user.user_metadata?.lastName 
                ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}` 
                : null),
        location: user.user_metadata?.country || null,
        plan_type: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('user_profiles')
        .insert([profileData]);

    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const ensureUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        await createUserProfile(user);
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAdmin(false);
      setAdminRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    adminRole,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
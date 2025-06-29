import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment variables check:', {
  VITE_SUPABASE_URL: !!supabaseUrl,
  VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey,
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'meico-app@1.0.0',
      'apikey': supabaseAnonKey, // ✅ CRITICAL: include apikey
    },
  },
});


// Simple connection test - no logging to reduce console spam
export const testConnection = async () => {
  try {
    const { error } = await supabase
      .from('ico_projects')
      .select('id', { count: 'exact' })
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
};

// Cache for frequently accessed data
const dataCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export const getCachedData = (key: string) => {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key: string, data: any) => {
  dataCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const clearCache = () => {
  dataCache.clear();
};
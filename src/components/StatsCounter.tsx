import React, { useEffect, useState } from 'react';
import { Globe, Code, Users, Clock, RefreshCw } from 'lucide-react';
import { supabase, getCachedData, setCachedData } from '../lib/supabase';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

interface PlatformStat {
  id: string;
  stat_name: string;
  stat_value: number;
  description: string;
  updated_at: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return (
    <span>{count}{suffix}</span>
  );
};

const StatsCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<PlatformStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = 'platform_stats';
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setStats(cachedData);
        setLoading(false);
        
        // Fetch fresh data in background
        fetchFreshStats();
        return;
      }

      await fetchFreshStats();
    } catch (err: any) {
      console.error('Error in fetchStats:', err);
      setError(`Failed to load statistics: ${err.message}`);
      
      // Always show fallback data
      const fallbackStats = [
        { id: 'fallback-1', stat_name: 'networks', stat_value: 7, description: 'Networks', updated_at: '' },
        { id: 'fallback-2', stat_name: 'projects', stat_value: 5, description: 'Projects', updated_at: '' },
        { id: 'fallback-3', stat_name: 'buyers', stat_value: 188, description: 'Buyers', updated_at: '' },
        { id: 'fallback-4', stat_name: 'years_experience', stat_value: 1, description: 'Years of Experience', updated_at: '' }
      ];
      setStats(fallbackStats);
      setLoading(false);
    }
  };

  const fetchFreshStats = async () => {
    try {
      const { data, error: statsError } = await supabase
        .from('platform_stats')
        .select('*')
        .order('stat_name');

      if (statsError) throw statsError;

      if (data && data.length > 0) {
        setStats(data);
        setCachedData('platform_stats', data);
      } else {
        // Insert default stats if none exist
        const defaultStats = [
          { stat_name: 'networks', stat_value: 7, description: 'Supported Networks' },
          { stat_name: 'projects', stat_value: 0, description: 'Total Projects' },
          { stat_name: 'buyers', stat_value: 188, description: 'Active Buyers' },
          { stat_name: 'years_experience', stat_value: 1, description: 'Years of Experience' }
        ];
        
        const { data: insertedData } = await supabase
          .from('platform_stats')
          .insert(defaultStats)
          .select();
        
        if (insertedData) {
          setStats(insertedData);
          setCachedData('platform_stats', insertedData);
        }
      }
    } catch (error) {
      console.error('Error fetching fresh stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'networks':
        return <Globe className="h-8 w-8" />;
      case 'projects':
        return <Code className="h-8 w-8" />;
      case 'buyers':
        return <Users className="h-8 w-8" />;
      case 'years_experience':
        return <Clock className="h-8 w-8" />;
      default:
        return <Globe className="h-8 w-8" />;
    }
  };

  const getStatLabel = (statName: string) => {
    switch (statName) {
      case 'networks':
        return 'Networks';
      case 'projects':
        return 'Projects';
      case 'buyers':
        return 'Buyers';
      case 'years_experience':
        return 'Years of Experience';
      default:
        return statName.charAt(0).toUpperCase() + statName.slice(1);
    }
  };

  const getStatSuffix = (statName: string) => {
    return statName === 'years_experience' ? '+' : '';
  };
  
  return (
    <section id="stats-section" className="py-20 relative bg-white dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/30 to-purple-900/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Statistics</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
            Real-time platform metrics and performance indicators.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div 
                  key={stat.id} 
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800/80 dark:bg-gray-800/80 mb-4 text-white group-hover:bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-300">
                    {getStatIcon(stat.stat_name)}
                  </div>
                  
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {isVisible ? (
                      <Counter 
                        end={stat.stat_value} 
                        suffix={getStatSuffix(stat.stat_name)} 
                      />
                    ) : (
                      '0'
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    {getStatLabel(stat.stat_name)}
                  </p>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="text-center mt-8">
                <div className="relative group max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-80"></div>
                  
                  <div className="relative rounded-2xl p-1">
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                      <p className="text-red-600 dark:text-red-400 mb-4 text-sm">{error}</p>
                      <button
                        onClick={fetchStats}
                        className="flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default StatsCounter;
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase, getCachedData, setCachedData } from '../lib/supabase';
import IcoCard from '../components/IcoCard';

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
  token_address: string;
}

const ActiveIco = () => {
  const [projects, setProjects] = useState<IcoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    const channel = supabase
      .channel('realtime:ico_projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ico_projects' },
        (payload) => {
          console.log('🔄 Real-time update received:', payload);
          fetchProjects(); // re-fetch on any insert/update/delete
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = `projects_${currentPage}_${itemsPerPage}`;
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        setProjects(cachedData.projects);
        setTotalProjects(cachedData.total);
        setLoading(false);
        
        // Fetch fresh data in background
        fetchFreshProjects();
        return;
      }

      await fetchFreshProjects();
    } catch (err: any) {
      console.error('Error in fetchProjects:', err);
      setError(`Failed to load projects: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const fetchFreshProjects = async () => {
    try {
      // Get total count and paginated data in parallel
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const [countResult, dataResult] = await Promise.allSettled([
        supabase
          .from('ico_projects')
          .select('*', { count: 'exact', head: true }),
        
        supabase
          .from('ico_projects')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, to)
      ]);

      // Handle count
      if (countResult.status === 'fulfilled') {
        setTotalProjects(countResult.value.count || 0);
      }

      // Handle data
      if (dataResult.status === 'fulfilled') {
        const data = dataResult.value.data || [];
        setProjects(data);
        
        // Cache the data
        const cacheKey = `projects_${currentPage}_${itemsPerPage}`;
        setCachedData(cacheKey, {
          projects: data,
          total: countResult.status === 'fulfilled' ? countResult.value.count || 0 : 0
        });
      }

      // If no projects exist, create sample data
      if (dataResult.status === 'fulfilled' && (!dataResult.value.data || dataResult.value.data.length === 0)) {
        const sampleProject = {
          name: 'Sample ICO Project',
          description: 'This is a sample ICO project to demonstrate the platform functionality. It showcases how projects are displayed and managed within the system.',
          status: 'active',
          website_url: 'https://example.com',
          ticker: 'SAMPLE',
          tags: 'DeFi, Sample, Demo',
          network: 'ETH',
          launch_price: '0.001 ETH',
          token_address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e'
        };
        
        const { data: insertedData } = await supabase
          .from('ico_projects')
          .insert([sampleProject])
          .select();
        
        if (insertedData) {
          setProjects(insertedData);
          setTotalProjects(1);
        }
      }
      
    } catch (error: any) {
        setError(`Failed to fetch fresh projects: ${error?.message || 'Unknown error'}`);
        console.error('Error fetching fresh projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black pt-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Database Connection Issue</h3>
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <button 
                    onClick={fetchProjects}
                    className="flex items-center justify-center w-full px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Active ICO Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover and invest in the most promising blockchain projects.
            Our curated list of active ICOs represents the future of decentralized innovation.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-400">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={20}>20</option>
              <option value={40}>40</option>
              <option value={60}>60</option>
              <option value={80}>80</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-600 dark:text-gray-400">projects per page</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchProjects}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="text-gray-600 dark:text-gray-400">
              Showing {totalProjects > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalProjects)} of {totalProjects} projects
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project) => (
                <IcoCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-12">
                  <h3 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">No ICO projects found</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    {totalProjects === 0 ? 'Be the first to submit a project!' : 'Check back soon for new opportunities!'}
                  </p>
                  <button
                    onClick={fetchProjects}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Refresh Projects
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveIco;
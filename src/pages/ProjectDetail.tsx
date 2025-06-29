import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Globe, Twitter, Send, Facebook, Linkedin, ExternalLink, ShoppingCart, Users, Target, Clock, TrendingUp, TrendingDown, BarChart3, Coins, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { polygonApi, TokenPrice, TokenSupply, TokenHolder, PriceHistory } from '../services/polygonApi';
import PriceChart from '../components/charts/PriceChart';
import HoldersChart from '../components/charts/HoldersChart';

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
  key_points: string;
  network: string;
  decimals: number;
  block_explorer: string;
  twitter: string;
  telegram: string;
  facebook: string;
  linkedin: string;
  ico_start_date: string;
  ico_end_date: string;
  launch_price: string;
  country: string;
  project_details: string;
  created_at: string;
  token_address: string; // Added token_address field
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<IcoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  
  // Token analytics state
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | null>(null);
  const [tokenSupply, setTokenSupply] = useState<TokenSupply | null>(null);
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [tokenDataLoading, setTokenDataLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '7D' | '30D' | '1Y'>('7D');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (project?.token_address && project?.ticker) {
      fetchTokenData(project.token_address, project.ticker);
    }
  }, [project, selectedTimeframe]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ico_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenData = async (address: string, symbol: string) => {
    try {
      setTokenDataLoading(true);
      console.log('Fetching token data for:', { address, symbol });

      const [price, supply, holders, history] = await Promise.all([
        polygonApi.getTokenPrice(symbol),
        polygonApi.getTokenSupply(address),
        polygonApi.getTokenHolders(address),
        polygonApi.getPriceHistory(symbol, selectedTimeframe)
      ]);

      setTokenPrice(price);
      setTokenSupply(supply);
      setTokenHolders(holders);
      setPriceHistory(history);
    } catch (err) {
      console.error('Error fetching token data:', err);
    } finally {
      setTokenDataLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseTags = (tags: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const parseKeyPoints = (keyPoints: string) => {
    if (!keyPoints) return [];
    return keyPoints.split('\n').filter(point => point.trim().length > 0);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num);
  };

  const socialLinks = [
    { url: project?.twitter, icon: Twitter, name: 'Twitter', color: 'text-blue-400' },
    { url: project?.telegram, icon: Send, name: 'Telegram', color: 'text-blue-500' },
    { url: project?.facebook, icon: Facebook, name: 'Facebook', color: 'text-blue-600' },
    { url: project?.linkedin, icon: Linkedin, name: 'LinkedIn', color: 'text-blue-700' }
  ].filter(link => link.url);

  const handleBuy = () => {
    // This would integrate with your smart contract
    console.log('Buying', buyAmount, 'tokens');
    setShowBuyModal(false);
    setBuyAmount('');
    // Add actual buy logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black pt-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black pt-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Project not found'}</p>
          <Link 
            to="/active-ico"
            className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black pt-24">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/active-ico"
          className="inline-flex items-center mb-8 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={project.image_url || 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1200'} 
                      alt={project.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                        project.status === 'active' ? 'bg-green-500/90' :
                        project.status === 'upcoming' ? 'bg-blue-500/90' :
                        'bg-gray-500/90'
                      } backdrop-blur-sm`}>
                        {project.status.toUpperCase()}
                      </span>
                      {project.ticker && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-purple-500/90 backdrop-blur-sm">
                          {project.ticker}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          {project.country && `${project.country} • `}
                          Network: {project.network}
                          {project.token_address && (
                            <span className="block text-sm mt-1">
                              Contract: {project.token_address.slice(0, 10)}...{project.token_address.slice(-8)}
                            </span>
                          )}
                        </p>
                      </div>
                      {project.launch_price && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{project.launch_price}</p>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {parseTags(project.tags).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Analytics Section */}
            {project.token_address && (
              <div className="space-y-8">
                {/* Token Stats Overview */}
                {tokenPrice && tokenSupply && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-80"></div>
                    
                    <div className="relative rounded-2xl p-1">
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Coins className="w-6 h-6 mr-2" />
                            Live Token Data
                          </h2>
                          <button
                            onClick={() => fetchTokenData(project.token_address, project.ticker)}
                            disabled={tokenDataLoading}
                            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${tokenDataLoading ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(tokenPrice.price)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h Change</p>
                            <div className={`flex items-center justify-center ${
                              tokenPrice.change >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {tokenPrice.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                              <span className="font-semibold">
                                {tokenPrice.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(tokenPrice.marketCap)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume (24h)</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(tokenPrice.volume)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Chart */}
                {priceHistory.length > 0 && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
                    
                    <div className="relative rounded-2xl p-1">
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Price Chart ({selectedTimeframe})
                          </h3>
                          <div className="flex space-x-2">
                            {(['1D', '7D', '30D', '1Y'] as const).map((timeframe) => (
                              <button
                                key={timeframe}
                                onClick={() => setSelectedTimeframe(timeframe)}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                  selectedTimeframe === timeframe
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                              >
                                {timeframe}
                              </button>
                            ))}
                          </div>
                        </div>
                        <PriceChart data={priceHistory} symbol={project.ticker} timeframe={selectedTimeframe} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Token Holders */}
                {tokenHolders.length > 0 && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl blur-xl opacity-80"></div>
                    
                    <div className="relative rounded-2xl p-1">
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Top Token Holders
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <HoldersChart holders={tokenHolders} />
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Holder Details</h4>
                            {tokenHolders.slice(0, 5).map((holder, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                                    {holder.address.slice(0, 10)}...{holder.address.slice(-8)}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {formatNumber(holder.balance)} tokens
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {holder.percentage.toFixed(2)}%
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Points */}
            {project.key_points && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
                
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
                    <ul className="space-y-3">
                      {parseKeyPoints(project.key_points).map((point, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Project Details */}
            {project.project_details && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
                
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Details</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {project.project_details}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Buy Section */}
            {project.status === 'active' && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-80"></div>
                
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Invest Now</h3>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="w-full flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-medium transition-all transform hover:scale-105"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Tokens
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Token Supply Info */}
            {tokenSupply && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
                
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Coins className="w-5 h-5 mr-2" />
                      Token Supply
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Supply</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatNumber(tokenSupply.totalSupply)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Circulating Supply</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatNumber(tokenSupply.circulatingSupply)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Max Supply</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatNumber(tokenSupply.maxSupply)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ICO Timeline */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ICO Timeline</h3>
                  <div className="space-y-4">
                    {project.ico_start_date && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatDate(project.ico_start_date)}</p>
                        </div>
                      </div>
                    )}
                    {project.ico_end_date && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-red-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatDate(project.ico_end_date)}</p>
                        </div>
                      </div>
                    )}
                    {project.launch_date && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Launch Date</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatDate(project.launch_date)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Links</h3>
                  <div className="space-y-3">
                    {project.website_url && (
                      <a 
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-4 py-3 rounded-lg bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-200 dark:hover:bg-purple-600/30 text-purple-700 dark:text-purple-400 transition-colors"
                      >
                        <Globe className="w-5 h-5 mr-3" />
                        Website
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {project.whitepaper_url && (
                      <a 
                        href={project.whitepaper_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-4 py-3 rounded-lg bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 mr-3" />
                        Whitepaper
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {project.block_explorer && (
                      <a 
                        href={project.block_explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-4 py-3 rounded-lg bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/30 text-green-700 dark:text-green-400 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 mr-3" />
                        Block Explorer
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
                
                <div className="relative rounded-2xl p-1">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 ${social.color} transition-colors`}
                          title={social.name}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={() => setShowBuyModal(false)}></div>
            
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Buy {project.name} Tokens</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount to invest (ETH)
                    </label>
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="0.1"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  {buyAmount && project.launch_price && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">You will receive approximately:</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {(parseFloat(buyAmount) / parseFloat(project.launch_price.replace(/[^\d.]/g, ''))).toFixed(2)} {project.ticker}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowBuyModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBuy}
                      disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
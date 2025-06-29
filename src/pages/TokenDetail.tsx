import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Coins, BarChart3, RefreshCw } from 'lucide-react';
import { polygonApi, TokenPrice, TokenHolder, TokenSupply, PriceHistory } from '../services/polygonApi';
import PriceChart from '../components/charts/PriceChart';
import HoldersChart from '../components/charts/HoldersChart';

const TokenDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | null>(null);
  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>([]);
  const [tokenSupply, setTokenSupply] = useState<TokenSupply | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '7D' | '30D' | '1Y'>('7D');

  useEffect(() => {
    if (symbol) {
      fetchTokenData();
    }
  }, [symbol, selectedTimeframe]);

  const fetchTokenData = async () => {
    if (!symbol) return;

    try {
      setLoading(true);
      setError(null);

      const [price, holders, supply, history] = await Promise.all([
        polygonApi.getTokenPrice(symbol),
        polygonApi.getTokenHolders('0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e'), // Mock address
        polygonApi.getTokenSupply('0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e'), // Mock address
        polygonApi.getPriceHistory(symbol, selectedTimeframe)
      ]);

      setTokenPrice(price);
      setTokenHolders(holders);
      setTokenSupply(supply);
      setPriceHistory(history);
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to load token data');
    } finally {
      setLoading(false);
    }
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

  if (error || !tokenPrice) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black pt-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Token not found'}</p>
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

        {/* Token Header */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
          
          <div className="relative rounded-2xl p-1">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{symbol?.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tokenPrice.symbol}</h1>
                    <p className="text-gray-600 dark:text-gray-400">Token Analytics</p>
                  </div>
                </div>
                <button
                  onClick={fetchTokenData}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(tokenPrice.price)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">24h Change</p>
                  <div className={`flex items-center justify-center ${
                    tokenPrice.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tokenPrice.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span className="text-lg font-semibold">
                      {tokenPrice.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume (24h)</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(tokenPrice.volume)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(tokenPrice.marketCap)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Price Chart
                    </h2>
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
                  <PriceChart data={priceHistory} symbol={tokenPrice.symbol} timeframe={selectedTimeframe} />
                </div>
              </div>
            </div>
          </div>

          {/* Token Supply */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Coins className="w-5 h-5 mr-2" />
                    Token Supply
                  </h3>
                  {tokenSupply && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Holders Chart */}
        <div className="mt-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
            
            <div className="relative rounded-2xl p-1">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Top Token Holders
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <HoldersChart holders={tokenHolders} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Holder Details</h3>
                    {tokenHolders.map((holder, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
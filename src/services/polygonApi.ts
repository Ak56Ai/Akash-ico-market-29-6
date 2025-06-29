import axios from 'axios';

const POLYGON_API_BASE = 'https://api.polygon.io/v2';
const API_KEY = import.meta.env.VITE_POLYGON_API_KEY || 'J53CVY5FC978W3CC3YGGWHKXDWCNRHAMXN';

export interface TokenPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: number;
}

export interface TokenHolder {
  address: string;
  balance: number;
  percentage: number;
}

export interface TokenSupply {
  totalSupply: number;
  circulatingSupply: number;
  maxSupply: number;
}

export interface PriceHistory {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class PolygonApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  async getTokenPrice(symbol: string): Promise<TokenPrice> {
    try {
      // For demo purposes, return mock data
      // In production, replace with actual Polygon API calls
      const mockData: TokenPrice = {
        symbol: symbol.toUpperCase(),
        price: Math.random() * 100 + 1,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 20,
        volume: Math.random() * 1000000,
        marketCap: Math.random() * 1000000000,
        timestamp: Date.now()
      };

      return mockData;
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  async getTokenHolders(contractAddress: string): Promise<TokenHolder[]> {
    try {
      // Mock data for demonstration
      const mockHolders: TokenHolder[] = [
        { address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e', balance: 1000000, percentage: 25.5 },
        { address: '0x8ba1f109551bD432803012645Hac136c22C501e', balance: 800000, percentage: 20.2 },
        { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', balance: 600000, percentage: 15.1 },
        { address: '0xA0b86a33E6441b8435b662303c0f479c7c2f4f83', balance: 500000, percentage: 12.6 },
        { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', balance: 400000, percentage: 10.1 },
      ];

      return mockHolders;
    } catch (error) {
      console.error('Error fetching token holders:', error);
      throw error;
    }
  }

  async getTokenSupply(contractAddress: string): Promise<TokenSupply> {
    try {
      // Mock data for demonstration
      const mockSupply: TokenSupply = {
        totalSupply: 1000000000,
        circulatingSupply: 750000000,
        maxSupply: 1000000000
      };

      return mockSupply;
    } catch (error) {
      console.error('Error fetching token supply:', error);
      throw error;
    }
  }

  async getPriceHistory(symbol: string, timeframe: '1D' | '7D' | '30D' | '1Y' = '7D'): Promise<PriceHistory[]> {
    try {
      // Generate mock historical data
      const now = Date.now();
      const intervals = timeframe === '1D' ? 24 : timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 365;
      const intervalMs = timeframe === '1D' ? 3600000 : 86400000; // 1 hour or 1 day

      const mockHistory: PriceHistory[] = [];
      let basePrice = Math.random() * 100 + 1;

      for (let i = intervals; i >= 0; i--) {
        const timestamp = now - (i * intervalMs);
        const volatility = 0.05; // 5% volatility
        const change = (Math.random() - 0.5) * volatility;
        
        const open = basePrice;
        const close = basePrice * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.random() * 1000000;

        mockHistory.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume
        });

        basePrice = close;
      }

      return mockHistory;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  async searchTokens(query: string): Promise<any[]> {
    try {
      // Mock search results
      const mockResults = [
        { symbol: 'MECOIN', name: 'MeCoin', address: '0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e' },
        { symbol: 'MEUSD', name: 'MeUSD', address: '0x8ba1f109551bD432803012645Hac136c22C501e' },
        { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
        { symbol: 'POL', name: 'Polygon', address: '0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6' },
      ].filter(token => 
        token.symbol.toLowerCase().includes(query.toLowerCase()) ||
        token.name.toLowerCase().includes(query.toLowerCase())
      );

      return mockResults;
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw error;
    }
  }
}

export const polygonApi = new PolygonApiService();
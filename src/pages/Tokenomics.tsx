import React from 'react';
import { PieChart, Wallet, Coins, Users } from 'lucide-react';

const Tokenomics = () => {
  const distribution = [
    {
      icon: <Wallet className="h-8 w-8 text-purple-400" />,
      title: "Public Sale",
      percentage: "40%",
      description: "Available for public purchase through our ICO platform"
    },
    {
      icon: <Coins className="h-8 w-8 text-blue-400" />,
      title: "Development",
      percentage: "30%",
      description: "Reserved for platform development and future improvements"
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: "Team & Advisors",
      percentage: "20%",
      description: "Allocated to team members and strategic advisors"
    },
    {
      icon: <PieChart className="h-8 w-8 text-pink-400" />,
      title: "Marketing",
      percentage: "10%",
      description: "Dedicated to marketing and community growth initiatives"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            MeCoin <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Tokenomics</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Understanding the distribution and utility of MeCoin tokens.
            Our tokenomics are designed for long-term sustainability and community growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {distribution.map((item, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <div className="bg-gray-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                    {item.percentage}
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl"></div>
            
            <div className="relative rounded-3xl p-1">
              <div className="rounded-2xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Token Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">Token Metrics</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li>• Total Supply: 6,251,990,000.00 ME</li>
                      <li>• Initial Price: $0.022</li>
                      <li>• Vesting Period: 12 months</li>
                      <li>• Network: Multi-chain (EVM Compatible)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">Utility</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li>• Governance voting rights</li>
                      <li>• Platform fee discounts</li>
                      <li>• Staking rewards</li>
                      <li>• Access to premium features</li>
                    </ul>
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

export default Tokenomics;
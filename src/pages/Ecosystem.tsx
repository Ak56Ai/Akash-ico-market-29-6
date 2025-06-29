import React from 'react';
import { Network, Users, Coins, Shield } from 'lucide-react';

const Ecosystem = () => {
  const features = [
    {
      icon: <Network className="h-8 w-8 text-purple-400" />,
      title: "Cross-Chain Integration",
      description: "Seamlessly connect and operate across multiple blockchain networks."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Community Governance",
      description: "Participate in platform decisions through decentralized governance."
    },
    {
      icon: <Coins className="h-8 w-8 text-green-400" />,
      title: "Token Utility",
      description: "Access exclusive features and benefits with MeCoin tokens."
    },
    {
      icon: <Shield className="h-8 w-8 text-pink-400" />,
      title: "Security Framework",
      description: "Advanced security measures protecting your assets and data."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            MeCoin <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Ecosystem</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Explore the interconnected components of our platform that work together
            to create a seamless and secure ICO experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <div className="bg-gray-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-6">Ecosystem Components</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Token Economy</h4>
                    <p className="text-gray-300">
                      Our ecosystem is powered by MeCoin tokens, providing utility across various
                      platform features and services.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Governance System</h4>
                    <p className="text-gray-300">
                      Token holders can participate in platform governance, voting on key decisions
                      and proposals.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Technical Infrastructure</h4>
                    <p className="text-gray-300">
                      Built on cutting-edge blockchain technology, ensuring scalability, security,
                      and interoperability.
                    </p>
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

export default Ecosystem;
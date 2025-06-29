import React from 'react';
import { ArrowRight, Wallet, Shield, Clock } from 'lucide-react';

const GetMeCoin = () => {
  const steps = [
    {
      icon: <Wallet className="h-8 w-8 text-purple-400" />,
      title: "Connect Wallet",
      description: "Connect your Web3 wallet to get started. We support MetaMask, Trust Wallet, and other popular options."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      title: "Choose Amount",
      description: "Select how many MeCoins you want to purchase. The minimum purchase is 100 MeCoins."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-400" />,
      title: "Confirm Transaction",
      description: "Review and confirm your transaction. Your MeCoins will be sent to your wallet immediately."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">MeCoin</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Join the MeCoin ecosystem and be part of the future of decentralized finance.
            Purchase your MeCoins securely and instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <div className="bg-gray-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl"></div>
            
            <div className="relative rounded-3xl p-1">
              <div className="rounded-2xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">Ready to Get Started?</h3>
                  <a 
                    href="https://icopol.mecoin.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all transform hover:scale-105"
                  >
                    Buy MeCoin Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetMeCoin;
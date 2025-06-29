import React from 'react';
import { Info, Shield, Globe, Zap } from 'lucide-react';

const OtherInfo = () => {
  const infoSections = [
    {
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      title: "Security Measures",
      description: "Our platform implements industry-leading security protocols to protect your assets and data."
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-400" />,
      title: "Global Compliance",
      description: "We maintain strict compliance with international regulations and standards."
    },
    {
      icon: <Zap className="h-8 w-8 text-green-400" />,
      title: "Platform Features",
      description: "Discover advanced features designed to enhance your ICO experience."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Platform <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Information</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Everything you need to know about our platform, features, and security measures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {infoSections.map((section, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <div className="bg-gray-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {section.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <p className="text-gray-300">{section.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-6">Detailed Information</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Platform Security</h4>
                    <p className="text-gray-300">
                      Our platform employs state-of-the-art security measures including multi-signature wallets,
                      cold storage, and regular security audits to ensure the safety of your assets.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Compliance & Regulations</h4>
                    <p className="text-gray-300">
                      We maintain strict compliance with international regulations and work closely with regulatory
                      bodies to ensure all operations meet legal requirements.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Technical Infrastructure</h4>
                    <p className="text-gray-300">
                      Built on cutting-edge blockchain technology, our platform ensures fast, secure, and
                      reliable transactions across multiple chains.
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

export default OtherInfo;
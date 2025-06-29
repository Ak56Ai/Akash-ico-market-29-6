import React from 'react';
import { Lock, Shield, Eye, Database } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Database className="h-8 w-8 text-purple-400" />,
      title: "Data Collection",
      content: "We collect only necessary information required for platform functionality and compliance purposes."
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-400" />,
      title: "Data Security",
      content: "Your data is protected using industry-standard encryption and security measures."
    },
    {
      icon: <Eye className="h-8 w-8 text-green-400" />,
      title: "Data Usage",
      content: "We use your data only for platform operations and never share it with third parties without consent."
    },
    {
      icon: <Shield className="h-8 w-8 text-pink-400" />,
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your personal data at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Policy</span>
          </h1>
          <p className="text-gray-300 text-lg">
            We are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
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
                  <p className="text-gray-300">{section.content}</p>
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
                <h3 className="text-2xl font-bold text-white mb-6">Detailed Privacy Information</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Information We Collect</h4>
                    <p className="text-gray-300">
                      We collect information necessary for account creation, KYC verification,
                      and platform functionality. This includes your name, email, wallet address,
                      and transaction history.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">How We Use Your Information</h4>
                    <p className="text-gray-300">
                      Your information is used to provide platform services, ensure compliance
                      with regulations, and improve user experience. We never sell your data
                      to third parties.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-200 mb-4">Your Privacy Rights</h4>
                    <p className="text-gray-300">
                      You have the right to access, modify, or delete your personal data.
                      Contact our support team to exercise these rights.
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

export default PrivacyPolicy;
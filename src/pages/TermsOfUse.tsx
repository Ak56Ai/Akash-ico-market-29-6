import React from 'react';
import { Shield } from 'lucide-react';

const TermsOfUse = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the MeCoin platform, you agree to be bound by these Terms of Use and all applicable laws and regulations."
    },
    {
      title: "2. User Obligations",
      content: "Users must be at least 18 years old and comply with all local regulations regarding cryptocurrency trading and ICO participation."
    },
    {
      title: "3. Platform Rules",
      content: "Users agree to use the platform responsibly and not engage in any fraudulent or malicious activities."
    },
    {
      title: "4. Intellectual Property",
      content: "All content on the platform is protected by copyright and other intellectual property rights owned by MeCoin."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Use</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Please read these terms carefully before using our platform.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="relative group mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <p className="text-gray-300">{section.content}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="relative group mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl"></div>
            
            <div className="relative rounded-3xl p-1">
              <div className="rounded-2xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8 text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Questions About Our Terms?</h3>
                <p className="text-gray-300 mb-6">
                  Contact our support team for clarification on any of our terms and conditions.
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium transition-all transform hover:scale-105"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
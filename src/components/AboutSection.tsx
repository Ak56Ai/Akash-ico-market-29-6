import React from 'react';
import { CheckCircle, Play } from 'lucide-react';

const AboutSection: React.FC = () => {
  const benefits = [
    'Free for Community',
    'Global Reach',
    'Fast Listing',
    'Cutting-Edge Technology',
    'Duis 24X7 Support',
    'Community-Driven'
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">About Me Marketplace</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Our ICO market platform on the EVM network is designed with investors in mind, offering a comprehensive suite of features to enhance your investment experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Who We Are</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At MeMarketplace, we're reshaping the way people discover, buy, and sell digital assets. Our platform is designed to bring transparency, accessibility, and innovation to the world of digital marketplaces, making it easier for users around the globe to participate in the exciting world of blockchain and digital assets.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              A centralized dashboard displaying live, upcoming, and completed ICOs with real-time data on project details, funding status, and performance metrics.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
            
            <div className="relative rounded-3xl overflow-hidden aspect-video">
              <img 
                src="https://kufggdtvwplpngdlirpt.supabase.co/storage/v1/object/sign/website/image%20(3).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xM2E2NzY1Yy0xNGM1LTRjZWUtYjU4ZC0wMWEzYTNlOTdmODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ3ZWJzaXRlL2ltYWdlICgzKS5qcGciLCJpYXQiOjE3NTAzMzkxMDIsImV4cCI6MTc4MTg3NTEwMn0.SkRWnB8g1t8O6VFOFttu_6o20h16KUhkSzaN40VXKgI" 
                alt="About MeICO" 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <a 
                  href="https://www.youtube.com/watch?v=DVZSt6T17Do" 
                  className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/30 group hover:bg-white/20 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 rounded-full animate-ping bg-white/20 group-hover:bg-white/30"></div>
                  <Play className="h-6 w-6 text-white fill-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
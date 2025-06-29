import React from 'react';
import { CheckCircle, Link, Rocket } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-purple-400" />,
      title: 'Submit Application',
      description: 'Ready to bring your blockchain project to the world? Submit your application and start your journey to success.'
    },
    {
      icon: <Link className="h-8 w-8 text-blue-400" />,
      title: 'Verify Links',
      description: '🔗 Verify Your Links for a Seamless ICO Launch.'
    },
    {
      icon: <Rocket className="h-8 w-8 text-pink-400" />,
      title: 'Start ICO',
      description: 'Launch your project on the blockchain with our seamless, all-in-one platform. Connect with investors and turn your vision into reality.'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gray-100 dark:bg-gray-900/80">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5980800/pexels-photo-5980800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10 bg-cover bg-center"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">🚀 Launch & Trade ICOs on </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Any EVM-Compatible Chain!</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Seamlessly create, manage, and trade ICOs on Ethereum, Binance Smart Chain, Polygon, and more—all from a single platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group p-1 rounded-2xl transition-transform duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
              
              <div className="relative h-full rounded-2xl bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8 transition-all duration-300 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/95">
                <div className="bg-gray-100 dark:bg-gray-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-200 dark:group-hover:bg-gray-900 transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
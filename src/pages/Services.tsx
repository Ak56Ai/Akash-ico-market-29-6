import React from 'react';
import { Code, Users, Rocket, Shield, Globe, Zap } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Code className="h-8 w-8 text-purple-400" />,
      title: "Smart Contract Development",
      description: "Expert development of secure, audited smart contracts for your token and ICO with best practices implementation."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Community Building",
      description: "Strategic community development and management across social platforms to build a strong, engaged following."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: "Security Auditing",
      description: "Comprehensive security audits of smart contracts and platform infrastructure to ensure maximum protection."
    },
    {
      icon: <Globe className="h-8 w-8 text-pink-400" />,
      title: "Marketing Strategy",
      description: "Tailored marketing campaigns to maximize visibility and attract potential investors to your ICO."
    },
    {
      icon: <Rocket className="h-8 w-8 text-yellow-400" />,
      title: "Launch Support",
      description: "End-to-end support for your ICO launch, including technical setup, marketing, and community management."
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-400" />,
      title: "Technical Consulting",
      description: "Expert guidance on tokenomics, blockchain selection, and technical architecture for your project."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-gray-300 text-lg">
            We provide comprehensive support for blockchain projects at every stage,
            from conception to launch and beyond. Our expert team ensures your ICO
            success with end-to-end solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <div className="bg-gray-900/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
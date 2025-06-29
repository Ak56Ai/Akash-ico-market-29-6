import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const Disclaimer = () => {
  const disclaimers = [
    {
      title: "Investment Risks",
      content: "Cryptocurrency investments carry high risks. Past performance does not guarantee future results."
    },
    {
      title: "No Financial Advice",
      content: "Information provided on this platform does not constitute financial advice. Always conduct your own research."
    },
    {
      title: "Platform Liability",
      content: "We are not responsible for any losses incurred through ICO investments or platform usage."
    },
    {
      title: "Regulatory Compliance",
      content: "Users must comply with their local regulations regarding cryptocurrency and ICO participation."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Legal <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Disclaimer</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Important information about risks and limitations of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {disclaimers.map((disclaimer, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-4">{disclaimer.title}
</h3>
                  <p className="text-gray-300">{disclaimer.content}</p>
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
                <div className="flex items-center mb-6">
                  <Info className="h-8 w-8 text-purple-400 mr-4" />
                  <h3 className="text-2xl font-bold text-white">Important Notice</h3>
                </div>
                <div className="space-y-6 text-gray-300">
                  <p>
                    The information provided on this platform is for general information purposes only.
                    It is not intended to provide legal, financial, or investment advice.
                  </p>
                  <p>
                    Cryptocurrency investments are highly speculative and volatile. You should never
                    invest more than you can afford to lose.
                  </p>
                  <p>
                    By using our platform, you acknowledge and accept all risks associated with
                    cryptocurrency investments and ICO participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
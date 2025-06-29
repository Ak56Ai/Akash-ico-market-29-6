import React from 'react';
import { Briefcase, Send } from 'lucide-react';

const Career = () => {
  const positions = [
    {
      title: "Blockchain Developer",
      type: "Full-time",
      location: "Remote",
      description: "Looking for experienced blockchain developers to help build and maintain our platform infrastructure."
    },
    {
      title: "Smart Contract Auditor",
      type: "Full-time",
      location: "Remote",
      description: "Seeking security experts to audit smart contracts and ensure platform safety."
    },
    {
      title: "Community Manager",
      type: "Full-time",
      location: "Remote",
      description: "Join our team to help grow and manage our global community across various platforms."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Team</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Help us build the future of decentralized finance. We're always looking for talented
            individuals to join our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {positions.map((position, index) => (
            <div 
              key={index}
              className="relative group transform transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative h-full rounded-2xl p-1">
                <div className="h-full rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <Briefcase className="h-8 w-8 text-purple-400 mb-6" />
                  
                  <h3 className="text-xl font-bold text-white mb-2">{position.title}</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-sm text-gray-400">{position.type}</span>
                    <span className="text-sm text-gray-400">{position.location}</span>
                  </div>
                  <p className="text-gray-300 mb-6">{position.description}</p>
                  
                  <button className="flex items-center px-4 py-2 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 transition-colors">
                    Apply Now
                    <Send className="w-4 h-4 ml-2" />
                  </button>
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
                <h3 className="text-2xl font-bold text-white mb-6">Why Join Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">Benefits</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Competitive salary and equity</li>
                      <li>• Flexible working hours</li>
                      <li>• Remote-first culture</li>
                      <li>• Professional development</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-2">Culture</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Innovation-driven environment</li>
                      <li>• Global team collaboration</li>
                      <li>• Work-life balance</li>
                      <li>• Regular team events</li>
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

export default Career;
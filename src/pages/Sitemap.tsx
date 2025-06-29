import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Sitemap = () => {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Active ICO", path: "/active-ico" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" }
      ]
    },
    {
      title: "Information",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Tokenomics", path: "/tokenomics" },
        { name: "Ecosystem", path: "/ecosystem" },
        { name: "Other Info", path: "/other-info" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Use", path: "/terms-of-use" },
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Disclaimer", path: "/disclaimer" },
        { name: "FAQ", path: "/faq" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Site <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Map</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Navigate through all sections of our platform easily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-gray-800/90 backdrop-blur-sm border border-white/10 p-8">
                  <h3 className="text-xl font-bold text-white mb-6">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          to={link.path}
                          className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4 mr-2" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Tag, Globe, Twitter, Send, Facebook, Linkedin, Eye } from 'lucide-react';

interface IcoProject {
  id: string;
  name: string;
  description: string;
  image_url: string;
  status: 'active' | 'upcoming' | 'completed';
  website_url: string;
  whitepaper_url: string;
  launch_date: string;
  ticker: string;
  tags: string;
  block_explorer: string;
  twitter: string;
  telegram: string;
  facebook: string;
  linkedin: string;
  token_address: string; // Added token_address field
}

interface IcoCardProps {
  project: IcoProject;
}

const IcoCard: React.FC<IcoCardProps> = ({ project }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateDescription = (text: string, minLength: number = 120) => {
    if (!text) return 'No description available';
    if (text.length < minLength) {
      return text + ' '.repeat(minLength - text.length);
    }
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  const parseTags = (tags: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const socialLinks = [
    { url: project.twitter, icon: Twitter, name: 'Twitter' },
    { url: project.telegram, icon: Send, name: 'Telegram' },
    { url: project.facebook, icon: Facebook, name: 'Facebook' },
    { url: project.linkedin, icon: Linkedin, name: 'LinkedIn' }
  ].filter(link => link.url);

  return (
    <div className="relative group transform transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
      
      <div className="relative h-full rounded-2xl p-1">
        <div className="h-full rounded-xl bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={project.image_url || 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800'} 
              alt={project.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                project.status === 'active' ? 'bg-green-500/90' :
                project.status === 'upcoming' ? 'bg-blue-500/90' :
                'bg-gray-500/90'
              } backdrop-blur-sm`}>
                {project.status}
              </span>
              {project.ticker && (
                <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-purple-500/90 backdrop-blur-sm">
                  {project.ticker}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
              {project.launch_date && (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(project.launch_date)}
                </div>
              )}
            </div>

            {/* Tags */}
            {project.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {parseTags(project.tags).slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {parseTags(project.tags).length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                    +{parseTags(project.tags).length - 3} more
                  </span>
                )}
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              {truncateDescription(project.description)}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Follow:</span>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/project/${project.id}`}
                className="flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-200 dark:hover:bg-purple-600/30 text-purple-700 dark:text-purple-400 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
              {project.website_url && (
                <a 
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/30 text-blue-700 dark:text-blue-400 transition-colors text-sm"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </a>
              )}
              {project.block_explorer && (
                <a 
                  href={project.block_explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/30 text-green-700 dark:text-green-400 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explorer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IcoCard;
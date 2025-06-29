import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Globe, Calendar, Tag } from 'lucide-react';

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
  created_at: string;
}

interface ProjectsDashboardProps {
  projects: IcoProject[];
  loading: boolean;
}

const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({ projects, loading }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseTags = (tags: string) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark-text">Your Projects</h2>
        <span className="text-dark-text/60">{projects.length} project(s)</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="custom-spinner w-12 h-12"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80 group-hover:opacity-100"></div>
              
              <div className="relative rounded-2xl p-1">
                <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={project.image_url || 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                      alt={project.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-dark-text ${
                        project.status === 'active' ? 'bg-green-500/90' :
                        project.status === 'upcoming' ? 'bg-blue-500/90' :
                        'bg-gray-500/90'
                      } backdrop-blur-sm`}>
                        {project.status.toUpperCase()}
                      </span>
                      {project.ticker && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium text-dark-text bg-dark-accent2/90 backdrop-blur-sm">
                          {project.ticker}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-dark-text">{project.name}</h3>
                      {project.launch_date && (
                        <div className="flex items-center text-dark-text/60 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(project.launch_date)}
                        </div>
                      )}
                    </div>

                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {parseTags(project.tags).slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-dark-accent1/20 text-dark-text"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-dark-text/80 mb-6 text-sm leading-relaxed">
                      {project.description?.length > 100 
                        ? `${project.description.substring(0, 100)}...` 
                        : project.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/project/${project.id}`}
                        className="flex items-center px-3 py-2 rounded-full bg-dark-accent2/20 hover:bg-dark-accent2/30 text-dark-accent2 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      {project.website_url && (
                        <a 
                          href={project.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 rounded-full bg-dark-accent1/20 hover:bg-dark-accent1/30 text-dark-accent1 transition-colors text-sm"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-dark-accent1/20 to-dark-accent2/20 rounded-2xl blur-xl opacity-80"></div>
            
            <div className="relative rounded-2xl p-1">
              <div className="rounded-xl bg-dark-bg/90 backdrop-blur-sm border border-dark-accent1/10 p-12">
                <Plus className="w-16 h-16 text-dark-text/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-dark-text/60 mb-2">No Projects Yet</h3>
                <p className="text-dark-text/40 mb-6">Start by creating your first ICO project.</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-dark-button text-dark-text font-medium transition-all transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsDashboard;
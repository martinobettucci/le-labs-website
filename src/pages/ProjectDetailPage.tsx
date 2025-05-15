import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { Project } from '../types/data';
import { 
  Star, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Github, 
  FileText, 
  ExternalLink,
  Play
} from 'lucide-react';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = useData();
  const { isFollowing, followProject, unfollowProject, updateLastChecked } = useUserPreferences();
  const [project, setProject] = useState<Project | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  
  useEffect(() => {
    if (data && data.projects && slug) {
      const foundProject = data.projects.find(p => p.slug === slug);
      if (foundProject) {
        setProject(foundProject);
        
        // Update last checked time when viewing a followed project
        if (isFollowing(foundProject.id)) {
          updateLastChecked(foundProject.id);
        }
      }
    }
  }, [data, slug, isFollowing, updateLastChecked]);
  
  const handleFollowClick = async () => {
    if (!project) return;
    
    if (isFollowing(project.id)) {
      await unfollowProject(project.id);
    } else {
      await followProject(project.id);
    }
  };
  
  if (loading || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  const followed = isFollowing(project.id);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Status icons and colors
  const statusConfig = {
    planning: { icon: <Clock size={18} />, text: 'Planning', color: 'text-gray-400' },
    active: { icon: <AlertTriangle size={18} />, text: 'Active', color: 'text-success' },
    paused: { icon: <Clock size={18} />, text: 'Paused', color: 'text-gray-400' },
    completed: { icon: <CheckCircle size={18} />, text: 'Completed', color: 'text-highlight' },
  };
  
  const statusInfo = statusConfig[project.status];

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back link */}
        <div className="mb-6">
          <Link to="/projects" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Back to projects
          </Link>
        </div>
        
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-7">
              <div className="mb-4 flex items-center">
                <div className={`flex items-center mr-4 ${statusInfo.color}`}>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.text}</span>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">Updated {formatDate(project.lastUpdated)}</span>
                </div>
              </div>
              
              <h1 className="font-heading text-white mb-4">{project.title}</h1>
              
              <p className="text-xl text-gray-300 mb-6">{project.summary}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-800 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <button
                onClick={handleFollowClick}
                className={`inline-flex items-center px-5 py-2 ${
                  followed
                    ? 'bg-highlight text-background'
                    : 'border border-highlight text-highlight hover:bg-highlight hover:text-background'
                } transition-colors`}
              >
                <Star size={16} className="mr-2" />
                {followed ? 'Following' : 'Follow Project'}
              </button>
            </div>
            
            <div className="lg:col-span-5">
              {project.image && (
                <div className="overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>
              )}
              
              {/* Project Links */}
              {project.links && (
                <div className="bg-gray-800 p-4 mt-4 grid grid-cols-2 gap-4">
                  {project.links.github && (
                    <a 
                      href={project.links.github} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <Github size={16} className="mr-2 text-primary" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  
                  {project.links.license && (
                    <a 
                      href={project.links.license} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <FileText size={16} className="mr-2 text-primary" />
                      <span>License</span>
                    </a>
                  )}
                  
                  {project.links.demo && (
                    <a 
                      href={project.links.demo} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink size={16} className="mr-2 text-primary" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  
                  {project.links.documentation && (
                    <a 
                      href={project.links.documentation} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <FileText size={16} className="mr-2 text-primary" />
                      <span>Documentation</span>
                    </a>
                  )}
                  
                  {project.links.video && (
                    <button 
                      onClick={() => setShowVideo(true)}
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <Play size={16} className="mr-2 text-primary" />
                      <span>Demo Video</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Video modal */}
        {showVideo && project.links?.video && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <div className="max-w-4xl w-full aspect-video bg-black relative">
              <button 
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src={project.links.video} 
                title={`${project.title} Demo Video`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Project details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10"
            >
              <h2 className="font-heading text-2xl mb-4">About this Project</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">{project.description}</p>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-heading text-2xl mb-4">Updates</h2>
              
              <div className="space-y-4">
                {project.updates.length > 0 ? (
                  project.updates.map((update, index) => (
                    <motion.div 
                      key={update.hash}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-gray-800 p-4"
                    >
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(update.date)}</span>
                      </div>
                      <h3 className="font-medium mb-2">{update.title}</h3>
                      <p className="text-sm text-gray-300">{update.content}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-400 italic">No updates available yet.</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
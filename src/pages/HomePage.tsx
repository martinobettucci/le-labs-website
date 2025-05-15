import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import ProjectTile from '../components/tiles/ProjectTile';
import MetroTile from '../components/tiles/MetroTile';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { data, loading } = useData();
  const { preferences, isFollowing } = useUserPreferences();
  
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const homeData = data.pages.home;
  const featuredProjects = data.projects.filter(p => p.featured);
  
  // Check for new updates in followed projects
  const hasNewUpdates = (projectId: string) => {
    if (!isFollowing(projectId)) return false;
    
    const project = data.projects.find(p => p.id === projectId);
    const followedProject = preferences.followedProjects.find(fp => fp.id === projectId);
    
    if (!project || !followedProject || !project.updates || project.updates.length === 0) {
      return false;
    }
    
    const lastChecked = new Date(followedProject.lastChecked);
    return project.updates.some(update => new Date(update.date) > lastChecked);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <motion.section 
        className="bg-primary text-white py-20 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-heading font-bold mb-4">{homeData.layout?.[0].content.heading}</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{homeData.layout?.[0].content.subheading}</p>
            <Link 
              to="/projects" 
              className="inline-flex items-center px-6 py-3 bg-highlight text-background font-bold hover:bg-highlight-light transition-colors"
            >
              {homeData.layout?.[0].content.cta}
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Featured Projects - Modified to use grid for wider tiles */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-white mb-3">{homeData.layout?.[1].content.heading}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{homeData.layout?.[1].content.description}</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredProjects.map((project, index) => (
              <motion.div 
                key={project.id} 
                variants={itemVariants}
                className={`${
                  // Apply dynamic grid column spans for layout variation
                  index % 3 === 0 ? 'md:col-span-7' : 
                  index % 3 === 1 ? 'md:col-span-5' : 'md:col-span-12'
                }`}
              >
                <ProjectTile 
                  project={project} 
                  hasNewUpdates={hasNewUpdates(project.id)}
                />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Link 
              to="/projects" 
              className="inline-flex items-center text-primary hover:text-highlight font-medium"
            >
              View all projects
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Your News Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-white mb-3">Project Updates</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Follow projects to receive updates directly in your personalized news feed</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center bg-gray-800 p-8"
          >
            <motion.div className="mb-6">
              <svg className="mx-auto w-16 h-16 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </motion.div>
            
            <h3 className="font-heading text-xl mb-4">Stay Updated on Your Projects</h3>
            <p className="text-gray-300 mb-6">
              Follow projects you're interested in and check your personalized news feed to stay updated
              on the latest developments.
            </p>
            <Link 
              to="/your-news" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              View your news feed
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-20" 
        style={{ 
          backgroundColor: homeData.layout?.[3].styles?.background || '#238C33',
          color: homeData.layout?.[3].styles?.color || '#FFFFFF'
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading font-bold mb-6">{homeData.layout?.[3].content.heading}</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">{homeData.layout?.[3].content.description}</p>
            <Link 
              to={homeData.layout?.[3].content.buttonLink} 
              className="inline-flex items-center px-6 py-3 bg-background text-white font-bold hover:bg-gray-800 transition-colors"
            >
              {homeData.layout?.[3].content.buttonText}
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
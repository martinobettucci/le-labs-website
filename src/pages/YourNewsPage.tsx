import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import NewsTile from '../components/tiles/NewsTile';
import { Calendar, HelpCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const YourNewsPage: React.FC = () => {
  const { data, loading } = useData();
  const { preferences, isFollowing } = useUserPreferences();
  
  // Get news for followed projects
  const followedProjectNews = useMemo(() => {
    if (!data || !data.projects || preferences.followedProjects.length === 0) {
      return [];
    }
    
    // Get all followed projects
    const followedProjects = data.projects.filter(project => 
      isFollowing(project.id)
    );
    
    // Map to create news items
    const newsItems = followedProjects.flatMap(project => {
      const followedProject = preferences.followedProjects.find(fp => fp.id === project.id);
      if (!followedProject || !project.updates || project.updates.length === 0) {
        return [];
      }
      
      const lastChecked = new Date(followedProject.lastChecked);
      
      // Filter updates that are newer than last checked
      const unreadUpdates = project.updates.filter(update => 
        new Date(update.date) > lastChecked
      );
      
      // Create news items from unread updates
      return unreadUpdates.map(update => ({
        id: `${project.id}-${update.hash}`,
        hash: `${project.id}-${update.hash}`, // Dynamic hash calculation
        date: update.date,
        title: `${project.title}: ${update.title}`,
        summary: update.content,
        content: update.content,
        image: project.image,
        tileStyles: project.tileStyles,
        projectId: project.id,
        projectSlug: project.slug
      }));
    });
    
    // Sort by date (newest first)
    return newsItems.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [data, preferences.followedProjects, isFollowing]);
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
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
  
  // Handle no followed projects
  if (preferences.followedProjects.length === 0) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-white mb-4">Your News</h1>
            <p className="text-xl text-gray-300">
              Follow projects to see their updates here.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 p-8 text-center max-w-2xl mx-auto"
          >
            <HelpCircle size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="font-heading text-2xl mb-4">No Followed Projects</h2>
            <p className="text-gray-300 mb-6">
              You haven't followed any projects yet. Follow projects to receive updates about them in your news feed.
            </p>
            <Link 
              to="/projects" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              <Star size={18} className="mr-2" />
              Browse Projects to Follow
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Handle no unread news
  if (followedProjectNews.length === 0) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-white mb-4">Your News</h1>
            <p className="text-xl text-gray-300">
              Updates from projects you follow.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 p-8 text-center max-w-2xl mx-auto"
          >
            <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="font-heading text-2xl mb-4">No New Updates</h2>
            <p className="text-gray-300 mb-6">
              There are no new updates from your followed projects. Check back later or follow more projects.
            </p>
            <Link 
              to="/projects" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Browse More Projects
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading text-white mb-4">Your News</h1>
          <p className="text-xl text-gray-300">
            Updates from projects you follow.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {followedProjectNews.slice(0, 6).map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/projects/${news.projectSlug}`}>
                <NewsTile news={news} />
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-heading text-2xl mb-6">All Updates</h2>
          
          <div className="space-y-8">
            {followedProjectNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="bg-gray-900 p-6"
              >
                <div className="flex items-center text-gray-400 mb-3">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">{formatDate(news.date)}</span>
                </div>
                
                <h3 className="font-heading text-xl mb-3">
                  <Link to={`/projects/${news.projectSlug}`} className="hover:text-highlight transition-colors">
                    {news.title}
                  </Link>
                </h3>
                
                <p className="text-gray-300 mb-4">{news.content}</p>
                
                {news.image && (
                  <Link to={`/projects/${news.projectSlug}`} className="block mt-4">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-auto rounded-md"
                    />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default YourNewsPage;
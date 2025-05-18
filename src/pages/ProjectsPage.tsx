import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import ProjectTile from '../components/tiles/ProjectTile';
import { Filter, Star } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const { data, loading } = useData();
  const { preferences, isFollowing } = useUserPreferences();
  
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [showOnlyFollowed, setShowOnlyFollowed] = useState(false);
  
  useEffect(() => {
    if (!data || !data.projects) return;
    
    let filtered = [...data.projects];
    
    // Filter by status
    if (activeStatus !== 'all') {
      filtered = filtered.filter(project => project.status === activeStatus);
    }
    
    // Filter by tag
    if (activeFilter !== 'all') {
      filtered = filtered.filter(project => project.tags.includes(activeFilter));
    }
    
    // Filter by followed
    if (showOnlyFollowed) {
      filtered = filtered.filter(project => isFollowing(project.id));
    }
    
    setFilteredProjects(filtered);
  }, [data, activeFilter, activeStatus, showOnlyFollowed, isFollowing]);
  
  // Get unique tags from all projects
  const getUniqueTags = () => {
    if (!data || !data.projects) return [];
    
    const allTags = data.projects.flatMap(project => project.tags);
    return ['all', ...new Set(allTags)];
  };
  
  // Define the repeating pattern of tile sizes
  const tilePatterns = [
    [12],                     // 1 large tile (full row)
    [6, 6],                   // 2 medium tiles (half row each)
    [6, 3, 3],                // 1 medium tile + 2 small tiles
    [3, 6, 3],                // 1 small tile + 1 medium tile + 1 small tile
    [3, 3, 6]                 // 2 small tiles + 1 medium tile
  ];
  
  // Function to generate randomized layout pattern
  const generateLayoutPattern = (projects) => {
    // Create a randomly shuffled copy of the tile patterns for even more randomness
    const shuffledPatterns = [...tilePatterns]
      .sort(() => Math.random() - 0.5);
    
    // Apply the pattern to projects
    const result = [];
    let patternIndex = 0;
    let currentRow = [];
    let currentRowWidth = 0;
    
    for (let i = 0; i < projects.length; i++) {
      const currentPattern = shuffledPatterns[patternIndex % shuffledPatterns.length];
      
      // For each pattern, go through its column spans
      for (let spanIndex = 0; spanIndex < currentPattern.length && i < projects.length; spanIndex++) {
        const span = currentPattern[spanIndex];
        
        // If adding this span would exceed 12 columns, start a new row
        if (currentRowWidth + span > 12) {
          // Fill any remaining space with the current tile (if it's small enough)
          if (12 - currentRowWidth <= 4 && i < projects.length) {
            result.push({
              ...projects[i],
              colSpan: 12 - currentRowWidth
            });
            i++;
          }
          
          // Reset row tracking
          currentRowWidth = 0;
          patternIndex++;
        }
        
        // Add the current tile with the appropriate span
        if (i < projects.length) {
          result.push({
            ...projects[i],
            colSpan: span
          });
          currentRowWidth += span;
          
          // If we've filled a row, increment pattern and reset row width
          if (currentRowWidth === 12) {
            currentRowWidth = 0;
            patternIndex++;
          }
        }
      }
    }
    
    return result;
  };
  
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

  const uniqueTags = getUniqueTags();
  const layoutProjects = generateLayoutPattern(filteredProjects);
  
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
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-white mb-4">Projects</h1>
          <p className="text-gray-400 max-w-2xl">
            Explore our research projects and initiatives. Follow projects to receive updates on new developments.
          </p>
        </motion.div>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <Filter size={20} className="mr-2 text-gray-400" />
              <span className="text-gray-400 mr-3">Filters:</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowOnlyFollowed(!showOnlyFollowed)}
                className={`flex items-center px-3 py-1.5 border text-sm ${
                  showOnlyFollowed 
                    ? 'border-highlight text-highlight' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                <Star size={14} className="mr-1" />
                Followed
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="mr-4 mb-2">
              <span className="text-gray-400 text-sm mb-1 block">Status:</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'planning', 'active', 'paused', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-3 py-1.5 text-sm ${
                      activeStatus === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-gray-400 text-sm mb-1 block">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`px-3 py-1.5 text-sm ${
                      activeFilter === tag
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {tag === 'all' ? 'All Tags' : tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Grid with dynamic layout */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-md">
            <p className="text-gray-400 mb-2">No projects match your filters</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setActiveStatus('all');
                setShowOnlyFollowed(false);
              }}
              className="text-primary hover:text-highlight underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {layoutProjects.map((project) => (
              <motion.div 
                key={project.id} 
                variants={itemVariants}
                className={`md:col-span-${project.colSpan}`}
              >
                <ProjectTile 
                  project={project} 
                  hasNewUpdates={hasNewUpdates(project.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
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
  
  // Generate layout pattern for projects
  const generateLayoutPattern = (projects: any[]) => {
    // Each project will have a dynamically assigned size
    return projects.map((project, index) => {
      // Get a seed based on index to ensure some consistency in randomness
      const seed = index % 7; // Using modulo 7 to create variety
      
      // Assign column spans based on different patterns to ensure packed rows
      let colSpan;
      let pattern = seed;
      
      // Every 12 projects, create a pattern that ensures rows are filled
      const cyclePosition = index % 12;
      
      if (cyclePosition === 0) {
        // Start with a large project (full row)
        colSpan = 12;
      } else if (cyclePosition === 1 || cyclePosition === 7) {
        // 2 medium projects (6+6)
        colSpan = 6;
      } else if (cyclePosition === 2 || cyclePosition === 3 || cyclePosition === 4) {
        // 3 projects (4+4+4)
        colSpan = 4;
      } else if (cyclePosition === 5 || cyclePosition === 6 || cyclePosition === 8 || cyclePosition === 9) {
        // 4 small projects (3+3+3+3)
        colSpan = 3;
      } else if (cyclePosition === 10) {
        // Mixed row: medium + small (8+4)
        colSpan = 8;
      } else if (cyclePosition === 11) {
        // Mixed row: small (continuation of previous)
        colSpan = 4;
      }
      
      // Introduce some additional randomness for visual interest
      // But ensure we maintain our tight packing
      if (index > 0 && index % 23 === 0) {
        // Occasionally insert a full-width project
        colSpan = 12;
      }
      
      return {
        ...project,
        colSpan
      };
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
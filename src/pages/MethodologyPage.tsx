import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import MetroTile from '../components/tiles/MetroTile';
import { CheckCircle, FileText, Lightbulb, Users, Code, RefreshCw, ArrowRight } from 'lucide-react';

const MethodologyPage: React.FC = () => {
  const { data, loading } = useData();
  
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

  const methodologyData = data.pages.methodology;
  
  // Images for methodology steps
  const methodologyImages = [
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Research
    "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Exploration
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Prototyping
    "https://images.pexels.com/photos/7439144/pexels-photo-7439144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Testing
    "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Refinement
    "https://images.pexels.com/photos/3176460/pexels-photo-3176460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"  // Implementation
  ];
  
  // Create methodology tiles with alternating content
  const methodologyTiles = [
    {
      title: "Research Phase",
      description: "We start by identifying unmet needs and critical gaps in creative workflows through thorough industry research and stakeholder interviews.",
      image: methodologyImages[0],
      tileStyles: { background: "#23468C", color: "#FFFFFF", size: "medium" },
      bulletPoints: [
        "Stakeholder interviews and market analysis",
        "Literature review and competitive intelligence",
        "Opportunity identification and problem framing",
        "Research question formulation"
      ]
    },
    {
      title: "Exploration",
      description: "Once we've defined our research questions, we explore technical possibilities and constraints through iterative experimentation and creative exploration.",
      image: methodologyImages[1],
      tileStyles: { background: "#238C33", color: "#FFFFFF", size: "medium" },
      bulletPoints: [
        "Technical exploration and feasibility assessment",
        "Creative ideation and concept generation",
        "Boundary pushing and first principles thinking",
        "Experimental techniques and frameworks"
      ]
    },
    {
      title: "Prototyping",
      description: "We develop proof-of-concept prototypes that demonstrate key aspects of our research findings and test core hypotheses about usability and functionality.",
      image: methodologyImages[2],
      tileStyles: { background: "#D9CF4A", color: "#0D0D0D", size: "large" },
      bulletPoints: [
        "Rapid prototyping and technical development",
        "Core mechanics and algorithms implementation",
        "Low-fidelity to high-fidelity progression",
        "Isolated feature testing and validation"
      ]
    },
    {
      title: "User Testing",
      description: "All our research undergoes thorough testing with real users in authentic contexts, gathering qualitative and quantitative data about effectiveness and usability.",
      image: methodologyImages[3],
      tileStyles: { background: "#F24141", color: "#FFFFFF", size: "medium" },
      bulletPoints: [
        "Contextual inquiry and observational research",
        "Usability testing with target users",
        "Quantitative performance metrics",
        "Qualitative feedback collection and analysis" 
      ]
    },
    {
      title: "Refinement",
      description: "Based on insights from user testing, we refine our prototypes and research directions, often going through multiple iterations of improvement.",
      image: methodologyImages[4],
      tileStyles: { background: "#23468C", color: "#FFFFFF", size: "medium" },
      bulletPoints: [
        "Data-driven iterations and improvements",
        "Technical optimization and performance enhancements",
        "User experience refinement",
        "Research direction adjustments as needed"
      ]
    },
    {
      title: "Implementation",
      description: "When research shows promise for practical application, we transition from pure research to production development with our engineering teams.",
      image: methodologyImages[5],
      tileStyles: { background: "#238C33", color: "#FFFFFF", size: "medium" },
      bulletPoints: [
        "Knowledge transfer to production teams",
        "Documentation and best practices creation",
        "Production code development",
        "Scalability and performance optimization"
      ]
    }
  ];
  
  // Define the repeating pattern of tile sizes
  const tilePatterns = [
    [12],                     // 1 large tile (full row)
    [6, 6],                   // 2 medium tiles (half row each)
    [6, 3, 3],                // 1 medium tile + 2 small tiles
    [3, 6, 3],                // 1 small tile + 1 medium tile + 1 small tile
    [3, 3, 6]                 // 2 small tiles + 1 medium tile
  ];
  
  // Generate randomized layout for methodology tiles
  const generateDynamicLayout = (tiles) => {
    // Randomize the starting point in the pattern
    const startPatternIndex = Math.floor(Math.random() * tilePatterns.length);
    
    // Apply the pattern to tiles
    const result = [];
    let patternIndex = startPatternIndex;
    let tileIndex = 0;
    
    while (tileIndex < tiles.length) {
      const currentPattern = tilePatterns[patternIndex % tilePatterns.length];
      
      // Apply each column span in the current pattern
      for (let i = 0; i < currentPattern.length && tileIndex < tiles.length; i++) {
        result.push({
          ...tiles[tileIndex],
          colSpan: currentPattern[i]
        });
        tileIndex++;
      }
      
      patternIndex++;
    }
    
    return result;
  };
  
  const dynamicTiles = generateDynamicLayout(methodologyTiles);
  
  // Render bullet points content for each tile
  const renderBulletPoints = (points: string[]) => (
    <div className="space-y-2">
      <h4 className="font-medium mb-2">Key Activities:</h4>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-white mb-4">{methodologyData.title}</h1>
            <p className="text-xl text-gray-300">{methodologyData.description}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 bg-gray-900 p-8"
          >
            <h2 className="font-heading text-2xl mb-4 text-white">Our Philosophy</h2>
            <div className="text-gray-300">
              <p className="mb-4">
                At LE LABS, we approach our research with a human-centered philosophy combined with a strong
                technological foundation. We believe that the best creative tools emerge at the intersection
                of human needs and technological possibilities.
              </p>
              <p>
                Our multidisciplinary team includes researchers, designers, engineers, and artists who collaborate
                to explore new frontiers in creative technology while always keeping the end-user experience
                at the heart of our work.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-heading text-2xl mb-8 text-white text-center">Our Methodology Stages</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {dynamicTiles.map((tile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className={`md:col-span-${tile.colSpan}`}
                >
                  <MetroTile
                    title={tile.title}
                    description={tile.description}
                    tileStyles={tile.tileStyles}
                    image={tile.image}
                    links={renderBulletPoints(tile.bulletPoints)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-gray-900 p-8">
              <div className="flex items-center mb-4">
                <Lightbulb className="mr-3 text-highlight" size={24} />
                <h2 className="font-heading text-2xl">Innovative Approach</h2>
              </div>
              <p className="text-gray-300">
                We embrace experimental methodologies and push boundaries in our research, encouraging 
                creative risk-taking and exploration of unconventional solutions to complex problems.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8">
              <div className="flex items-center mb-4">
                <Users className="mr-3 text-highlight" size={24} />
                <h2 className="font-heading text-2xl">Collaborative Research</h2>
              </div>
              <p className="text-gray-300">
                Our research thrives on collaboration, both within our multidisciplinary team and through 
                partnerships with academic institutions, industry experts, and the creative community.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16 p-10 border border-primary"
          >
            <h2 className="font-heading text-2xl mb-6 text-center">Our Research Cycle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-white" />
                </div>
                <h3 className="font-heading text-xl mb-2">Define</h3>
                <p className="text-gray-400">Identify needs and research questions based on industry insights</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center mx-auto mb-4">
                  <Code size={24} className="text-white" />
                </div>
                <h3 className="font-heading text-xl mb-2">Explore</h3>
                <p className="text-gray-400">Develop prototypes and test concepts with real users</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-highlight flex items-center justify-center mx-auto mb-4">
                  <RefreshCw size={24} className="text-background" />
                </div>
                <h3 className="font-heading text-xl mb-2">Deliver</h3>
                <p className="text-gray-400">Refine findings and transition to production development</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center p-10"
            style={{ backgroundColor: '#23468C' }}
          >
            <h2 className="font-heading text-2xl mb-4 text-white">Interested in our approach?</h2>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              If you're interested in learning more about our methodology or would like to discuss potential 
              research collaborations, we'd love to hear from you.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-white text-primary font-medium hover:bg-gray-100 transition-colors"
            >
              Get in touch
              <ArrowRight size={18} className="ml-2" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MethodologyPage;

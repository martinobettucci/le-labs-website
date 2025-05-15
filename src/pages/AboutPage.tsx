import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { ExternalLink, Github, Linkedin, Mail, Phone, Youtube } from 'lucide-react';

const AboutPage: React.FC = () => {
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

  const aboutData = data.pages.about;
  
  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-white mb-4">{aboutData.title}</h1>
            <p className="text-xl text-gray-300">{aboutData.description}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="prose prose-invert max-w-none">
              {aboutData.content.split('\n').map((paragraph, i) => (
                <p key={i} className="text-gray-300 mb-4">{paragraph}</p>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-gray-900 p-8">
              <h2 className="font-heading text-2xl mb-4">Our Mission</h2>
              <p className="text-gray-300">
                To identify, explore, and develop new tools and methodologies that expand creative possibilities while solving real business challenges. We believe that technological innovation should serve human creativity, not replace it.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8">
              <h2 className="font-heading text-2xl mb-4">Our Vision</h2>
              <p className="text-gray-300">
                A future where creative technologies are human-centered, accessible, and enhance the capabilities of creative professionals across industries. We strive to create tools that remove friction from creative processes.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-900 p-8 mb-16"
          >
            <h2 className="font-heading text-2xl mb-4">About P2Enjoy Studio</h2>
            <p className="text-gray-300 mb-4">
              P2ENJOY SAS was founded in 2022 by Martino Bettucci as a société par actions simplifiée unipersonnelle (SASU). 
              The company is registered with RCS Paris under SIREN 918 234 667 and VAT number FR43 918 234 667, with a 
              social capital of 5,000€.
            </p>
            <p className="text-gray-300 mb-4">
              Headquartered at 122 rue Amelot, 75011 Paris, P2Enjoy Studio specializes in developing artificial intelligence 
              and blockchain (Web3) solutions through four main business areas:
            </p>
            
            <ul className="list-disc pl-5 text-gray-300 mb-4 space-y-2">
              <li><strong>Accompaniment:</strong> Consulting, development, hosting, and project management</li>
              <li><strong>Investment:</strong> Participation in educational and media initiatives aligned with ethical values</li>
              <li><strong>Training:</strong> Certified training in AI and blockchain delivered by accredited trainers</li>
              <li><strong>Democratization:</strong> Organization of events such as the IA-WEB3 Event Show and Discovery Days</li>
            </ul>
            
            <p className="text-gray-300 mb-6">
              The company operates under the APE/NAF code 6201Z (computer programming) and has a team of 2-10 collaborators.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading text-xl mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="mr-2 text-primary" size={18} />
                    <a href="mailto:contact@p2enjoy.studio" className="text-gray-300 hover:text-white">contact@p2enjoy.studio</a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 text-primary" size={18} />
                    <a href="mailto:ceo@p2enjoy.studio" className="text-gray-300 hover:text-white">ceo@p2enjoy.studio</a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 text-primary" size={18} />
                    <a href="tel:+33782718617" className="text-gray-300 hover:text-white">+33 (0)7 82 71 86 17</a>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading text-xl mb-3">Online Resources</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <ExternalLink className="mr-2 text-primary" size={18} />
                    <a href="https://p2enjoy.studio" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Website</a>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="mr-2 text-primary" size={18} />
                    <a href="https://blog.p2enjoy.studio" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Blog</a>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="mr-2 text-primary" size={18} />
                    <a href="https://portfolio.p2enjoy.studio" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">Portfolio</a>
                  </div>
                  <div className="flex items-center">
                    <Github className="mr-2 text-primary" size={18} />
                    <a href="https://github.com/P2Enjoy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">GitHub</a>
                  </div>
                  <div className="flex items-center">
                    <Youtube className="mr-2 text-primary" size={18} />
                    <a href="https://www.youtube.com/@p2enjoy-sas" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">YouTube</a>
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="mr-2 text-primary" size={18} />
                    <a href="https://www.linkedin.com/company/p2enjoy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">LinkedIn</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-10"
            style={{ backgroundColor: '#23468C' }}
          >
            <h2 className="font-heading text-2xl mb-6 text-white">Connect with P2Enjoy Studio</h2>
            <p className="text-white mb-6">
              LE LABS is the research and development division of P2Enjoy Studio, exploring creative technologies 
              and their business applications in AI and blockchain.
            </p>
            <a 
              href="https://p2enjoy.studio" 
              className="inline-flex items-center px-6 py-3 bg-highlight text-background font-bold hover:bg-highlight-light transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit P2Enjoy Studio
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
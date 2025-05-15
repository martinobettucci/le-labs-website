import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Mail, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">LE LABS</span>
            </Link>
            
            <p className="mb-4 text-gray-400 max-w-md">
              The Laboratory About Business Solutions (LE LABS) is the R&D department of P2Enjoy Studio, 
              exploring creative technologies and their business applications.
            </p>
            
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://www.linkedin.com/company/p2enjoy" 
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/P2Enjoy" 
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@p2enjoy-sas" 
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="mailto:contact@p2enjoy.studio" 
                className="text-gray-400 hover:text-white transition-colors" 
                aria-label="Email"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-white text-lg mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/methodology" className="hover:text-white transition-colors">Methodology</Link></li>
              <li><Link to="/your-news" className="hover:text-white transition-colors">Your News</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-white text-lg mb-4">P2Enjoy Studio</h4>
            <a 
              href="https://p2enjoy.studio" 
              className="flex items-center hover:text-white transition-colors mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit P2Enjoy
              <ExternalLink size={16} className="ml-1" />
            </a>
            
            <a 
              href="https://blog.p2enjoy.studio" 
              className="flex items-center hover:text-white transition-colors mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
              <ExternalLink size={16} className="ml-1" />
            </a>
            
            <a 
              href="https://portfolio.p2enjoy.studio" 
              className="flex items-center hover:text-white transition-colors mb-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
              <ExternalLink size={16} className="ml-1" />
            </a>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} LE LABS.</p>
              <p>A division of P2ENJOY SAS.</p>
              <p className="mt-1">SIREN: 918 234 667</p>
              <p>122 rue Amelot, 75011 Paris</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
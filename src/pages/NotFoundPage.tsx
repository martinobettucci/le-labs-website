import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <AlertTriangle size={64} className="mx-auto mb-6 text-error" />
          
          <h1 className="font-heading text-6xl mb-4">404</h1>
          <h2 className="font-heading text-2xl mb-6">Page Not Found</h2>
          
          <p className="text-xl text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            <Home size={18} className="mr-2" />
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
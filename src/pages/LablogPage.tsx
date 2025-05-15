import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import NewsTile from '../components/tiles/NewsTile';
import { Calendar } from 'lucide-react';

const LablogPage: React.FC = () => {
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

  const newsItems = data.news;
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-heading text-white mb-4">Lablog</h1>
          <p className="text-xl text-gray-300">
            Updates, journals, and behind-the-scenes insights from our lab.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newsItems.map((news, index) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NewsTile news={news} />
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-heading text-2xl mb-6">Latest Updates</h2>
          
          <div className="space-y-8">
            {newsItems.map((news, index) => (
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
                
                <h3 className="font-heading text-xl mb-3">{news.title}</h3>
                
                <p className="text-gray-300 mb-4">{news.content}</p>
                
                {news.image && (
                  <div className="mt-4">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LablogPage;
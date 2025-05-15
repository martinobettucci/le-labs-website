import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../../types/data';
import { Calendar } from 'lucide-react';

interface NewsTileProps {
  news: NewsItem;
  onClick?: () => void;
}

const NewsTile: React.FC<NewsTileProps> = ({ news, onClick }) => {
  // Format date
  const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <motion.div
      onClick={onClick}
      className="metro-tile cursor-pointer"
      style={{ 
        backgroundColor: news.tileStyles.background, 
        color: news.tileStyles.color 
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {news.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={news.image} 
            alt={news.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center text-xs opacity-80 mb-2">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        <h3 className="font-heading font-bold text-lg mb-2">{news.title}</h3>
        <p className="text-sm opacity-90 line-clamp-3">{news.summary}</p>
      </div>
    </motion.div>
  );
};

export default NewsTile;
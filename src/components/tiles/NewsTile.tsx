import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../../types/data';
import { Calendar } from 'lucide-react';
import { useTilt } from '../../hooks/useTilt';

interface NewsTileProps {
  news: NewsItem;
  onClick?: () => void;
}

const NewsTile: React.FC<NewsTileProps> = ({ news, onClick }) => {
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt(14);

  // Format date
  const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="metro-tile metro-shine cursor-pointer"
      style={{
        backgroundColor: news.tileStyles.background,
        color: news.tileStyles.color,
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3 }}
    >
      {news.image && (
        <div className="h-40 overflow-hidden">
          <img src={news.image} alt={news.title} className="object-cover w-full h-full" />
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

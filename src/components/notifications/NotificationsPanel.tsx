import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useData } from '../../contexts/DataContext';
import { X, Bell, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const { data } = useData();
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Find project details for a notification
  const getProjectDetails = (projectId: string) => {
    return data?.projects.find(p => p.id === projectId);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <>
      {/* Notification Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.div 
            className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>
      
      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && createPortal(
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              className="bg-background text-white w-full max-w-md h-full shadow-lg overflow-hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 bg-gray-900 flex justify-between items-center">
                <h2 className="font-heading text-xl">Notifications</h2>
                <div className="flex items-center space-x-4">
                  {notifications.length > 0 && (
                    <button
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Close notifications"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-64px)] pb-4">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-full p-8 text-gray-400">
                    <Bell size={48} className="mb-4 opacity-30" />
                    <p className="text-lg mb-2">No notifications yet</p>
                    <p className="text-sm">Follow projects to receive updates when there's new activity</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {notifications.map(notification => {
                      const project = getProjectDetails(notification.projectId);
                      
                      if (!project) return null;
                      
                      return (
                        <motion.div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-800 transition-colors ${!notification.read ? 'bg-gray-800/40' : ''}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        >
                          <div className="flex justify-between items-start">
                            <Link 
                              to={`/projects/${project.slug}`}
                              className="flex-1"
                              onClick={() => handleNotificationClick(notification.id)}
                            >
                              <div className="flex items-start">
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-highlight mt-2 mr-2 flex-shrink-0" />
                                )}
                                
                                <div>
                                  <div className="flex items-center mb-1">
                                    <span
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: project.tileStyles.background }}
                                    />
                                    <span className="font-medium text-sm">
                                      {project.title}
                                    </span>
                                  </div>
                                  
                                  <h4 className="font-medium mb-1">{notification.update.title}</h4>
                                  <p className="text-sm text-gray-300 mb-2">{notification.update.content}</p>
                                  
                                  <div className="flex items-center text-xs text-gray-400">
                                    <Calendar size={12} className="mr-1" />
                                    <span>{formatDate(notification.update.date)}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            
                            <button
                              onClick={() => dismissNotification(notification.id)}
                              className="text-gray-500 hover:text-white p-1"
                              aria-label="Dismiss notification"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationsPanel;

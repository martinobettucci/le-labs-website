import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from './DataContext';
import { useUserPreferences } from './UserPreferencesContext';
import { Project, ProjectUpdate } from '../types/data';
import { createHash } from '../utils/hashUtils';

interface Notification {
  id: string;
  projectId: string;
  update: ProjectUpdate;
  read: boolean;
  timestamp: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data } = useData();
  const { preferences, updateLastChecked } = useUserPreferences();

  // Check for new updates when data or followed projects change
  useEffect(() => {
    if (!data || !data.projects) return;
    
    const newNotifications: Notification[] = [];
    
    // For each followed project
    preferences.followedProjects.forEach(followedProject => {
      const project = data.projects.find(p => p.id === followedProject.id);
      
      if (project && project.updates) {
        // Find updates that are newer than the last time the user checked
        const lastChecked = new Date(followedProject.lastChecked);
        
        project.updates.forEach(update => {
          const updateDate = new Date(update.date);
          
          if (updateDate > lastChecked) {
            // Calculate dynamic hash
            const dynamicHash = createHash(`${project.id}-${update.title}-${update.date}`);
            
            newNotifications.push({
              id: `${project.id}-${dynamicHash}`,
              projectId: project.id,
              update: { ...update, hash: dynamicHash },
              read: false,
              timestamp: new Date().toISOString(),
            });
          }
        });
      }
    });
    
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        // Filter out duplicates based on projectId and update hash
        const existingIds = new Set(prev.map(n => `${n.projectId}-${n.update.hash}`));
        const uniqueNew = newNotifications.filter(n => !existingIds.has(`${n.projectId}-${n.update.hash}`));
        return [...uniqueNew, ...prev];
      });
    }
  }, [data, preferences.followedProjects]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Find the notification and update lastChecked for its project
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      updateLastChecked(notification.projectId);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Update lastChecked for all projects with notifications
    const projectIds = [...new Set(notifications.map(n => n.projectId))];
    projectIds.forEach(projectId => {
      updateLastChecked(projectId);
    });
  };

  // Dismiss a notification
  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      dismissNotification,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

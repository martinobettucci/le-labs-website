import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface FollowedProject {
  id: string;
  lastChecked: string; // ISO date string
}

interface UserPreferences {
  followedProjects: FollowedProject[];
  theme: 'default' | 'high-contrast';
  reducedMotion: boolean;
}

interface UserPreferencesSchema extends DBSchema {
  preferences: {
    key: 'user-preferences';
    value: UserPreferences;
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  followProject: (projectId: string) => Promise<void>;
  unfollowProject: (projectId: string) => Promise<void>;
  isFollowing: (projectId: string) => boolean;
  setTheme: (theme: 'default' | 'high-contrast') => Promise<void>;
  setReducedMotion: (reduced: boolean) => Promise<void>;
  updateLastChecked: (projectId: string) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  followedProjects: [],
  theme: 'default',
  reducedMotion: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  preferences: defaultPreferences,
  followProject: async () => {},
  unfollowProject: async () => {},
  isFollowing: () => false,
  setTheme: async () => {},
  setReducedMotion: async () => {},
  updateLastChecked: async () => {},
});

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [db, setDb] = useState<IDBPDatabase<UserPreferencesSchema> | null>(null);

  // Initialize the database
  useEffect(() => {
    const initDB = async () => {
      const database = await openDB<UserPreferencesSchema>('le-labs-preferences', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('preferences')) {
            db.createObjectStore('preferences');
          }
        },
      });
      
      setDb(database);
      
      // Load existing preferences
      const storedPreferences = await database.get('preferences', 'user-preferences');
      if (storedPreferences) {
        setPreferences(storedPreferences);
      } else {
        // Initialize with defaults if nothing exists
        await database.put('preferences', defaultPreferences, 'user-preferences');
      }
    };
    
    initDB().catch(err => console.error('Failed to initialize preferences database:', err));
    
    return () => {
      db?.close();
    };
  }, []);

  // Save preferences to IndexedDB whenever they change
  const savePreferences = async (newPreferences: UserPreferences) => {
    if (db) {
      await db.put('preferences', newPreferences, 'user-preferences');
      setPreferences(newPreferences);
    }
  };

  // Follow a project
  const followProject = async (projectId: string) => {
    if (isFollowing(projectId)) return;
    
    const newPreferences = {
      ...preferences,
      followedProjects: [
        ...preferences.followedProjects,
        { id: projectId, lastChecked: new Date().toISOString() }
      ],
    };
    
    await savePreferences(newPreferences);
  };

  // Unfollow a project
  const unfollowProject = async (projectId: string) => {
    const newPreferences = {
      ...preferences,
      followedProjects: preferences.followedProjects.filter(p => p.id !== projectId),
    };
    
    await savePreferences(newPreferences);
  };

  // Check if a project is being followed
  const isFollowing = (projectId: string) => {
    return preferences.followedProjects.some(p => p.id === projectId);
  };

  // Update lastChecked timestamp for a project
  const updateLastChecked = async (projectId: string) => {
    if (!isFollowing(projectId)) return;
    
    const newPreferences = {
      ...preferences,
      followedProjects: preferences.followedProjects.map(p => 
        p.id === projectId 
          ? { ...p, lastChecked: new Date().toISOString() }
          : p
      ),
    };
    
    await savePreferences(newPreferences);
  };

  // Set theme preference
  const setTheme = async (theme: 'default' | 'high-contrast') => {
    const newPreferences = { ...preferences, theme };
    await savePreferences(newPreferences);
  };

  // Set reduced motion preference
  const setReducedMotion = async (reducedMotion: boolean) => {
    const newPreferences = { ...preferences, reducedMotion };
    await savePreferences(newPreferences);
  };

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      followProject,
      unfollowProject,
      isFollowing,
      setTheme,
      setReducedMotion,
      updateLastChecked,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
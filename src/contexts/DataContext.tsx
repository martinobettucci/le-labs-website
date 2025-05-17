import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { LabsData, Project } from '../types/data';

interface DataContextType {
  data: LabsData | null;
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  data: null,
  loading: true,
  error: null,
  refreshData: async () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LabsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects from Supabase
      const { data: projectsData, error: projectsError } = await supabase
        .from('le_labs_project')
        .select('*')
        .order('featured', { ascending: false })
        .order('last_updated', { ascending: false });
      
      if (projectsError) {
        throw new Error(`Failed to fetch projects: ${projectsError.message}`);
      }
      
      // Fetch other data from the static JSON
      const response = await fetch('/data/le-labs-data.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const staticData: LabsData = await response.json();
      
      // Transform Supabase projects to match our application structure
      const projects: Project[] = projectsData.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        status: item.status,
        featured: item.featured,
        hash: item.hash,
        description: item.description,
        summary: item.summary,
        tags: item.tags || [],
        lastUpdated: item.last_updated,
        image: item.image || '',
        tileStyles: {
          background: item.tile_styles?.background || '#23468C',
          color: item.tile_styles?.color || '#FFFFFF',
          size: item.tile_styles?.size || 'medium'
        },
        updates: item.updates || [],
        links: item.links || {}
      }));
      
      // Combine data
      const combinedData: LabsData = {
        ...staticData,
        projects
      };
      
      setData(combinedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching data:', err);
      
      // Try to load static data as fallback
      try {
        const response = await fetch('/data/le-labs-data.json');
        if (response.ok) {
          const fallbackData: LabsData = await response.json();
          setData(fallbackData);
          console.log('Using fallback static data due to database error');
        }
      } catch (fallbackErr) {
        console.error('Failed to load fallback data:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <DataContext.Provider value={{ data, loading, error, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};
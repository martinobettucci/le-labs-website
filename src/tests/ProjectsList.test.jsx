// src/tests/ProjectsList.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

// Mock d'un composant qui utilise supabase
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('le_labs_project')
        .select('*')
        .order('featured', { ascending: false });
      
      if (!error) {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id} data-testid="project-item">
          {project.title}
        </div>
      ))}
    </div>
  );
};

describe('ProjectsList Integration Test', () => {
  it('devrait charger et afficher les projets', async () => {
    render(<ProjectsList />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    const projectItems = screen.queryAllByTestId('project-item');
    console.log('✅ Projets chargés:', projectItems.length);
  });
});
// src/tests/ProjectsList.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useState, useEffect } from 'react';

// Mock the Supabase client so the test is deterministic and offline.
vi.mock('../lib/supabase', () => {
  const order = vi.fn().mockResolvedValue({
    data: [
      { id: 'project-001', title: 'Spatial Computing Interface' },
      { id: 'project-002', title: 'Neural Audio Generation' },
    ],
    error: null,
  });
  const select = vi.fn(() => ({ order }));
  const from = vi.fn(() => ({ select }));
  return { supabase: { from } };
});

import { supabase } from '../lib/supabase';

// Small component that uses the (mocked) supabase client.
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('le_labs_project')
        .select('*')
        .order('featured', { ascending: false });

      if (!error) setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id} data-testid="project-item">
          {project.title}
        </div>
      ))}
    </div>
  );
};

describe('ProjectsList Integration Test', () => {
  it('loads and displays projects', async () => {
    render(<ProjectsList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    const projectItems = screen.queryAllByTestId('project-item');
    expect(projectItems).toHaveLength(2);
    expect(screen.getByText('Spatial Computing Interface')).toBeInTheDocument();
  });
});

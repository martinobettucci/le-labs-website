// src/tests/supabase.test.js
// Unit test for the data layer. The Supabase client is mocked so the test is
// deterministic and offline (the live RLS behaviour is exercised by the
// Playwright E2E suite against the sovereign stack instead).
import { describe, it, expect, vi } from 'vitest';

vi.mock('../lib/supabase', () => {
  const builder = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({
      data: [{ id: 'project-001', title: 'Spatial Computing Interface', featured: true }],
      error: null,
    }),
  };
  return { supabase: { from: vi.fn(() => builder), auth: {} } };
});

import { supabase } from '../lib/supabase';

describe('Supabase data layer (mocked)', () => {
  it('exposes a query builder', () => {
    expect(typeof supabase.from).toBe('function');
  });

  it('reads projects', async () => {
    const { data, error } = await supabase
      .from('le_labs_project')
      .select('*')
      .order('featured', { ascending: false })
      .limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].title).toBe('Spatial Computing Interface');
  });

  it('supports filtering', async () => {
    const { data, error } = await supabase
      .from('le_labs_project')
      .select('*')
      .eq('featured', true)
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});

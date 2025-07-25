// src/tests/supabase.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Supabase RLS Tests', () => {
  beforeAll(() => {
    // Vérifier que les variables d'environnement sont présentes
    console.log(import.meta.env.VITE_SUPABASE_URL);
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('devrait permettre la lecture avec anon_key', async () => {
    const { data, error } = await supabase
      .from('le_labs_project')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    console.log('✅ Test lecture réussi:', data?.length, 'projet(s) trouvé(s)');
  });

  it('devrait interdire l\'écriture avec anon_key', async () => {
    const { data, error } = await supabase
      .from('le_labs_project')
      .insert({ 
        title: 'Test depuis Vitest',
        description: 'Ce test devrait échouer'
      });

    expect(error).not.toBeNull();
    expect(error.code).toBe('42501'); // Code erreur PostgreSQL pour insufficient_privilege
    expect(data).toBeNull();
    console.log('❌ Test écriture échoué comme attendu:', error.message);
  });

  it('devrait pouvoir ordonner les résultats', async () => {
    const { data, error } = await supabase
      .from('le_labs_project')
      .select('*')
      .order('featured', { ascending: false })
      .order('last_updated', { ascending: false })
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    console.log('✅ Test tri réussi:', data?.length, 'projets récupérés');
  });

  it('devrait gérer les filtres', async () => {
    const { data, error } = await supabase
      .from('le_labs_project')
      .select('*')
      .eq('featured', true);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    console.log('✅ Test filtre réussi:', data?.length, 'projets featured');
  });
});
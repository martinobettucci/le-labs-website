-- Add more variation to tile styles for existing projects
UPDATE le_labs_project
SET tile_styles = jsonb_build_object(
  'background', CASE id
    WHEN 'project-001' THEN '#23468C'  -- Deep blue
    WHEN 'project-002' THEN '#238C33'  -- Green
    WHEN 'project-003' THEN '#D9CF4A'  -- Yellow
    WHEN 'project-004' THEN '#F24141'  -- Red
    WHEN 'project-005' THEN '#8C2387'  -- Purple
    WHEN 'project-006' THEN '#478C4D'  -- Forest green
    WHEN 'project-007' THEN '#3B8C77'  -- Teal
    WHEN 'project-008' THEN '#8C5223'  -- Brown
    WHEN 'project-009' THEN '#8C3D23'  -- Rust
    WHEN 'project-010' THEN '#23788C'  -- Blue-teal
    ELSE tile_styles->>'background'
  END,
  'color', CASE id
    WHEN 'project-003' THEN '#0D0D0D'  -- Dark text for yellow background
    ELSE '#FFFFFF'                      -- White text for all others
  END
);

-- Add 5 more diverse projects
INSERT INTO le_labs_project (
  id, title, slug, status, featured, hash, description, summary, 
  tags, last_updated, image, tile_styles, links, updates
) VALUES 
-- Project 011: Ambient Computing Interfaces
(
  'project-011',
  'Ambient Computing Interfaces',
  'ambient-computing-interfaces',
  'planning',
  FALSE,
  'p9o8i7u6y5',
  'Exploring interfaces that blend seamlessly into environments and respond to context without explicit user commands.',
  'How can technology respond to our needs without requiring our attention? This project explores ambient computing that serves people without demanding interaction.',
  ARRAY['ambient', 'IoT', 'context-aware', 'UX'],
  '2025-04-05T09:30:00Z',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#4A23B5',
    'color', '#FFFFFF',
    'size', 'medium'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/ambient-interfaces',
    'license', 'https://opensource.org/licenses/MIT',
    'documentation', 'https://docs.lelabs.example/ambient-interfaces'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-011-p9o8i7',
      'date', '2025-04-05T09:30:00Z',
      'title', 'Research Framework',
      'content', 'Established framework for ambient interface evaluation focusing on attention cost, context sensitivity, and utility metrics.'
    )
  )
),

-- Project 012: Procedural Narrative Systems
(
  'project-012',
  'Procedural Narrative Systems',
  'procedural-narrative-systems',
  'active',
  TRUE,
  't5r4e3w2q1',
  'Developing systems that can generate compelling, coherent narratives that adapt to user actions and preferences.',
  'Can AI create stories that feel human-written yet adapt to each reader? This project explores procedural narrative generation with emotional intelligence.',
  ARRAY['narrative', 'procedural-generation', 'AI', 'storytelling'],
  '2025-04-15T14:20:00Z',
  'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#8C234B',
    'color', '#FFFFFF',
    'size', 'large'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/procedural-narrative',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://narrative.lelabs.example',
    'documentation', 'https://docs.lelabs.example/procedural-narrative'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-012-t5r4e3',
      'date', '2025-04-15T14:20:00Z',
      'title', 'Character Arc Generator',
      'content', 'Implemented system for generating character arcs that respond to reader choices while maintaining narrative consistency.'
    ),
    jsonb_build_object(
      'hash', 'upd-012-w2q1s0',
      'date', '2025-03-30T11:05:00Z',
      'title', 'Emotional Coherence Model',
      'content', 'Completed emotional coherence model that ensures generated narrative elements maintain appropriate emotional tone and progression.'
    )
  )
),

-- Project 013: Cross-Modal Sensory Translation
(
  'project-013',
  'Cross-Modal Sensory Translation',
  'cross-modal-sensory-translation',
  'active',
  FALSE,
  'd4f5g6h7j8',
  'Creating systems that can translate sensory information between modalities (visual to audio, tactile to visual, etc.).',
  'What if you could hear colors or feel sounds? This project explores translating information between sensory modalities for accessibility and new experiences.',
  ARRAY['accessibility', 'synesthesia', 'sensory', 'translation'],
  '2025-03-25T12:50:00Z',
  'https://images.pexels.com/photos/7242859/pexels-photo-7242859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#238C8C',
    'color', '#FFFFFF',
    'size', 'medium'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/cross-modal',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://sensory.lelabs.example',
    'documentation', 'https://docs.lelabs.example/cross-modal'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-013-d4f5g6',
      'date', '2025-03-25T12:50:00Z',
      'title', 'Visual-to-Tactile Mapping',
      'content', 'Completed algorithmic framework for translating visual information into tactile patterns with 82% recognition rate in blind user testing.'
    )
  )
),

-- Project 014: Decentralized Knowledge Systems
(
  'project-014',
  'Decentralized Knowledge Systems',
  'decentralized-knowledge-systems',
  'planning',
  FALSE,
  'k9l8m7n6b5',
  'Building resilient, distributed systems for knowledge preservation and access that resist centralized control and censorship.',
  'How can we ensure knowledge remains accessible despite political or technical disruptions? This project develops decentralized systems for preserving and sharing critical information.',
  ARRAY['decentralized', 'knowledge-management', 'resilience', 'censorship-resistance'],
  '2025-04-02T10:15:00Z',
  'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#2A568C',
    'color', '#FFFFFF',
    'size', 'small'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/decentralized-knowledge',
    'license', 'https://opensource.org/licenses/GPL-3.0',
    'documentation', 'https://docs.lelabs.example/decentralized-knowledge'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-014-k9l8m7',
      'date', '2025-04-02T10:15:00Z',
      'title', 'Architecture Specification',
      'content', 'Completed initial architecture specification for mesh network knowledge distribution with offline synchronization capabilities.'
    )
  )
),

-- Project 015: Biocompatible Electronics
(
  'project-015',
  'Biocompatible Electronics',
  'biocompatible-electronics',
  'completed',
  TRUE,
  'v5c4x3z2a1',
  'Researching electronic materials and designs that can safely integrate with biological systems for medical and augmentation applications.',
  'What if electronics could become part of our bodies without rejection or harmful effects? This project explores biocompatible materials and designs for integrated electronic systems.',
  ARRAY['bioelectronics', 'materials', 'medical', 'augmentation'],
  '2025-03-10T15:45:00Z',
  'https://images.pexels.com/photos/3861457/pexels-photo-3861457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#8C6D23',
    'color', '#FFFFFF',
    'size', 'large'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/biocompatible-electronics',
    'license', 'https://opensource.org/licenses/MIT',
    'documentation', 'https://docs.lelabs.example/biocompatible-electronics'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-015-v5c4x3',
      'date', '2025-03-10T15:45:00Z',
      'title', 'Research Completed',
      'content', 'Concluded research phase with publication of comprehensive findings on conductive polymers with minimal inflammatory response in biological tissues.'
    ),
    jsonb_build_object(
      'hash', 'upd-015-z2a1s0',
      'date', '2025-02-20T09:30:00Z',
      'title', 'Prototype Success',
      'content', 'Prototype sensor array successfully demonstrated 98% biocompatibility in laboratory tissue models with sustained functionality for 6 months.'
    )
  )
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  hash = EXCLUDED.hash,
  description = EXCLUDED.description,
  summary = EXCLUDED.summary,
  tags = EXCLUDED.tags,
  last_updated = EXCLUDED.last_updated,
  image = EXCLUDED.image,
  tile_styles = EXCLUDED.tile_styles,
  links = EXCLUDED.links,
  updates = EXCLUDED.updates;
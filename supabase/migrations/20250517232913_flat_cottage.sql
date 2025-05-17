/*
  # Seed projects data
  
  1. Data Import
    - Inserts project data into le_labs_project table
    - Contains all sample projects with their complete information
    - Properly formats JSON fields (tile_styles, links, updates)
  
  2. Implementation notes
    - Uses ON CONFLICT to handle idempotent insertion
    - Preserves data integrity with proper JSON formatting
*/

-- Insert project data with ON CONFLICT handling to make it idempotent
INSERT INTO le_labs_project (
  id, title, slug, status, featured, hash, description, summary, 
  tags, last_updated, image, tile_styles, links, updates
) VALUES 
-- Project 001: Spatial Computing Interface
(
  'project-001',
  'Spatial Computing Interface',
  'spatial-computing-interface',
  'active',
  TRUE,
  'a1b2c3d4e5',
  'Research into next-generation spatial computing interfaces for creative workflows.',
  'How might we reimagine creative tools for spatial computing environments? This research explores natural gestures and spatial organization for digital creation.',
  ARRAY['spatial', 'interface', 'creative-tools', 'gestural'],
  '2025-04-10T16:42:00Z',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#23468C',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/spatial-computing',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://demo.lelabs.example/spatial-interface',
    'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'documentation', 'https://docs.lelabs.example/spatial-computing'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-001-a1b2c3',
      'date', '2025-04-10T16:42:00Z',
      'title', 'Prototype Testing Results',
      'content', 'First round of user testing complete with 87% positive feedback on natural gesture recognition system.'
    ),
    jsonb_build_object(
      'hash', 'upd-001-f6g7h8',
      'date', '2025-04-05T09:15:00Z',
      'title', 'Development Milestone',
      'content', 'Core gesture recognition system now achieves 95% accuracy in controlled environments.'
    )
  )
),

-- Project 002: Neural Audio Generation 
(
  'project-002',
  'Neural Audio Generation',
  'neural-audio-generation',
  'active',
  TRUE,
  'f6g7h8i9j0',
  'AI-powered audio generation with focus on professional sound design applications.',
  'Exploring the intersection of machine learning and audio production to create new tools for sound designers and musicians.',
  ARRAY['audio', 'AI', 'generative', 'sound-design'],
  '2025-04-08T11:30:00Z',
  'https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#238C33',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/neural-audio',
    'license', 'https://opensource.org/licenses/Apache-2.0',
    'demo', 'https://audio.lelabs.example',
    'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'documentation', 'https://docs.lelabs.example/neural-audio'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-002-k4l5m6',
      'date', '2025-04-08T11:30:00Z',
      'title', 'New Training Dataset',
      'content', 'Expanded training data with 10,000 professional sound design samples for improved stylistic control.'
    )
  )
),

-- Project 003: Adaptive Color Systems
(
  'project-003',
  'Adaptive Color Systems',
  'adaptive-color-systems',
  'completed',
  FALSE,
  'k1l2m3n4o5',
  'Research on dynamic color systems that respond to environmental and user contexts.',
  'Can color systems adapt intelligently to user needs and environmental factors? This project explores dynamic color palettes for digital interfaces.',
  ARRAY['color', 'accessibility', 'adaptive', 'design-systems'],
  '2025-03-15T14:20:00Z',
  'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#D9CF4A',
    'color', '#0D0D0D'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/adaptive-color',
    'license', 'https://opensource.org/licenses/GPL-3.0',
    'demo', 'https://colors.lelabs.example',
    'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'documentation', 'https://docs.lelabs.example/adaptive-color'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-003-p7q8r9',
      'date', '2025-03-15T14:20:00Z',
      'title', 'Project Completion',
      'content', 'Final report published with findings on environmental color adaptation. Source code released as open-source library.'
    )
  )
),

-- Project 004: Haptic Information Design
(
  'project-004',
  'Haptic Information Design',
  'haptic-information-design',
  'planning',
  FALSE,
  'p6q7r8s9t0',
  'Exploring haptic feedback for communicating complex information structures.',
  'How can we use touch and haptic feedback to convey complex information? This research explores new methods for tactile data representation.',
  ARRAY['haptic', 'accessibility', 'information-design', 'physical'],
  '2025-04-01T09:45:00Z',
  'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#F24141',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/haptic-info',
    'license', 'https://opensource.org/licenses/MIT',
    'documentation', 'https://docs.lelabs.example/haptic-design'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-004-u1v2w3',
      'date', '2025-04-01T09:45:00Z',
      'title', 'Research Plan Approved',
      'content', 'Project plan and initial research methodology approved. Initial prototype development to begin next week.'
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
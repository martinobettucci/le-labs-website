-- Insert additional projects with unique IDs to provide more variety
INSERT INTO le_labs_project (
  id, title, slug, status, featured, hash, description, summary, 
  tags, last_updated, image, tile_styles, links, updates
) VALUES 
-- Project 005: Quantum Data Visualization
(
  'project-005',
  'Quantum Data Visualization',
  'quantum-data-visualization',
  'active',
  TRUE,
  'q5w6e7r8t9',
  'Exploring new visualization techniques for quantum computing data and complex multi-dimensional datasets.',
  'How can we visualize the inherently complex and counterintuitive nature of quantum data? This project develops new metaphors and interfaces for quantum information.',
  ARRAY['quantum', 'visualization', 'data-science', 'UI'],
  '2025-04-07T14:30:00Z',
  'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#8C2387',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/quantum-viz',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://quantum.lelabs.example',
    'documentation', 'https://docs.lelabs.example/quantum-viz'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-005-q5w6e7',
      'date', '2025-04-07T14:30:00Z',
      'title', 'Interactive Bloch Sphere',
      'content', 'Released first prototype of interactive Bloch sphere for intuitive qubit state visualization.'
    )
  )
),

-- Project 006: Biometric Art Generation
(
  'project-006',
  'Biometric Art Generation',
  'biometric-art-generation',
  'active',
  FALSE,
  'y7u8i9o0p1',
  'Creating personalized art and music generated from biometric data like heartbeat, brain activity, and movement patterns.',
  'What if your heartbeat could compose music? Or your brain activity could paint pictures? This project explores the intersection of biometric data and creative expression.',
  ARRAY['biometrics', 'generative-art', 'music', 'healthcare'],
  '2025-03-22T10:15:00Z',
  'https://images.pexels.com/photos/3760809/pexels-photo-3760809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#478C4D',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/biometric-art',
    'license', 'https://opensource.org/licenses/Apache-2.0',
    'demo', 'https://bio.lelabs.example',
    'documentation', 'https://docs.lelabs.example/biometric-art'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-006-y7u8i9',
      'date', '2025-03-22T10:15:00Z',
      'title', 'ECG Music Translation',
      'content', 'Completed algorithm for translating electrocardiogram data into melodic patterns with 87% listener satisfaction rating.'
    )
  )
),

-- Project 007: Sustainable Manufacturing Toolkit
(
  'project-007',
  'Sustainable Manufacturing Toolkit',
  'sustainable-manufacturing-toolkit',
  'planning',
  FALSE,
  'a9s8d7f6g5',
  'Developing open-source tools and methodologies for sustainable product manufacturing and lifecycle management.',
  'How can we make manufacturing more sustainable without compromising quality or increasing costs? This toolkit provides practical solutions for eco-friendly production processes.',
  ARRAY['sustainability', 'manufacturing', 'open-source', 'circular-economy'],
  '2025-04-03T08:45:00Z',
  'https://images.pexels.com/photos/3846106/pexels-photo-3846106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#3B8C77',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/sustainable-mfg',
    'license', 'https://opensource.org/licenses/GPL-3.0',
    'documentation', 'https://docs.lelabs.example/sustainable-manufacturing'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-007-a9s8d7',
      'date', '2025-04-03T08:45:00Z',
      'title', 'Initial Research Phase',
      'content', 'Completed literature review and industry practice analysis. Identified key opportunity areas in material sourcing and waste reduction.'
    )
  )
),

-- Project 008: Immersive Learning Environments
(
  'project-008',
  'Immersive Learning Environments',
  'immersive-learning-environments',
  'active',
  TRUE,
  'z1x2c3v4b5',
  'Creating spatially-aware educational environments that adapt to learner behavior and cognitive states.',
  'Learning environments that understand how you learn best and adapt accordingly - this project combines spatial computing, biometrics, and educational psychology.',
  ARRAY['education', 'spatial-computing', 'adaptive-learning', 'XR'],
  '2025-04-12T16:20:00Z',
  'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#8C5223',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/immersive-learning',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://learning.lelabs.example',
    'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'documentation', 'https://docs.lelabs.example/immersive-learning'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-008-z1x2c3',
      'date', '2025-04-12T16:20:00Z',
      'title', 'Eye-Tracking Integration',
      'content', 'Successfully integrated eye-tracking data to measure engagement levels and adapt content difficulty in real-time.'
    ),
    jsonb_build_object(
      'hash', 'upd-008-v4b5n6',
      'date', '2025-03-28T09:10:00Z',
      'title', 'User Study Results',
      'content', 'Initial user study shows 32% improvement in knowledge retention compared to traditional methods.'
    )
  )
),

-- Project 009: Tactile Programming Interfaces
(
  'project-009',
  'Tactile Programming Interfaces',
  'tactile-programming-interfaces',
  'completed',
  FALSE,
  'n6m7b8v9c0',
  'Investigating physical, tangible interfaces for programming and logical thinking aimed at diverse learners.',
  'How can we make programming more accessible through physical interaction? This project explores tangible programming blocks and surfaces that translate physical arrangements into executable code.',
  ARRAY['accessibility', 'programming', 'tangible', 'education'],
  '2025-02-15T11:25:00Z',
  'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#8C3D23',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/tactile-programming',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://tactile.lelabs.example',
    'documentation', 'https://docs.lelabs.example/tactile-programming'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-009-n6m7b8',
      'date', '2025-02-15T11:25:00Z',
      'title', 'Project Completion',
      'content', 'Research concluded with final release of open-source hardware specifications and companion software. Three educational institutions implementing the system.'
    )
  )
),

-- Project 010: Collaborative Decision Systems
(
  'project-010',
  'Collaborative Decision Systems',
  'collaborative-decision-systems',
  'active',
  FALSE,
  'l1k2j3h4g5',
  'Building tools that facilitate more effective group decision-making by reducing cognitive biases and improving information sharing.',
  'How can technology help groups make better decisions together? This project develops systems that structure collaborative decision processes to enhance outcomes.',
  ARRAY['collaboration', 'decision-science', 'governance', 'UI'],
  '2025-03-18T13:40:00Z',
  'https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  jsonb_build_object(
    'background', '#23788C',
    'color', '#FFFFFF'
  ),
  jsonb_build_object(
    'github', 'https://github.com/P2Enjoy/collaborative-decisions',
    'license', 'https://opensource.org/licenses/MIT',
    'demo', 'https://decide.lelabs.example',
    'documentation', 'https://docs.lelabs.example/collaborative-decisions'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'hash', 'upd-010-l1k2j3',
      'date', '2025-03-18T13:40:00Z',
      'title', 'Bias Mitigation Framework',
      'content', 'Released framework for identifying and mitigating common decision biases in group settings with interactive visualization tools.'
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
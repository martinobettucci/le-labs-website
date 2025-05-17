// This script is for migrating data from the static JSON file to Supabase
// Run it using: node --loader ts-node/esm src/scripts/migrate-data.ts

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  try {
    // Read the JSON file
    const jsonPath = path.resolve('./public/data/le-labs-data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    if (!data.projects || !Array.isArray(data.projects)) {
      console.error('Invalid data format: projects array not found');
      return;
    }

    console.log(`Found ${data.projects.length} projects to migrate`);

    // Transform projects for Supabase
    const projects = data.projects.map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      status: project.status,
      featured: project.featured,
      hash: project.hash,
      description: project.description,
      summary: project.summary,
      tags: project.tags,
      last_updated: project.lastUpdated, 
      image: project.image,
      tile_styles: {
        background: project.tileStyles.background,
        color: project.tileStyles.color,
        size: project.tileStyles.size
      },
      updates: project.updates,
      links: project.links || {}
    }));

    // Insert projects into Supabase
    for (const project of projects) {
      const { error } = await supabase
        .from('le_labs_project')
        .upsert(project, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting project ${project.id}:`, error);
      } else {
        console.log(`Successfully migrated project: ${project.title}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
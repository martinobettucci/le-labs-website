export interface TileStyles {
  background: string;  
	color: string;
}

export interface ProjectUpdate {
  hash: string;
  date: string;
  title: string;
  content: string;
}

export interface ProjectLinks {
  github?: string;
  license?: string;
  demo?: string;
  video?: string;
  documentation?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  featured: boolean;
  hash: string;
  description: string;
  summary: string;
  tags: string[];
  lastUpdated: string;
  image: string;
  tileStyles: TileStyles;
  updates: ProjectUpdate[];
  links?: ProjectLinks;
}

export interface NewsItem {
  id: string;
  hash: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  tileStyles: TileStyles;
}

export interface PageSection {
  type: string;
  content: Record<string, any>;
  styles?: Record<string, string>;
}

export interface Page {
  title: string;
  subtitle?: string;
  description: string;
  layout?: PageSection[];
  content?: any;
}

export interface LabsData {
  meta: {
    lastUpdated: string;
    version: string;
  };
  projects: Project[];
  news: NewsItem[];
  pages: {
    home: Page;
    methodology: Page;
    about: Page;
    [key: string]: Page;
  };
}

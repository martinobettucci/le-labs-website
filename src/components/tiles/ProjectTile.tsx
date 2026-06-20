import React from 'react';
import { LayoutProject } from '../../types/data';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { Star, Clock, CheckCircle, AlertTriangle, Github, ExternalLink, Play, FileText } from 'lucide-react';
import MetroTile from './MetroTile';

interface ProjectTileProps {
  project: LayoutProject;
  hasNewUpdates?: boolean;
}

const ProjectTile: React.FC<ProjectTileProps> = ({ project, hasNewUpdates = false }) => {
  const { isFollowing, followProject, unfollowProject } = useUserPreferences();
  const followed = isFollowing(project.id);

  // Map colSpan to tile size
  const getSizeFromColSpan = (colSpan: number): 'small' | 'medium' | 'large' | 'wide' => {
    switch (colSpan) {
      case 3:
        return 'small';
      case 6:
        return 'medium';
      case 12:
				return 'wide';
      default:
        return 'large';
    }
  };

  const size = getSizeFromColSpan(project.colSpan);

  // Status icons and colors
  const statusConfig = {
    planning: { icon: <Clock size={16} />, text: 'Planning' },
    active: { icon: <AlertTriangle size={16} />, text: 'Active' },
    paused: { icon: <Clock size={16} />, text: 'Paused' },
    completed: { icon: <CheckCircle size={16} />, text: 'Completed' },
  };

  const statusInfo = statusConfig[project.status];

  // Handle follow/unfollow
  const toggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (followed) {
      await unfollowProject(project.id);
    } else {
      await followProject(project.id);
    }
  };

  // Render project links for the third face
  const renderProjectLinks = () => {
    if (!project.links) return null;

    return (
      <div className="grid grid-cols-1 gap-3 w-full">
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={18} className="mr-2" />
            <span>GitHub</span>
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={18} className="mr-2" />
            <span>Demo</span>
          </a>
        )}
        {project.links.documentation && (
          <a
            href={project.links.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={18} className="mr-2" />
            <span>Docs</span>
          </a>
        )}
        {project.links.video && (
          <a
            href={project.links.video}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <Play size={18} className="mr-2" />
            <span>Video</span>
          </a>
        )}
        {project.links.license && (
          <a
            href={project.links.license}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={18} className="mr-2" />
            <span>License</span>
          </a>
        )}
      </div>
    );
  };

  // Entrance is driven by the parent grid's cascade (Windows-8 wave); the tile
  // itself only does hover/tap + pointer tilt.
  return (
    <div className="h-full">
        <MetroTile
          title={project.title}
          description={project.description}
          tileStyles={project.tileStyles}
          to={`/projects/${project.slug}`}
          notification={hasNewUpdates}
          image={project.image}
          links={renderProjectLinks()}
          size={size} // ✅ apply size
          liveItems={(project.updates || []).map((u) => ({ text: u.title, date: u.date }))}
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm mb-3 flex items-center space-x-1 opacity-80">
                {statusInfo.icon}
                <span>{statusInfo.text}</span>
              </div>

              <button
                onClick={toggleFollow}
                className="focus:outline-none transform transition hover:scale-110 z-20"
                aria-label={followed ? 'Unfollow project' : 'Follow project'}
              >
                <Star
                  size={20}
                  fill={followed ? 'currentColor' : 'none'}
                  className={followed ? 'text-highlight' : 'text-current opacity-70 hover:opacity-100'}
                />
              </button>
            </div>

            <div className="flex flex-wrap mt-2 gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-2xs px-2 py-0.5 border border-current opacity-70">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-2xs px-2 py-0.5 border border-current opacity-70">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </MetroTile>
    </div>
  );
};

export default ProjectTile;

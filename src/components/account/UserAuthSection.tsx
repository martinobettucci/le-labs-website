import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserAuthSectionProps {
  className?: string;
}

const UserAuthSection: React.FC<UserAuthSectionProps> = ({ className = '' }) => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Loader2 size={16} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Link 
          to="/account"
          className="flex items-center text-gray-300 hover:text-highlight transition-colors"
          title="Account Dashboard"
        >
          <User size={16} className="mr-1" />
          <span className="text-sm truncate max-w-32">
            {user.email}
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center text-gray-300 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/login"
      className={`flex items-center text-gray-300 hover:text-highlight transition-colors ${className}`}
      aria-label="Login"
    >
      <LogIn size={16} className="mr-1" />
      <span>Login</span>
    </Link>
  );
};

export default UserAuthSection; 
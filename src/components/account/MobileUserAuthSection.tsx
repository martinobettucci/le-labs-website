import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileUserAuthSectionProps {
  onClose: () => void;
  className?: string;
}

const MobileUserAuthSection: React.FC<MobileUserAuthSectionProps> = ({ 
  onClose, 
  className = '' 
}) => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className={`text-center ${className}`}>
        <Loader2 size={20} className="animate-spin text-gray-300 mx-auto" />
      </div>
    );
  }

  if (user) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Link
          to="/account"
          onClick={onClose}
          className="flex items-center justify-center text-gray-300 hover:text-highlight transition-colors text-lg"
          title="Account Dashboard"
        >
          <User size={20} className="mr-2" />
          <span className="truncate max-w-48">
            {user.email}
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center text-gray-300 hover:text-white transition-colors text-xl w-full"
          aria-label="Sign Out"
        >
          <LogOut size={20} className="mr-2" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/login"
      onClick={onClose}
      className={`flex items-center justify-center text-gray-300 hover:text-highlight transition-colors text-xl ${className}`}
      aria-label="Login"
    >
      <LogIn size={20} className="mr-2" />
      <span>Login</span>
    </Link>
  );
};

export default MobileUserAuthSection; 
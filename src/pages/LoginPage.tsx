import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signIn, signUp, user, loading, error } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      return false;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          setLocalError(error.message);
        } else {
          setSuccessMessage('Account created successfully! Please check your email for verification.');
          setFormData({ email: '', password: '', confirmPassword: '' });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setLocalError(error.message);
        } else {
          // Navigation will be handled by the useEffect
        }
      }
    } catch (err) {
      setLocalError('An unexpected error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setLocalError(null);
    setSuccessMessage(null);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </Link>
            <h1 className="font-heading text-white mb-4">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xl text-gray-300">
              {isSignUp 
                ? 'Join LE LABS to access exclusive content and features.'
                : 'Sign in to your account to continue exploring.'
              }
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-900 p-8">
            {/* Error Message */}
            {(localError || error) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-error/20 border border-error p-4 mb-6 flex items-start"
              >
                <AlertCircle size={18} className="text-error mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-error text-sm">{localError || error?.message}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/20 border border-success p-4 mb-6 flex items-start"
              >
                <CheckCircle size={18} className="text-success mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-success text-sm">{successMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-gray-800 border-gray-700 text-white p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-gray-800 border-gray-700 text-white p-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="w-full bg-gray-800 border-gray-700 text-white p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <>
                    {isSignUp ? (
                      <UserPlus size={18} className="mr-2" />
                    ) : (
                      <LogIn size={18} className="mr-2" />
                    )}
                  </>
                )}
                {loading 
                  ? 'Processing...' 
                  : isSignUp 
                    ? 'Create Account' 
                    : 'Sign In'
                }
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-2">
                {isSignUp 
                  ? 'Already have an account?' 
                  : "Don't have an account?"
                }
              </p>
              <button
                onClick={toggleMode}
                className="text-primary hover:text-primary-light transition-colors font-medium"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            {/* Forgot Password (Sign In Only) */}
            {!isSignUp && (
              <div className="mt-4 text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              By signing up, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage; 
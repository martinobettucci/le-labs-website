import React from 'react';
import { Crown, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccount } from '../../contexts/AccountContext';

// Subscription info is provided by AccountContext; no local type needed here

const AccountOverview: React.FC = () => {
  const { user } = useAuth();

  const { credits, subscription } = useAccount();

  // Subscription is provided by AccountContext (placeholder values handled there)

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4 pb-8 pt-20 ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Dashboard</h1>
            <p className="text-gray-300">
              Welcome back, <span className="text-highlight">{user?.email}</span>
            </p>
          </div>
          
          {/* Account Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
            {/* Credits Balance */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white min-w-48">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Credits Balance</p>
                  <p className="text-2xl font-bold">{(credits ?? 0).toLocaleString()}</p>
                </div>
                <Coins size={24} className="text-blue-200" />
              </div>
            </div>
            
            {/* Subscription Status */}
            <div className={`rounded-lg p-4 text-white min-w-48 ${
              (subscription?.status === 'active')
                ? 'bg-gradient-to-br from-green-600 to-green-700' 
                : 'bg-gradient-to-br from-gray-600 to-gray-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Subscription</p>
                  <p className="text-lg font-bold">{subscription?.status === 'active' ? (subscription?.planName || 'Active') : 'Inactive'}</p>
                </div>
                <Crown size={24} className="text-green-200" />
              </div>
            </div>
            
            {/* Next Billing */}
            {/* {hasActiveSubscription && nextBilling && (
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 text-white min-w-48">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Next Billing</p>
                    <p className="text-sm font-bold">{formattedNextBilling}</p>
                  </div>
                  <Calendar size={24} className="text-purple-200" />
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview; 
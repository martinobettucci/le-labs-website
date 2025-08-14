import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AccountOverview from '../components/account/AccountOverview';
import AccountSidebar from '../components/account/AccountSidebar';
import PurchaseCredits from '../components/account/PurchaseCredits';
import Subscriptions from '../components/account/Subscriptions';
import TransactionHistory from '../components/account/TransactionHistory';
import UsageHistory from '../components/account/UsageHistory';
import AccountSettings from '../components/account/AccountSettings';
import Support from '../components/account/Support';

export type AccountSection = 
  | 'purchase-credits'
  | 'subscriptions' 
  | 'transaction-history'
  | 'usage-history'
  | 'account-settings'
  | 'support';

const AccountPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>('purchase-credits');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-lg">Loading account...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'purchase-credits':
        return <PurchaseCredits />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'transaction-history':
        return <TransactionHistory />;
      case 'usage-history':
        return <UsageHistory />;
      case 'account-settings':
        return <AccountSettings />;
      case 'support':
        return <Support />;
      default:
        return <PurchaseCredits />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Account Overview - Always visible at top */}
      <AccountOverview />
      
      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80 flex-shrink-0">
            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
          
          {/* Dynamic Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountPage; 
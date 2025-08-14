import React from 'react';
import { 
  ShoppingCart, 
  Crown, 
  History, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Menu, 
  X 
} from 'lucide-react';
import { AccountSection } from '../../pages/AccountPage';

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface MenuItem {
  id: AccountSection;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'purchase-credits',
    label: 'Buy Credits',
    icon: <ShoppingCart size={20} />,
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: <Crown size={20} />,
  },
  {
    id: 'transaction-history',
    label: 'Transaction History',
    icon: <History size={20} />,
    badge: 'Soon',
  },
  {
    id: 'usage-history',
    label: 'Usage History',
    icon: <BarChart3 size={20} />,
    badge: 'Soon',
  },
  {
    id: 'account-settings',
    label: 'Account Settings',
    icon: <Settings size={20} />,
  },
  {
    id: 'support',
    label: 'Support/Help',
    icon: <HelpCircle size={20} />,
  },
];

const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onSectionChange,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const handleItemClick = (section: AccountSection) => {
    onSectionChange(section);
    setSidebarOpen(false); // Close mobile menu after selection
  };

  const sidebarContent = (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-xl font-semibold text-white">Account Menu</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-highlight text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden flex items-center space-x-2 mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Menu size={20} />
        <span>Account Menu</span>
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-background p-4 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default AccountSidebar; 
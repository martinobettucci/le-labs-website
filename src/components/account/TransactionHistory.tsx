import React from 'react';
import { History, Clock } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800/50 rounded-full mb-6">
        <History size={48} className="text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">Transaction History</h2>
      
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock size={20} className="text-highlight" />
          <span className="text-highlight font-semibold text-lg">Coming Soon</span>
        </div>
        
        <p className="text-gray-300 mb-6">
          We're working on bringing you a comprehensive transaction history that will show:
        </p>
        
        <div className="text-left space-y-2 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>All credit purchases and refunds</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Subscription payments and changes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Detailed payment receipts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Export functionality for accounting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory; 
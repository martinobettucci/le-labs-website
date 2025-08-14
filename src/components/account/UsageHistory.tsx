import React from 'react';
import { BarChart3, Clock } from 'lucide-react';

const UsageHistory: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-800/50 rounded-full mb-6">
        <BarChart3 size={48} className="text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">Usage History</h2>
      
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Clock size={20} className="text-highlight" />
          <span className="text-highlight font-semibold text-lg">Coming Soon</span>
        </div>
        
        <p className="text-gray-300 mb-6">
          Track your credit usage across all tools with detailed analytics:
        </p>
        
        <div className="text-left space-y-2 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Daily, weekly, and monthly usage charts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Usage breakdown by tool and feature</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Credit consumption patterns</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>
            <span>Usage predictions and recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageHistory; 
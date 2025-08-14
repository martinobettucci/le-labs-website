import React, { useState } from 'react';
import { Crown, Check, Zap, CreditCard } from 'lucide-react';
import { useStripe } from '../../contexts/StripeContext';

const Subscriptions: React.FC = () => {
  const [currentSubscription] = useState<string | null>('pro'); // Mock current subscription
  
  const {
    subscriptions: subscriptionPlans,
    subscriptionsLoading,
    subscriptionsError,
    createCheckoutSession,
    checkoutLoading,
  } = useStripe();

  const handleSubscribe = (productId: string) => {
    createCheckoutSession(productId);
  };

  const handleCancelSubscription = async () => {
    // Mock cancellation process - this would be implemented with a separate API call
    alert('Subscription cancelled. You will retain access until the end of your billing period.');
  };

  // Handle loading state
  if (subscriptionsLoading) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Subscriptions</h2>
          <p className="text-gray-300">Loading subscription plans...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 animate-pulse">
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (subscriptionsError) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Subscriptions</h2>
          <p className="text-red-400">Error loading subscription plans. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Handle no subscriptions available
  if (!subscriptionPlans || subscriptionPlans.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Subscriptions</h2>
          <p className="text-gray-300">No subscription plans available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Subscriptions</h2>
        <p className="text-gray-300">
          Choose a monthly plan that fits your needs. All plans include credits that renew each month.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative max-w-md  bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 ${
              plan.metadata.popular 
                ? 'border-highlight shadow-lg shadow-highlight/20 scale-105' 
                : 'border-gray-700'
            } ${
              currentSubscription === plan.id ? 'ring-2 ring-green-500' : ''
            }`}
          >
            {plan.metadata.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-highlight text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            {currentSubscription === plan.id && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Current Plan
                </span>
              </div>
            )}

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
                  <Crown size={32} className="text-purple-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.credits} Credits Plan
                </h3>
                
                <div className="text-4xl font-bold text-white mb-1">
                  {plan.price.amount / 100} {"€"}
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                
                <p className="text-highlight font-semibold">
                  {Number(plan.metadata.tokenReceive) + Number(plan.metadata.bonus)} credits included
                </p>
                
                <p className="text-gray-400 text-sm mt-2">
                  {((plan.price.amount / 100) / (plan.metadata.tokenReceive + plan.metadata.bonus)).toFixed(3)} € per credit
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start text-gray-300">
                  <Check size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{plan.metadata.tokenReceive} credits per month</span>
                </div>
                {plan.metadata.bonus > 0 && (
                  <div className="flex items-start text-green-400">
                    <Check size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold">+{plan.metadata.bonus} bonus credits</span>
                  </div>
                )}
                <div className="flex items-start text-gray-300">
                  <Check size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Access to all tools</span>
                </div>
                <div className="flex items-start text-gray-300">
                  <Check size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-start text-gray-300">
                  <Check size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Credit rollover</span>
                </div>
              </div>

              {currentSubscription === plan.id ? (
                <div className="space-y-3">
                  <div className="text-center py-3 bg-green-600/20 border border-green-600 rounded-lg text-green-400 font-semibold">
                    Active Subscription
                  </div>
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full py-2 px-4 bg-red-600/20 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscriptionsLoading || checkoutLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    plan.metadata.popular
                      ? 'bg-highlight hover:bg-highlight/90 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  } ${
                    (subscriptionsLoading || checkoutLoading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CreditCard size={20} />
                  <span>
                    {checkoutLoading ? 'Processing...' : 'Subscribe Now'}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Zap size={24} className="text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Credit Rollover</h3>
              <p className="text-gray-300 text-sm">
                Unused credits roll over to the next month up to your plan's limit. 
                Never lose credits you've paid for!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Crown size={24} className="text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Flexible Billing</h3>
              <p className="text-gray-300 text-sm">
                Cancel or change your plan anytime. Changes take effect at your next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions; 
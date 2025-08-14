import React from "react";
import { Coins, CreditCard, Check, Zap } from "lucide-react";
import { useStripe } from "../../contexts/StripeContext";

const PurchaseCredits: React.FC = () => {
  const {
    products: stripeProducts,
    productsLoading: isPendingGetStripeProducts,
    createCheckoutSession,
    checkoutLoading,
  } = useStripe();


  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Buy Credits</h2>
        <p className="text-gray-300">
          Purchase credits to use across all our AI tools. Credits never expire
          and can be used for any service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stripeProducts ? (
          stripeProducts.map((product) => (
            <div
              key={product.id}
              className={`relative bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                product.metadata.popular
                  ? "border-highlight shadow-lg shadow-highlight/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              {product.metadata.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-highlight text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
                    <Coins size={32} className="text-blue-400" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {product.credits} Credits
                    {product.metadata.bonus && (
                      <span className="text-green-400 text-sm ml-2">
                        +{product.metadata.bonus} bonus
                      </span>
                    )}
                  </h3>

                  <div className="text-3xl font-bold text-white mb-1">
                    {product.price.amount / 100} {"€"}
                  </div>

                  <p className="text-gray-400 text-sm">
                    {/* {(product.price.amount / (product.credits + product.metadata.bonus))}{" "} */}
                    {((product.price.amount / 100) / (product.metadata.tokenReceive + product.metadata.bonus)).toFixed(3) }{" "}
                    per credit
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="text-green-400 mr-2" />
                    <span className="text-sm">Never expires</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="text-green-400 mr-2" />
                    <span className="text-sm">Use across all tools</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="text-green-400 mr-2" />
                    <span className="text-sm">Instant activation</span>
                  </div>
                  {product.metadata.bonus && (
                    <div className="flex items-center text-green-400">
                      <Zap size={16} className="mr-2" />
                      <span className="text-sm font-semibold">
                        {product.metadata.bonus} bonus credits included!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => createCheckoutSession(product.id)}
                  disabled={isPendingGetStripeProducts || checkoutLoading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                    product.metadata.popular
                      ? "bg-highlight hover:bg-highlight/90 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  } ${(isPendingGetStripeProducts || checkoutLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <CreditCard size={20} />
                  <span>{checkoutLoading ? "Processing..." : "Purchase Now"}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No credit packs found</div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Coins size={16} className="text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">How Credits Work</h3>
            <p className="text-gray-300 text-sm">
              Credits are consumed based on the complexity and resource usage of
              each AI tool. Simple operations might use 1-5 credits, while
              complex processing could use 10-50 credits. Check each tool's
              documentation for specific credit costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCredits;

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Coins, ArrowLeft, Loader2 } from "lucide-react";
import { useStripe, StripeProduct } from "../contexts/StripeContext";

const BillingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product_id");
  const [purchasedProduct, setPurchasedProduct] = useState<StripeProduct | null>(null);

  const {
    products: stripeProducts,
    productsLoading: isPendingGetStripeProducts,
    productsError: isErrorGetStripeProducts,
    findProductById,
  } = useStripe();

  // Find the purchased product when products are loaded
  useEffect(() => {
    if (stripeProducts && productId) {
      const product = findProductById(productId);
      setPurchasedProduct(product);
    }
  }, [stripeProducts, productId, findProductById]);

  if (isPendingGetStripeProducts) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center  pt-16">
        <div className="text-center">
          <Loader2 size={48} className="text-highlight animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading purchase details...</p>
        </div>
      </div>
    );
  }

  if (isErrorGetStripeProducts) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 mb-4">
            <CheckCircle size={64} className="mx-auto mb-4" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-300 mb-6">
            Your payment was processed successfully, but we couldn't load the product details.
            Your credits have been added to your account.
          </p>
          <Link
            to="/account"
            className="inline-flex items-center space-x-2 bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Account</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Purchase</h1>
          <p className="text-gray-300 mb-6">
            No product ID found in the URL. This doesn't look like a valid purchase confirmation.
          </p>
          <Link
            to="/account"
            className="inline-flex items-center space-x-2 bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle size={80} className="text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-300 text-lg">
              Thank you for your purchase. Your credits have been added to your account.
            </p>
          </div>

          {/* Product Details */}
          {purchasedProduct ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full">
                  <Coins size={32} className="text-blue-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                {purchasedProduct.credits} Credits
                {purchasedProduct.metadata.bonus > 0 && (
                  <span className="text-green-400 text-lg ml-2">
                    +{purchasedProduct.metadata.bonus} bonus
                  </span>
                )}
              </h2>
              
              <div className="text-3xl font-bold text-highlight mb-2">
                ${(purchasedProduct.price.amount / 100).toFixed(2)}
              </div>
              
              <p className="text-gray-400 mb-6">
                Total credits received: {purchasedProduct.credits + (purchasedProduct.metadata.bonus || 0)}
              </p>

              <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                <p className="text-green-400 font-semibold">
                  ✓ Credits have been automatically added to your account
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Purchase Confirmed</h2>
              <p className="text-gray-300">
                <span className="font-mono text-highlight">Welcome to the subscription plan !</span>
              </p>
              <p className="text-gray-300 mt-2">Your credits have been added to your account successfully.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account"
              className="inline-flex items-center justify-center space-x-2 bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>View Account</span>
            </Link>
            
            <Link
              to="/projects"
              className="inline-flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Explore Tools</span>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <h3 className="text-white font-semibold mb-2">What's Next?</h3>
            <p className="text-gray-300 text-sm">
              Your credits are now available for use across all our AI tools. 
              Visit your account page to view your current balance, or explore our tools to start using your credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSuccessPage;

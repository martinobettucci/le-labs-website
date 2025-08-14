import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINT_CREATE_CHECKOUT_SESSION, ENDPOINT_GET_PRODUCTS } from '../global/endpoint.const';
import { supabase } from '../lib/supabase';

export interface StripeProduct {
  id: string;
  credits: number;
  price: StripePrice;
  metadata: {
    bonus: number;
    tokenReceive: number;
    popular: boolean;
  };
}

export interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  type: string;
}

interface StripeContextType {
  // Products
  products: StripeProduct[] | undefined;
  productsLoading: boolean;
  productsError: Error | null;

  // Subscriptions
  subscriptions: StripeProduct[] | undefined;
  subscriptionsLoading: boolean;
  subscriptionsError: Error | null;
  
  // Checkout
  createCheckoutSession: (productId: string) => void;
  checkoutLoading: boolean;
  checkoutError: Error | null;
  
  // Utilities
  findProductById: (productId: string) => StripeProduct | null;
  refreshProducts: () => Promise<void>;
}

const StripeContext = createContext<StripeContextType>({
  products: undefined,
  productsLoading: true,
  productsError: null,
  subscriptions: undefined,
  subscriptionsLoading: true,
  subscriptionsError: null,
  createCheckoutSession: () => {},
  checkoutLoading: false,
  checkoutError: null,
  findProductById: () => null,
  refreshProducts: async () => {},
});

export const useStripe = () => useContext(StripeContext);

// Function to fetch Stripe products
const fetchStripeProducts = async (): Promise<StripeProduct[]> => {
  const result = await fetch(ENDPOINT_GET_PRODUCTS, {
    method: "GET",
  });
  
  if (!result.ok) {
    throw new Error(`Failed to fetch products: ${result.status}`);
  }
  
  const data = await result.json();
  // filter by price.type = "one_time" and sort by price.amount asc
  const products: StripeProduct[] = data.products.filter((product: StripeProduct) => product.price.type === "one_time").sort((a: StripeProduct, b: StripeProduct) => a.price.amount - b.price.amount);
  console.log("Stripe products fetched", products);
  return products;
};

const fetchStripeSubscriptions = async (): Promise<StripeProduct[]> => {
  const result = await fetch(ENDPOINT_GET_PRODUCTS, {
    method: "GET",
  });
  
  if (!result.ok) {
    throw new Error(`Failed to fetch subscriptions: ${result.status}`);
  }
  
  const data = await result.json();
  // filter by price.type = "recurring" and sort by price.amount asc
  const subscriptions: StripeProduct[] = data.products.filter((product: StripeProduct) => product.price.type === "recurring").sort((a: StripeProduct, b: StripeProduct) => a.price.amount - b.price.amount);
  console.log("Stripe subscriptions fetched", subscriptions);
  return subscriptions;
};

// Function to create checkout session
const createCheckoutSessionAPI = async (productId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const result = await fetch(ENDPOINT_CREATE_CHECKOUT_SESSION, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId }),
  });
  
  const data = await result.json();
  console.log("Stripe result received in the client side", data);

  if (result.ok && data?.sessionUrl) {
    return data; // Return data for the mutation
  } else {
    throw new Error(data.message || "Error during checkout");
  }
};

export const StripeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query for fetching Stripe products
  const {
    data: products,
    isPending: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["stripeProducts"],
    queryFn: fetchStripeProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Query for fetching Stripe subscriptions
  const {
    data: subscriptions,
    isPending: subscriptionsLoading,
    error: subscriptionsError,
  } = useQuery({
    queryKey: ["stripeSubscriptions"],
    queryFn: fetchStripeSubscriptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Mutation for creating checkout sessions
  const checkoutMutation = useMutation({
    mutationFn: createCheckoutSessionAPI,
    onSuccess: (data) => {
      // Redirect user to Stripe payment page
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    },
    onError: (error) => {
      console.error("Checkout error:", error);
    },
  });

  // Utility function to find product by ID
  const findProductById = (productId: string): StripeProduct | null => {
    if (!products) return null;
    return products.find(p => p.id === productId) || null;
  };

  // Function to refresh products
  const refreshProducts = async () => {
    await queryClient.invalidateQueries({ queryKey: ["stripeProducts"] });
  };

  // Function to create checkout session
  const createCheckoutSession = (productId: string) => {
    checkoutMutation.mutate(productId);
  };

  return (
    <StripeContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
        subscriptions,
        subscriptionsLoading,
        subscriptionsError,
        createCheckoutSession,
        checkoutLoading: checkoutMutation.isPending,
        checkoutError: checkoutMutation.error,
        findProductById,
        refreshProducts,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
};

import React, { createContext, useContext, ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

export type SubscriptionInfo = {
  status: 'active' | 'inactive'
  planName: string | null
  nextBillingAt: string | null
}

type AccountContextType = {
  credits: number | undefined
  creditsLoading: boolean
  creditsError: Error | null
  refreshCredits: () => Promise<void>

  subscription: SubscriptionInfo | undefined
  subscriptionLoading: boolean
  subscriptionError: Error | null
  refreshSubscription: () => Promise<void>
}

const AccountContext = createContext<AccountContextType>({
  credits: undefined,
  creditsLoading: true,
  creditsError: null,
  refreshCredits: async () => {},

  subscription: undefined,
  subscriptionLoading: true,
  subscriptionError: null,
  refreshSubscription: async () => {},
})

export const useAccount = () => useContext(AccountContext)

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Credits: sum of movements from credit_history for current user
  const {
    data: credits,
    isPending: creditsLoading,
    error: creditsQueryError,
  } = useQuery<number>({
    queryKey: ['account.credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0
      const { data, error } = await supabase
        .from('credit_history')
        .select('movement')
        .eq('user_id', user.id)

      if (error) {
        throw new Error(error.message)
      }

      const total = (data || []).reduce((sum: number, row: { movement: number }) => sum + (row?.movement ?? 0), 0)
      return total
    },
    staleTime: 60_000,
  })

  // Subscription: placeholder until Stripe customer linkage and API are implemented
  const {
    data: subscription,
    isPending: subscriptionLoading,
    error: subscriptionQueryError,
  } = useQuery<SubscriptionInfo>({
    queryKey: ['account.subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return { status: 'inactive', planName: null, nextBillingAt: null }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscriber')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // If the column is not yet present or row missing, default to inactive
        console.error('Failed to fetch subscription info', error)
        return { status: 'inactive', planName: null, nextBillingAt: null }
      }

      const isSubscriber: boolean = Boolean((data as any)?.is_subscriber)
      return {
        status: isSubscriber ? 'active' : 'inactive',
        planName: null,
        nextBillingAt: null,
      }
    },
    staleTime: 60_000,
  })

  const refreshCredits = async () => {
    await queryClient.invalidateQueries({ queryKey: ['account.credits', user?.id] })
  }

  const refreshSubscription = async () => {
    await queryClient.invalidateQueries({ queryKey: ['account.subscription', user?.id] })
  }

  return (
    <AccountContext.Provider
      value={{
        credits,
        creditsLoading,
        creditsError: creditsQueryError as Error | null,
        refreshCredits,

        subscription,
        subscriptionLoading,
        subscriptionError: subscriptionQueryError as Error | null,
        refreshSubscription,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}



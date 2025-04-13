import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserData {
  id: string
  _id?: string  // Add optional _id field for MongoDB documents
  firstName: string
  lastName: string
  email: string
  loyaltyPoints: number
  membershipTier: string
  totalSpent: number
  membershipSince: string
  preferences: {
    language: string
    currency: string
    notifications: boolean
  }
  bookings: any[]
  rewards: any[]
  role: string
}

interface UserState {
  user: UserData | null
  token: string | null
  setUser: (user: UserData | null, token: string | null) => void
  clearUser: () => void
  isHydrated: boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,
      setUser: (user, token) => {
        // Ensure we're storing the user data in the correct format
        const userData = user ? {
          id: user.id || user._id || '', // Ensure id is always a string
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          loyaltyPoints: user.loyaltyPoints || 0,
          membershipTier: user.membershipTier || 'Bronze',
          totalSpent: user.totalSpent || 0,
          membershipSince: user.membershipSince || new Date().toISOString(),
          preferences: user.preferences || {
            language: 'en',
            currency: 'USD',
            notifications: true
          },
          bookings: user.bookings || [],
          rewards: user.rewards || [],
          role: user.role || 'user'
        } : null;

        set({ user: userData, token, isHydrated: true })
        
        // Store in localStorage with proper structure
        if (typeof window !== 'undefined') {
          localStorage.setItem('kuriftuUser', JSON.stringify({
            user: userData,
            token,
            state: { user: userData, token }
          }))
        }
      },
      clearUser: () => {
        set({ user: null, token: null, isHydrated: true })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kuriftuUser')
        }
      },
    }),
    {
      name: 'kuriftuUser',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Ensure we have both user and token after rehydration
        if (state) {
          const stored = localStorage.getItem('kuriftuUser')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              // Handle different storage formats
              const userData = parsed.state?.user || parsed.user
              const token = parsed.state?.token || parsed.token
              state.user = userData
              state.token = token
            } catch (error) {
              console.error('Error parsing stored user data:', error)
            }
          }
          state.isHydrated = true
        }
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)

// Helper function to check if store is hydrated
export const isStoreHydrated = () => {
  return useUserStore.getState().isHydrated
}

// Helper function to manually rehydrate the store
export const rehydrateStore = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('kuriftuUser')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Handle different storage formats
        const userData = parsed.state?.user || parsed.user
        const token = parsed.state?.token || parsed.token
        
        if (userData && token) {
          useUserStore.getState().setUser(userData, token)
        } else {
          // If we don't have both user and token, clear the store
          useUserStore.getState().clearUser()
        }
      } catch (error) {
        console.error('Error rehydrating store:', error)
        localStorage.removeItem('kuriftuUser')
      }
    }
  }
} 
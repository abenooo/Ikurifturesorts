import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserData {
  id: string
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
        set({ user, token, isHydrated: true })
        if (typeof window !== 'undefined') {
          localStorage.setItem('kuriftuUser', JSON.stringify({ user, token }))
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
        if (state) {
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
        const { user, token } = JSON.parse(stored)
        useUserStore.getState().setUser(user, token)
      } catch (error) {
        console.error('Error rehydrating store:', error)
        localStorage.removeItem('kuriftuUser')
      }
    }
  }
} 
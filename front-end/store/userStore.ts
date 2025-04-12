import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  points?: number
  tier?: string
  joinDate?: string
}

interface UserState {
  user: UserData | null
  token: string | null
  setUser: (user: UserData | null, token: string | null) => void
  clearUser: () => void
  isHydrated: boolean
}

// Initialize from localStorage if available
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('kuriftuUser')
    if (stored) {
      const { user, token } = JSON.parse(stored)
      return { user, token }
    }
  }
  return { user: null, token: null }
}

const initialState = getInitialState()

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: initialState.user,
      token: initialState.token,
      isHydrated: false,
      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: 'kuriftuUser',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setUser(state.user, state.token)
      }
    }
  )
) 
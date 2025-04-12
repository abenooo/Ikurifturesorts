// store/userStore.ts
import { create } from 'zustand'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  loyaltyPoints: number
  membershipTier: string
  // other user fields
}

interface UserStore {
  user: User | null
  token: string | null
  setUser: (user: User, token: string) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}))
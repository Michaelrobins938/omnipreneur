import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: 'ADMIN' | 'MANAGER' | 'MEMBER'
  teamId?: string
}

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})) 
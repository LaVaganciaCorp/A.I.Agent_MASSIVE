import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  getCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      set({ user: data.user })
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al iniciar sesión' }
    }
  },

  signUp: async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error inesperado al registrarse' }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  getCurrentUser: async () => {
    set({ loading: true })
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error)
        set({ user: null, loading: false })
        return
      }
      set({ user, loading: false })
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      set({ user: null, loading: false })
    }
  },
}))

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState().getCurrentUser()
})
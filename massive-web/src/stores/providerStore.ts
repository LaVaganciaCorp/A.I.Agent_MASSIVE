import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export type ProviderType =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'openrouter'
  | 'groq'
  | 'mistral'
  | 'azure-openai'
  | 'lm-studio'
  | 'deepseek'
  | 'moonshot'
  | 'custom'

export interface ProviderConfig {
  id: string
  name: string
  provider: ProviderType
  endpoint: string
  // Never store apiKey client-side in server mode
  apiKey?: string
  model?: string
  headers?: Record<string, string>
  azure?: {
    apiVersion?: string
    deployment?: string
  }
  active: boolean
  created_at: string
  updated_at: string
}

interface ProviderState {
  providers: ProviderConfig[]
  addProvider: (p: Omit<ProviderConfig, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProvider: (id: string, updates: Partial<ProviderConfig>) => Promise<void>
  deleteProvider: (id: string) => Promise<void>
  toggleProvider: (id: string, active?: boolean) => Promise<void>
  loadFromStorage: () => Promise<void>
  migrateLocalToServer: () => Promise<{ migrated: number }>
  testProvider: (config: ProviderConfig) => Promise<{ ok: boolean; status: number; message?: string }>
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: [],

  addProvider: async (p) => {
    const now = new Date().toISOString()
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const newP: ProviderConfig = { ...p, id, created_at: now, updated_at: now }
    await supabase.functions.invoke('keys-manager?action=add', { body: newP })
    await get().loadFromStorage()
  },

  updateProvider: async (id, updates) => {
    await supabase.functions.invoke('keys-manager?action=update', { body: { id, ...updates } })
    await get().loadFromStorage()
  },

  deleteProvider: async (id) => {
    await supabase.functions.invoke('keys-manager?action=delete', { body: { id } })
    await get().loadFromStorage()
  },

  toggleProvider: async (id, active) => {
    await supabase.functions.invoke('keys-manager?action=update', { body: { id, active } })
    await get().loadFromStorage()
  },

  // Repurposed: fetch from server list
  loadFromStorage: async () => {
    const { data, error } = await supabase.functions.invoke('keys-manager?action=list')
    if (!error && data?.success && Array.isArray(data.data)) {
      set({ providers: data.data })
    } else {
      set({ providers: [] })
    }
  },

  // One-time migration helper from old localStorage schema
  migrateLocalToServer: async () => {
    let migrated = 0
    try {
      const raw = localStorage.getItem('sa:web:providers')
      if (!raw) return { migrated }
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return { migrated }
      for (const p of parsed) {
        const payload = {
          name: p.name,
          provider: p.provider,
          endpoint: p.endpoint,
          apiKey: p.apiKey, // will be encrypted server-side
          model: p.model,
          headers: p.headers,
          azure: p.azure,
          active: p.active,
        }
        await supabase.functions.invoke('keys-manager?action=add', { body: payload })
        migrated++
      }
      // clear local only after successful loop
      localStorage.removeItem('sa:web:providers')
      await get().loadFromStorage()
    } catch {}
    return { migrated }
  },

  testProvider: async (config) => {
    try {
      const { data, error } = await supabase.functions.invoke('provider-test', {
        body: {
          provider: config.provider,
          endpoint: config.endpoint,
          apiKey: config.apiKey,
          model: config.model,
          headers: config.headers,
          azure: config.azure,
        }
      })
      if (error) return { ok: false, status: 500, message: error.message }
      return { ok: true, status: 200, message: data?.message || 'OK' }
    } catch (e) {
      return { ok: false, status: 0, message: (e as Error).message }
    }
  },
}))

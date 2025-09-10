import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the database
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  preferences?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface LLMModel {
  id: string
  name: string
  provider: string
  model_key: string
  capabilities: Record<string, any>
  performance_metrics: Record<string, any>
  cost_per_token?: number
  max_context_length?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  task_type: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  priority: number
  assigned_model?: string
  progress: number
  result?: Record<string, any>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface Plugin {
  id: string
  name: string
  version: string
  author?: string
  description?: string
  category?: string
  capabilities: Record<string, any>
  config: Record<string, any>
  is_enabled: boolean
  is_verified: boolean
  download_count: number
  rating?: number
  install_url?: string
  created_at: string
  updated_at: string
}

export interface MemoryVector {
  id: string
  user_id: string
  content: string
  embedding: number[]
  metadata: Record<string, any>
  memory_type: 'short_term' | 'long_term' | 'episodic' | 'semantic'
  relevance_score?: number
  created_at: string
  updated_at: string
}
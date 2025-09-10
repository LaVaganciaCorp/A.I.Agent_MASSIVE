import { create } from 'zustand'
import { LLMModel, Task, Plugin } from '@/lib/supabase'

export interface LLMSelection {
  task_type: string
  selected_model: LLMModel
  reasoning: string
  confidence: number
  timestamp: string
}

export interface SystemMetrics {
  active_tasks: number
  total_plugins: number
  memory_usage: number
  response_time: number
  success_rate: number
  cost_today: number
}

interface AgentState {
  // Multi-LLM Router
  availableModels: LLMModel[]
  currentSelection: LLMSelection | null
  routerActive: boolean
  
  // Tasks
  activeTasks: Task[]
  taskHistory: Task[]
  
  // Plugins
  installedPlugins: Plugin[]
  availablePlugins: Plugin[]
  
  // System Metrics
  systemMetrics: SystemMetrics
  
  // UI State
  currentView: 'dashboard' | 'router' | 'coding' | 'tasks' | 'plugins' | 'memory' | 'automation' | 'settings'
  
  // Actions
  setCurrentView: (view: AgentState['currentView']) => void
  updateMetrics: (metrics: Partial<SystemMetrics>) => void
  selectModel: (selection: LLMSelection) => void
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  installPlugin: (plugin: Plugin) => void
  togglePlugin: (pluginId: string) => void
}

export const useAgentStore = create<AgentState>((set, get) => ({
  // Initial state
  availableModels: [
    {
      id: '1',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      model_key: 'gpt-4-turbo',
      capabilities: { coding: 95, reasoning: 90, multimodal: 85 },
      performance_metrics: { avg_response_time: 2.1, success_rate: 96.2 },
      cost_per_token: 0.00003,
      max_context_length: 128000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      model_key: 'claude-3-5-sonnet',
      capabilities: { coding: 98, reasoning: 95, analysis: 92 },
      performance_metrics: { avg_response_time: 1.8, success_rate: 97.5 },
      cost_per_token: 0.000015,
      max_context_length: 200000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Gemini 1.5 Pro',
      provider: 'Google',
      model_key: 'gemini-1.5-pro',
      capabilities: { multimodal: 98, reasoning: 88, coding: 85 },
      performance_metrics: { avg_response_time: 1.5, success_rate: 94.8 },
      cost_per_token: 0.0000125,
      max_context_length: 2097152,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Llama 3.1 70B',
      provider: 'Meta (Local)',
      model_key: 'llama-3.1-70b',
      capabilities: { privacy: 100, coding: 82, reasoning: 85 },
      performance_metrics: { avg_response_time: 3.2, success_rate: 91.3 },
      cost_per_token: 0,
      max_context_length: 131072,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'OpenRouter (multi)',
      provider: 'OpenRouter',
      model_key: 'gpt-4o-mini',
      capabilities: { coding: 85, reasoning: 85, multimodal: 80 },
      performance_metrics: { avg_response_time: 2.0, success_rate: 95.0 },
      cost_per_token: 0.000008,
      max_context_length: 128000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Groq Llama3-8B',
      provider: 'Groq',
      model_key: 'llama3-8b-8192',
      capabilities: { coding: 82, reasoning: 80, multimodal: 0 },
      performance_metrics: { avg_response_time: 0.7, success_rate: 92.0 },
      cost_per_token: 0.0,
      max_context_length: 8192,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'Mistral Large',
      provider: 'Mistral',
      model_key: 'mistral-large',
      capabilities: { coding: 88, reasoning: 86, multimodal: 0 },
      performance_metrics: { avg_response_time: 0.9, success_rate: 93.0 },
      cost_per_token: 0.0000125,
      max_context_length: 32000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '8',
      name: 'Azure OpenAI GPT-4o',
      provider: 'Azure OpenAI',
      model_key: 'gpt-4o',
      capabilities: { coding: 92, reasoning: 90, multimodal: 90 },
      performance_metrics: { avg_response_time: 1.0, success_rate: 96.0 },
      cost_per_token: 0.00003,
      max_context_length: 128000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '9',
      name: 'LM Studio (Local)',
      provider: 'LM Studio',
      model_key: 'local',
      capabilities: { privacy: 100, coding: 70, reasoning: 70 },
      performance_metrics: { avg_response_time: 0.25, success_rate: 85.0 },
      cost_per_token: 0.0,
      max_context_length: 8192,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '10',
      name: 'DeepSeek Chat',
      provider: 'DeepSeek',
      model_key: 'deepseek-chat',
      capabilities: { coding: 82, reasoning: 84, multimodal: 0 },
      performance_metrics: { avg_response_time: 0.95, success_rate: 92.0 },
      cost_per_token: 0.000005,
      max_context_length: 32000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '11',
      name: 'Kimi (Moonshot)',
      provider: 'Moonshot',
      model_key: 'kimi-thought',
      capabilities: { coding: 80, reasoning: 86, multimodal: 0 },
      performance_metrics: { avg_response_time: 1.05, success_rate: 90.0 },
      cost_per_token: 0.00001,
      max_context_length: 128000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  currentSelection: null,
  routerActive: false,
  
  activeTasks: [],
  taskHistory: [],
  
  installedPlugins: [],
  availablePlugins: [
    {
      id: '1',
      name: 'GitHub Integration',
      version: '2.1.0',
      author: 'Super Agent Team',
      description: 'Integración completa con repositorios GitHub, issues y pull requests',
      category: 'Development',
      capabilities: { github_api: true, repository_access: true },
      config: {},
      is_enabled: false,
      is_verified: true,
      download_count: 1250,
      rating: 4.8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Docker Manager',
      version: '1.5.3',
      author: 'DevOps Corp',
      description: 'Gestión avanzada de contenedores Docker y orquestación',
      category: 'Infrastructure',
      capabilities: { docker_api: true, container_management: true },
      config: {},
      is_enabled: false,
      is_verified: true,
      download_count: 892,
      rating: 4.6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  
  systemMetrics: {
    active_tasks: 0,
    total_plugins: 0,
    memory_usage: 45.2,
    response_time: 1.8,
    success_rate: 96.4,
    cost_today: 12.35,
  },
  
  currentView: 'dashboard',
  
  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  
  updateMetrics: (metrics) => set((state) => ({
    systemMetrics: { ...state.systemMetrics, ...metrics }
  })),
  
  selectModel: (selection) => set({ currentSelection: selection }),
  
  addTask: (task) => set((state) => ({
    activeTasks: [...state.activeTasks, task],
    systemMetrics: { 
      ...state.systemMetrics, 
      active_tasks: state.systemMetrics.active_tasks + 1 
    }
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    activeTasks: state.activeTasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  })),
  
  installPlugin: (plugin) => set((state) => ({
    installedPlugins: [...state.installedPlugins, { ...plugin, is_enabled: true }],
    systemMetrics: { 
      ...state.systemMetrics, 
      total_plugins: state.systemMetrics.total_plugins + 1 
    }
  })),
  
  togglePlugin: (pluginId) => set((state) => ({
    installedPlugins: state.installedPlugins.map(plugin => 
      plugin.id === pluginId ? { ...plugin, is_enabled: !plugin.is_enabled } : plugin
    )
  })),
}))
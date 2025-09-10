import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon,
  User,
  Brain,
  Key,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  HardDrive,
  Wifi,
  Monitor,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAgentStore } from '@/stores/agentStore'

type SettingsSection = 'profile' | 'models' | 'api_keys' | 'memory' | 'security' | 'notifications' | 'appearance' | 'system'

interface APIKey {
  id: string
  name: string
  provider: string
  status: 'active' | 'inactive' | 'expired'
  last_used: string
  masked_key: string
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'OpenAI GPT-4',
    provider: 'OpenAI',
    status: 'active',
    last_used: '2024-01-07 14:30:22',
    masked_key: 'sk-...J9kL'
  },
  {
    id: '2',
    name: 'Anthropic Claude',
    provider: 'Anthropic',
    status: 'active',
    last_used: '2024-01-07 13:45:10',
    masked_key: 'sk-ant-...x7Y2'
  },
  {
    id: '3',
    name: 'Google Gemini',
    provider: 'Google',
    status: 'inactive',
    last_used: '2024-01-05 09:20:15',
    masked_key: 'AIza...Qm3N'
  }
]

const settingSections = [
  { id: 'profile', name: 'Perfil', icon: User },
  { id: 'models', name: 'Modelos LLM', icon: Brain },
  { id: 'api_keys', name: 'API Keys', icon: Key },
  { id: 'memory', name: 'Vector Memory', icon: Database },
  { id: 'security', name: 'Seguridad', icon: Shield },
  { id: 'notifications', name: 'Notificaciones', icon: Bell },
  { id: 'appearance', name: 'Apariencia', icon: Palette },
  { id: 'system', name: 'Sistema', icon: Monitor },
]

export function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuthStore()
  const { systemMetrics } = useAgentStore()
  
  const [settings, setSettings] = useState({
    profile: {
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      timezone: 'America/Mexico_City',
      language: 'es'
    },
    models: {
      default_model: 'claude-3.5-sonnet',
      auto_selection: true,
      max_context_length: 128000,
      temperature: 0.7
    },
    memory: {
      max_storage: 1000,
      auto_cleanup: true,
      sync_enabled: true,
      embedding_model: 'text-embedding-ada-002'
    },
    security: {
      two_factor: false,
      api_rate_limit: 100,
      audit_logs: true,
      data_encryption: true
    },
    notifications: {
      task_completion: true,
      system_alerts: true,
      email_notifications: false,
      sound_enabled: true
    },
    appearance: {
      theme: 'dark',
      accent_color: 'cyan',
      animations: true,
      compact_mode: false
    },
    system: {
      auto_backup: true,
      backup_frequency: 'daily',
      log_level: 'info',
      performance_mode: 'balanced'
    }
  })
  
  const saveSettings = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'inactive':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
      case 'expired':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }
  
  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
            <input
              type="text"
              value={settings.profile.full_name}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, full_name: e.target.value }
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              disabled
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Zona Horaria</label>
            <select
              value={settings.profile.timezone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, timezone: e.target.value }
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="America/Mexico_City">México (GMT-6)</option>
              <option value="America/New_York">Nueva York (GMT-5)</option>
              <option value="Europe/Madrid">Madrid (GMT+1)</option>
              <option value="Asia/Tokyo">Tokio (GMT+9)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
            <select
              value={settings.profile.language}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, language: e.target.value }
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderAPIKeysSettings = () => {
    // Dynamic Provider Manager (Anything LLM style)
    // lightweight UI without modals for now
    // Uses localStorage via providerStore
    // SECURITY: for producción, mover claves a Edge Function + DB cifrado
    const { providers, addProvider, updateProvider, deleteProvider, toggleProvider, testProvider } = (require('@/stores/providerStore') as typeof import('@/stores/providerStore')).useProviderStore()
    const [form, setForm] = useState({
      name: '',
      provider: 'openai',
      endpoint: '',
      apiKey: '',
      model: '',
      azure_apiVersion: '',
      azure_deployment: '',
    })
    const [testingId, setTestingId] = useState<string | null>(null)

    const add = () => {
      if (!form.name || !form.endpoint) return
      const cfg = {
        name: form.name,
        provider: form.provider as any,
        endpoint: form.endpoint,
        apiKey: form.apiKey || undefined,
        model: form.model || undefined,
        azure: (form.provider === 'azure-openai') ? { apiVersion: form.azure_apiVersion || undefined, deployment: form.azure_deployment || undefined } : undefined,
        headers: undefined,
        active: true,
      }
      addProvider(cfg as any)
      setForm({ name: '', provider: 'openai', endpoint: '', apiKey: '', model: '', azure_apiVersion: '', azure_deployment: '' })
    }

    const test = async (id: string) => {
      try {
        setTestingId(id)
        const cfg = providers.find(p => p.id === id)
        if (!cfg) return
        const res = await testProvider(cfg)
        alert(res.ok ? `OK (${res.status}) ${res.message || ''}` : `Fallo (${res.status}) ${res.message || ''}`)
      } finally {
        setTestingId(null)
      }
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4 p-4 bg-gray-700/40 rounded-lg border border-gray-600/40">
          <h3 className="text-lg font-semibold text-white">Agregar Proveedor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nombre</label>
              <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Mi OpenRouter" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Proveedor</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.provider} onChange={e=>setForm({...form, provider:e.target.value})}>
                {['openai','anthropic','google','openrouter','groq','mistral','azure-openai','lm-studio','deepseek','moonshot','custom'].map(p=> (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Endpoint</label>
              <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.endpoint} onChange={e=>setForm({...form, endpoint:e.target.value})} placeholder="https://api.openrouter.ai/v1" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">API Key</label>
              <input type="password" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.apiKey} onChange={e=>setForm({...form, apiKey:e.target.value})} placeholder="sk-..." />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Modelo (opcional)</label>
              <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.model} onChange={e=>setForm({...form, model:e.target.value})} placeholder="gpt-4o, mistral-large, llama3:8b, ..." />
            </div>
            {form.provider === 'azure-openai' && (
              <>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Azure API Version</label>
                  <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.azure_apiVersion} onChange={e=>setForm({...form, azure_apiVersion:e.target.value})} placeholder="2024-02-15-preview" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Azure Deployment</label>
                  <input className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={form.azure_deployment} onChange={e=>setForm({...form, azure_deployment:e.target.value})} placeholder="mi-deployment" />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={add} className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg">
              <Key className="w-4 h-4" />
              <span>Guardar Proveedor</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {providers.length === 0 && (
            <div className="text-sm text-gray-400">No hay proveedores configurados aún.</div>
          )}
          {providers.map((p) => (
            <div key={p.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-white">{p.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${p.active ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                      {p.active ? 'activo' : 'inactivo'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                    <span>{p.provider}</span>
                    <span className="truncate max-w-[300px]">{p.endpoint}</span>
                    {p.model && <span>model: {p.model}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => test(p.id)} className="p-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg" disabled={testingId===p.id}>
                    <RefreshCw className={`w-4 h-4 ${testingId===p.id ? 'animate-spin' : ''}`} />
                  </button>
                  <button onClick={async ()=>{
                    try{
                      const { supabase } = await import('@/lib/supabase')
                      const { data, error } = await supabase.functions.invoke('llm-proxy', {
                        body: { provider: p.provider, endpoint: p.endpoint, apiKey: p.apiKey, model: p.model, messages:[{role:'user',content:'Hola, prueba corta.'}] }
                      })
                      if (error) return alert('Fallo: '+error.message)
                      alert('OK: '+(data?.data?.choices?.[0]?.message?.content||JSON.stringify(data)))
                    }catch(e){ alert('Error: '+(e as Error).message) }
                  }} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Run</button>
                  <button onClick={() => toggleProvider(p.id)} className="p-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-lg">{p.active ? 'Desactivar' : 'Activar'}</button>
                  <button onClick={() => deleteProvider(p.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  
  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Estado del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Uso de Memoria</p>
                <p className="text-xl font-bold text-white">{systemMetrics.memory_usage}%</p>
              </div>
              <HardDrive className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Latencia Red</p>
                <p className="text-xl font-bold text-white">{systemMetrics.response_time}s</p>
              </div>
              <Wifi className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tasa Éxito</p>
                <p className="text-xl font-bold text-white">{systemMetrics.success_rate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Configuración del Sistema</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Backup Automático</h4>
              <p className="text-sm text-gray-400">Respaldar datos automáticamente</p>
            </div>
            <input
              type="checkbox"
              checked={settings.system.auto_backup}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                system: { ...prev.system, auto_backup: e.target.checked }
              }))}
              className="w-5 h-5 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
            />
          </div>
          
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Modo de Rendimiento</h4>
              <select
                value={settings.system.performance_mode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, performance_mode: e.target.value }
                }))}
                className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="eco">Eco</option>
                <option value="balanced">Balanceado</option>
                <option value="performance">Alto Rendimiento</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar Configuración</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              <span>Importar Configuración</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings()
      case 'api_keys':
        return renderAPIKeysSettings()
      case 'system':
        return renderSystemSettings()
      default:
        return (
          <div className="text-center py-12 text-gray-400">
            <SettingsIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">
              Sección en Desarrollo
            </h3>
            <p>Esta sección estará disponible en futuras actualizaciones</p>
          </div>
        )
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuración</h1>
          <p className="text-gray-400 mt-1">Personaliza tu experiencia con el Super Agente</p>
        </div>
        
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <nav className="space-y-2">
            {settingSections.map((section) => {
              const IconComponent = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingsSection)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{section.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            {renderSectionContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
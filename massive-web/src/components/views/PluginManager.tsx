import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Puzzle,
  Search,
  Download,
  Trash2,
  Settings,
  Star,
  Shield,
  Users,
  Zap,
  Code,
  Database,
  Globe,
  Github,
  Play,
  Pause,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Filter,
  SortAsc,
  Grid,
  List,
  Package
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
import { Plugin } from '@/lib/supabase'

type PluginCategory = 'all' | 'development' | 'infrastructure' | 'integrations' | 'ai' | 'security' | 'data'
type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'rating' | 'downloads' | 'updated'

const pluginCategories = [
  { id: 'all', name: 'Todos', icon: Grid },
  { id: 'development', name: 'Desarrollo', icon: Code },
  { id: 'infrastructure', name: 'Infraestructura', icon: Settings },
  { id: 'integrations', name: 'Integraciones', icon: Globe },
  { id: 'ai', name: 'IA & ML', icon: Zap },
  { id: 'security', name: 'Seguridad', icon: Shield },
  { id: 'data', name: 'Datos', icon: Database },
]

// Mock data for more plugins
const mockAvailablePlugins: Plugin[] = [
  {
    id: '3',
    name: 'OpenAI GPT Integration',
    version: '3.2.1',
    author: 'OpenAI Team',
    description: 'Integración completa con modelos GPT-4 y GPT-3.5 para generación de texto, código y análisis',
    category: 'ai',
    capabilities: { text_generation: true, code_generation: true, analysis: true },
    config: { api_key_required: true },
    is_enabled: false,
    is_verified: true,
    download_count: 15420,
    rating: 4.9,
    install_url: 'https://github.com/openai/plugin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Slack Notifications',
    version: '1.8.2',
    author: 'Slack Inc.',
    description: 'Envía notificaciones automáticas a canales de Slack sobre el estado de tareas y eventos del sistema',
    category: 'integrations',
    capabilities: { notifications: true, webhooks: true, channels: true },
    config: { webhook_url_required: true },
    is_enabled: false,
    is_verified: true,
    download_count: 8930,
    rating: 4.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'AWS Cloud Manager',
    version: '2.1.0',
    author: 'AWS Solutions',
    description: 'Gestiona recursos de AWS EC2, S3, Lambda y RDS desde el Super Agente',
    category: 'infrastructure',
    capabilities: { ec2_management: true, s3_access: true, lambda_deploy: true },
    config: { aws_credentials_required: true },
    is_enabled: false,
    is_verified: true,
    download_count: 6750,
    rating: 4.6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Security Scanner',
    version: '1.5.4',
    author: 'CyberSec Corp',
    description: 'Escanea código y dependencias en busca de vulnerabilidades de seguridad',
    category: 'security',
    capabilities: { vulnerability_scan: true, dependency_check: true, code_analysis: true },
    config: {},
    is_enabled: false,
    is_verified: true,
    download_count: 4320,
    rating: 4.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'MongoDB Connector',
    version: '2.0.3',
    author: 'MongoDB Inc.',
    description: 'Conecta y gestiona bases de datos MongoDB con operaciones CRUD avanzadas',
    category: 'data',
    capabilities: { crud_operations: true, aggregation: true, indexing: true },
    config: { connection_string_required: true },
    is_enabled: false,
    is_verified: true,
    download_count: 7650,
    rating: 4.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Kubernetes Orchestrator',
    version: '1.12.5',
    author: 'K8s Team',
    description: 'Despliega y gestiona aplicaciones en clusters de Kubernetes',
    category: 'infrastructure',
    capabilities: { deployment: true, scaling: true, monitoring: true },
    config: { kubeconfig_required: true },
    is_enabled: false,
    is_verified: false,
    download_count: 3240,
    rating: 4.3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function PluginManager() {
  const { installedPlugins, availablePlugins, installPlugin, togglePlugin } = useAgentStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PluginCategory>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('rating')
  const [showInstalled, setShowInstalled] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [isInstalling, setIsInstalling] = useState<string | null>(null)
  
  // Combine real available plugins with mock data
  const allAvailablePlugins = [...availablePlugins, ...mockAvailablePlugins]
  
  const filteredPlugins = (showInstalled ? installedPlugins : allAvailablePlugins)
    .filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plugin.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'downloads':
          return b.download_count - a.download_count
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        default:
          return 0
      }
    })
  
  const handleInstallPlugin = async (plugin: Plugin) => {
    setIsInstalling(plugin.id)
    
    // Simulate installation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    installPlugin(plugin)
    setIsInstalling(null)
  }
  
  const getCategoryIcon = (category: string) => {
    const cat = pluginCategories.find(c => c.id === category)
    return cat ? cat.icon : Package
  }
  
  const getPluginStatusColor = (plugin: Plugin) => {
    if (!installedPlugins.find(p => p.id === plugin.id)) return 'text-gray-400'
    return plugin.is_enabled ? 'text-green-400' : 'text-yellow-400'
  }
  
  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
      />
    ))
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Plugin Manager</h1>
          <p className="text-gray-400 mt-1">Marketplace de extensiones modulares</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {installedPlugins.length} instalados
            </span>
          </div>
          
          <button
            onClick={() => setShowInstalled(!showInstalled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showInstalled 
                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{showInstalled ? 'Ver Marketplace' : 'Ver Instalados'}</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Categories */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as PluginCategory)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {pluginCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="rating">Calificación</option>
                <option value="downloads">Descargas</option>
                <option value="name">Nombre</option>
                <option value="updated">Actualizado</option>
              </select>
            </div>
            
            {/* View Mode */}
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plugins Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {filteredPlugins.map((plugin) => {
          const IconComponent = getCategoryIcon(plugin.category || 'all')
          const isInstalled = installedPlugins.find(p => p.id === plugin.id)
          const isInstalling_ = isInstalling === plugin.id
          
          if (viewMode === 'list') {
            return (
              <motion.div
                key={plugin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-gray-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{plugin.name}</h3>
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        v{plugin.version}
                      </span>
                      {plugin.is_verified && (
                        <Shield className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {plugin.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(plugin.rating || 0)}
                        <span className="ml-1">{plugin.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>{plugin.download_count.toLocaleString()}</span>
                      </div>
                      <span>por {plugin.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isInstalled ? (
                      <>
                        <button
                          onClick={() => togglePlugin(plugin.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            plugin.is_enabled
                              ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                          }`}
                        >
                          {plugin.is_enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        
                        <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleInstallPlugin(plugin)}
                        disabled={isInstalling_}
                        className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {isInstalling_ ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>{isInstalling_ ? 'Instalando...' : 'Instalar'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          }
          
          return (
            <motion.div
              key={plugin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{plugin.name}</h3>
                      {plugin.is_verified && (
                        <Shield className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">v{plugin.version} • {plugin.author}</p>
                  </div>
                </div>
                
                <div className={`w-2 h-2 rounded-full ${getPluginStatusColor(plugin)}`} />
              </div>
              
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {plugin.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {getRatingStars(plugin.rating || 0)}
                  <span className="text-sm text-gray-400 ml-2">
                    {plugin.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Download className="w-3 h-3" />
                  <span>{plugin.download_count.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isInstalled ? (
                  <>
                    <button
                      onClick={() => togglePlugin(plugin.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                        plugin.is_enabled
                          ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                      }`}
                    >
                      {plugin.is_enabled ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Activar</span>
                        </>
                      )}
                    </button>
                    
                    <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInstallPlugin(plugin)}
                    disabled={isInstalling_}
                    className="w-full flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {isInstalling_ ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Instalando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Instalar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {filteredPlugins.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No se encontraron plugins
          </h3>
          <p className="text-gray-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  )
}
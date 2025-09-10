import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database,
  Search,
  Brain,
  Clock,
  FileText,
  Filter,
  Download,
  Trash2,
  Eye,
  Plus,
  Zap
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'

interface MemoryEntry {
  id: string
  content: string
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic'
  relevance_score: number
  created_at: string
  tags: string[]
  source: string
}

// Mock memory data
const mockMemoryData: MemoryEntry[] = [
  {
    id: '1',
    content: 'El usuario prefiere usar TypeScript para proyectos de desarrollo web. Mencionó que valora la seguridad de tipos y la mejor experiencia de desarrollo.',
    type: 'semantic',
    relevance_score: 0.92,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['preferencias', 'typescript', 'desarrollo'],
    source: 'conversation'
  },
  {
    id: '2',
    content: 'Solución exitosa: Para conectar a MongoDB, usar mongoose con autenticación SSL y pool de conexiones configurado a 10 conexiones máximas.',
    type: 'episodic',
    relevance_score: 0.88,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    tags: ['mongodb', 'conexión', 'solución'],
    source: 'task_result'
  },
  {
    id: '3',
    content: 'API key de OpenAI configurada correctamente. El modelo GPT-4 responde en promedio 1.8 segundos para tareas de codificación.',
    type: 'short_term',
    relevance_score: 0.75,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    tags: ['openai', 'configuración', 'rendimiento'],
    source: 'system_log'
  },
  {
    id: '4',
    content: 'El patrón de arquitectura hexagonal es efectivo para aplicaciones que requieren múltiples fuentes de datos y alta testabilidad.',
    type: 'semantic',
    relevance_score: 0.85,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    tags: ['arquitectura', 'patrones', 'diseño'],
    source: 'knowledge_base'
  },
  {
    id: '5',
    content: 'Error resuelto: El problema de CORS se solucionó configurando los headers correctos en el middleware de Express.',
    type: 'episodic',
    relevance_score: 0.79,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tags: ['cors', 'express', 'error', 'solución'],
    source: 'debugging_session'
  }
]

export function VectorMemoryViewer() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  const memoryTypes = [
    { id: 'all', name: 'Todas', color: 'bg-gray-500' },
    { id: 'short_term', name: 'Corto Plazo', color: 'bg-yellow-500' },
    { id: 'long_term', name: 'Largo Plazo', color: 'bg-blue-500' },
    { id: 'episodic', name: 'Episódica', color: 'bg-green-500' },
    { id: 'semantic', name: 'Semántica', color: 'bg-purple-500' },
  ]
  
  const filteredMemories = mockMemoryData
    .filter(memory => {
      const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = selectedType === 'all' || memory.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => b.relevance_score - a.relevance_score)
  
  const performVectorSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    // Simulate vector search delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSearching(false)
  }
  
  const getTypeColor = (type: string) => {
    const memType = memoryTypes.find(t => t.id === type)
    return memType ? memType.color : 'bg-gray-500'
  }
  
  const getTimeAgo = (date: string) => {
    const now = new Date()
    const memDate = new Date(date)
    const diffMs = now.getTime() - memDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return `${diffDays}d ago`
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vector Memory</h1>
          <p className="text-gray-400 mt-1">Memoria distribuida y búsqueda semántica</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {mockMemoryData.length} memorias almacenadas
            </span>
          </div>
          
          <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200">
            <Plus className="w-4 h-4" />
            <span>Agregar Memoria</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="space-y-4">
          {/* Vector Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Búsqueda semántica en la memoria vectorial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performVectorSearch()}
                className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <button
              onClick={performVectorSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Búsqueda Vectorial</span>
                </>
              )}
            </button>
          </div>
          
          {/* Memory Type Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 mr-2">Tipo:</span>
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              {memoryTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    selectedType === type.id
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Entradas de Memoria ({filteredMemories.length})</span>
          </h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredMemories.map((memory) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer ${
                  selectedMemory?.id === memory.id ? 'border-cyan-500/50 bg-cyan-500/5' : ''
                }`}
                onClick={() => setSelectedMemory(memory)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(memory.type)}`} />
                    <span className="text-xs text-gray-400 capitalize">
                      {memory.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Zap className="w-3 h-3" />
                      <span>{(memory.relevance_score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-xs text-gray-500">{getTimeAgo(memory.created_at)}</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                  {memory.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {memory.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{memory.tags.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                      <Eye className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                      <Download className="w-3 h-3 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-red-500/20 rounded transition-colors">
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Memory Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          {selectedMemory ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Detalles de la Memoria</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(selectedMemory.type)}`} />
                  <span className="text-sm text-gray-400 capitalize">
                    {selectedMemory.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Contenido</label>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedMemory.content}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Relevancia</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${selectedMemory.relevance_score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-cyan-400 font-medium">
                        {(selectedMemory.relevance_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Fuente</label>
                    <span className="text-sm text-gray-300 capitalize">
                      {selectedMemory.source.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Etiquetas</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMemory.tags.map((tag, index) => (
                      <span key={index} className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Creada</label>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedMemory.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Ver Completo</span>
                </button>
                
                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                
                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">Selecciona una memoria</h3>
              <p>Haz clic en cualquier entrada para ver los detalles completos</p>
            </div>
          )}
        </div>
      </div>
      
      {filteredMemories.length === 0 && (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No se encontraron memorias
          </h3>
          <p className="text-gray-400">
            Intenta ajustar los filtros de búsqueda o agrega nuevas memorias
          </p>
        </div>
      )}
    </div>
  )
}
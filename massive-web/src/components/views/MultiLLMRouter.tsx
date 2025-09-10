import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  Zap,
  Target,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Shield,
  Code,
  Eye,
  MessageSquare,
  Gauge
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
import { LLMSelection } from '@/stores/agentStore'
import { LLMModel } from '@/lib/supabase'

interface TaskRequest {
  description: string
  type: 'coding' | 'reasoning' | 'multimodal' | 'analysis' | 'general'
  priority: 'low' | 'medium' | 'high'
  context_length: number
  privacy_required: boolean
  max_cost: number
}

export function MultiLLMRouter() {
  const { availableModels, currentSelection, selectModel, systemMetrics } = useAgentStore()
  const [taskRequest, setTaskRequest] = useState<TaskRequest>({
    description: '',
    type: 'general',
    priority: 'medium',
    context_length: 4000,
    privacy_required: false,
    max_cost: 0.1
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [routerHistory, setRouterHistory] = useState<LLMSelection[]>([])

  // Mock AI selection algorithm
  const analyzeAndSelectModel = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Score models based on task requirements
    const scoredModels = availableModels.map(model => {
      let score = 0
      
      // Task type scoring
      if (taskRequest.type === 'coding' && model.capabilities.coding) {
        score += model.capabilities.coding * 0.4
      }
      if (taskRequest.type === 'reasoning' && model.capabilities.reasoning) {
        score += model.capabilities.reasoning * 0.4
      }
      if (taskRequest.type === 'multimodal' && model.capabilities.multimodal) {
        score += model.capabilities.multimodal * 0.4
      }
      
      // Performance scoring
      score += (model.performance_metrics.success_rate || 0) * 0.2
      score -= (model.performance_metrics.avg_response_time || 0) * 5
      
      // Cost consideration
      if (model.cost_per_token && model.cost_per_token <= taskRequest.max_cost) {
        score += 20
      } else {
        score -= 30
      }
      
      // Privacy requirement
      if (taskRequest.privacy_required && model.capabilities.privacy === 100) {
        score += 50
      } else if (taskRequest.privacy_required) {
        score -= 50
      }
      
      // Context length
      if ((model.max_context_length || 0) >= taskRequest.context_length) {
        score += 10
      }
      
      return { model, score }
    })
    
    // Select best model
    const bestModel = scoredModels.sort((a, b) => b.score - a.score)[0]
    
    const selection: LLMSelection = {
      task_type: taskRequest.type,
      selected_model: bestModel.model,
      reasoning: generateReasoning(bestModel.model, taskRequest),
      confidence: Math.min(95, Math.max(65, bestModel.score)),
      timestamp: new Date().toISOString()
    }
    
    selectModel(selection)
    setRouterHistory(prev => [selection, ...prev.slice(0, 4)])
    setIsAnalyzing(false)
  }
  
  const generateReasoning = (model: LLMModel, request: TaskRequest): string => {
    const reasons = []
    
    if (request.type === 'coding' && model.capabilities.coding > 90) {
      reasons.push(`Excelente capacidad de codificación (${model.capabilities.coding}%)`)
    }
    
    if (request.privacy_required && model.capabilities.privacy === 100) {
      reasons.push('Procesamiento local garantiza privacidad total')
    }
    
    if (model.performance_metrics.success_rate > 95) {
      reasons.push(`Alta tasa de éxito (${model.performance_metrics.success_rate}%)`)
    }
    
    if (model.cost_per_token < 0.00002) {
      reasons.push('Costo óptimo por token')
    }
    
    return reasons.join('. ') || 'Mejor opción general para esta tarea'
  }
  
  const getModelTypeIcon = (model: LLMModel) => {
    if (model.capabilities.privacy === 100) return Shield
    if (model.capabilities.coding > 90) return Code
    if (model.capabilities.multimodal > 90) return Eye
    return Brain
  }
  
  const getCapabilityColor = (value: number) => {
    if (value >= 95) return 'text-green-400'
    if (value >= 85) return 'text-yellow-400'
    if (value >= 70) return 'text-orange-400'
    return 'text-red-400'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Multi-LLM Router</h1>
          <p className="text-gray-400 mt-1">Sistema inteligente de selección de modelos con IA</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-300">Router Activo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Configuración de Tarea</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción de la Tarea
                </label>
                <textarea
                  value={taskRequest.description}
                  onChange={(e) => setTaskRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe qué necesitas que haga el agente..."
                  className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de Tarea
                  </label>
                  <select
                    value={taskRequest.type}
                    onChange={(e) => setTaskRequest(prev => ({ ...prev, type: e.target.value as TaskRequest['type'] }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="general">General</option>
                    <option value="coding">Codificación</option>
                    <option value="reasoning">Razonamiento</option>
                    <option value="multimodal">Multimodal</option>
                    <option value="analysis">Análisis</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={taskRequest.priority}
                    onChange={(e) => setTaskRequest(prev => ({ ...prev, priority: e.target.value as TaskRequest['priority'] }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitud de Contexto
                  </label>
                  <input
                    type="number"
                    value={taskRequest.context_length}
                    onChange={(e) => setTaskRequest(prev => ({ ...prev, context_length: parseInt(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Costo Máximo ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={taskRequest.max_cost}
                    onChange={(e) => setTaskRequest(prev => ({ ...prev, max_cost: parseFloat(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={taskRequest.privacy_required}
                  onChange={(e) => setTaskRequest(prev => ({ ...prev, privacy_required: e.target.checked }))}
                  className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <label htmlFor="privacy" className="text-sm text-gray-300">
                  Requiere procesamiento local (privacidad)
                </label>
              </div>
              
              <button
                onClick={analyzeAndSelectModel}
                disabled={isAnalyzing || !taskRequest.description.trim()}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analizando...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Seleccionar Modelo Óptimo</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Current Selection */}
          <AnimatePresence>
            {currentSelection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Modelo Seleccionado</span>
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Recomendación del sistema IA</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1">
                    <Gauge className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm font-medium">
                      {currentSelection.confidence}% confianza
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      {(() => {
                        const IconComponent = getModelTypeIcon(currentSelection.selected_model)
                        return <IconComponent className="w-6 h-6 text-white" />
                      })()} 
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {currentSelection.selected_model.name}
                      </h4>
                      <p className="text-gray-400 text-sm">{currentSelection.selected_model.provider}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{currentSelection.reasoning}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(currentSelection.selected_model.capabilities).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-xs text-gray-400 capitalize mb-1">{key}</div>
                        <div className={`text-sm font-medium ${getCapabilityColor(value as number)}`}>
                          {value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                >
                  {showDetails ? 'Ocultar' : 'Ver'} detalles técnicos
                </button>
                
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700/50"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Costo por token:</span>
                          <span className="text-white ml-2">
                            ${(currentSelection.selected_model.cost_per_token || 0).toFixed(6)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Contexto máximo:</span>
                          <span className="text-white ml-2">
                            {(currentSelection.selected_model.max_context_length || 0).toLocaleString()} tokens
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tiempo respuesta:</span>
                          <span className="text-white ml-2">
                            {currentSelection.selected_model.performance_metrics.avg_response_time}s
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tasa éxito:</span>
                          <span className="text-white ml-2">
                            {currentSelection.selected_model.performance_metrics.success_rate}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Available Models & History */}
        <div className="space-y-6">
          {/* Available Models */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Modelos Disponibles</h3>
            <div className="space-y-3">
              {availableModels.map((model) => {
                const IconComponent = getModelTypeIcon(model)
                const isSelected = currentSelection?.selected_model.id === model.id
                
                return (
                  <div
                    key={model.id}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-cyan-500/20 border border-cyan-500/30' 
                        : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{model.name}</div>
                        <div className="text-xs text-gray-400">{model.provider}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        model.is_active ? 'bg-green-400' : 'bg-gray-500'
                      }`} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {Object.entries(model.capabilities).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-gray-400 capitalize">{key}</div>
                          <div className={getCapabilityColor(value as number)}>{value}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Selection History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Historial de Selecciones</h3>
            <div className="space-y-3">
              {routerHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin selecciones previas</p>
                </div>
              ) : (
                routerHistory.map((selection, index) => (
                  <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white text-sm">
                        {selection.selected_model.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(selection.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400 capitalize">
                        {selection.task_type}
                      </div>
                      <div className="text-xs text-cyan-400">
                        {selection.confidence}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
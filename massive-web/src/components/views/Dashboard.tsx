import { motion } from 'framer-motion'
import { 
  Activity,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Code,
  Database
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
// Charts temporarily disabled for build
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data for charts
const performanceData = [
  { time: '00:00', response_time: 1.2, success_rate: 98, cost: 8.5 },
  { time: '04:00', response_time: 1.8, success_rate: 96, cost: 12.3 },
  { time: '08:00', response_time: 2.1, success_rate: 94, cost: 18.7 },
  { time: '12:00', response_time: 1.6, success_rate: 97, cost: 15.2 },
  { time: '16:00', response_time: 1.4, success_rate: 99, cost: 11.8 },
  { time: '20:00', response_time: 1.8, success_rate: 95, cost: 16.4 },
]

const modelUsageData = [
  { model: 'Claude 3.5', usage: 45, color: '#06b6d4' },
  { model: 'GPT-4', usage: 30, color: '#3b82f6' },
  { model: 'Gemini 1.5', usage: 20, color: '#8b5cf6' },
  { model: 'Llama Local', usage: 5, color: '#10b981' },
]

export function Dashboard() {
  const { systemMetrics, activeTasks, availableModels, installedPlugins, currentSelection } = useAgentStore()

  const statCards = [
    {
      title: 'Tareas Activas',
      value: systemMetrics.active_tasks,
      change: '+12%',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: Activity,
      color: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'Tiempo de Respuesta',
      value: `${systemMetrics.response_time}s`,
      change: '-8%',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: Clock,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Tasa de Éxito',
      value: `${systemMetrics.success_rate}%`,
      change: '+2.1%',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: CheckCircle,
      color: 'from-green-400 to-teal-500'
    },
    {
      title: 'Costo Hoy',
      value: `$${systemMetrics.cost_today.toFixed(2)}`,
      change: '+$3.20',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Vista general del Super Agente Multimodal</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Sistema Operativo</span>
          </div>
          
          {currentSelection && (
            <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-4 py-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">{currentSelection.selected_model.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  
                  <div className="flex items-center mt-3 space-x-1">
                    <TrendingUp className={`w-4 h-4 ${
                      stat.changeType === 'positive' ? 'text-green-400' :
                      stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-400' :
                      stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-sm">vs ayer</span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Rendimiento en Tiempo Real</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full" />
                <span className="text-gray-300">Tiempo Respuesta</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-gray-300">Tasa Éxito</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center bg-gray-700/20 rounded-lg">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico de Rendimiento</p>
              <p className="text-sm">Tiempo Real: {systemMetrics.response_time}s | Éxito: {systemMetrics.success_rate}%</p>
            </div>
          </div>
        </motion.div>

        {/* Model Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Uso de Modelos LLM</h3>
            <div className="text-sm text-gray-400">Últimas 24h</div>
          </div>
          
          <div className="h-64 space-y-3">
            {modelUsageData.map((model, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-gray-300">{model.model}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${model.usage}%`,
                      backgroundColor: model.color
                    }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-400 text-right">{model.usage}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-left transition-colors group">
              <Code className="w-5 h-5 text-cyan-400" />
              <div className="flex-1">
                <div className="font-medium text-white group-hover:text-cyan-300">Generar Código</div>
                <div className="text-xs text-gray-400">Crear aplicación desde descripción</div>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-left transition-colors group">
              <Brain className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="font-medium text-white group-hover:text-purple-300">Análisis Multimodal</div>
                <div className="text-xs text-gray-400">Procesar imagen y texto</div>
              </div>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-left transition-colors group">
              <Database className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <div className="font-medium text-white group-hover:text-green-300">Buscar Memoria</div>
                <div className="text-xs text-gray-400">Consultar base de conocimiento</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Estado del Sistema</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Multi-LLM Router</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Activo</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Vector Memory</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Sincronizada</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Plugins ({installedPlugins.length})</span>
              </div>
              <span className="text-yellow-400 text-sm font-medium">Parcial</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300 text-sm">Automatización GUI</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Lista</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Tareas Recientes</h3>
          <div className="space-y-3">
            {activeTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay tareas activas</p>
              </div>
            ) : (
              activeTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'completed' ? 'bg-green-400' :
                    task.status === 'in_progress' ? 'bg-yellow-400 animate-pulse' :
                    task.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{task.title}</div>
                    <div className="text-xs text-gray-400">{task.task_type}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.progress}%
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
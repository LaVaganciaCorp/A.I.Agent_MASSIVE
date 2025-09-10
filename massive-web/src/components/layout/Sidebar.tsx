import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  Brain,
  Code,
  ListTodo,
  Puzzle,
  Database,
  Zap,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
import { cn } from '@/lib/utils'

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', description: 'Vista general del sistema' },
  { id: 'router', icon: Brain, label: 'Multi-LLM Router', description: 'Selección inteligente de modelos' },
  { id: 'coding', icon: Code, label: 'Motor de Codificación', description: 'Desarrollo avanzado de código' },
  { id: 'tasks', icon: ListTodo, label: 'Sistema de Tareas', description: 'Gestión de tareas automáticas' },
  { id: 'plugins', icon: Puzzle, label: 'Plugins', description: 'Marketplace de extensiones' },
  { id: 'memory', icon: Database, label: 'Vector Memory', description: 'Memoria distribuida' },
  { id: 'automation', icon: Zap, label: 'Automatización GUI', description: 'Control cross-platform' },
  { id: 'settings', icon: Settings, label: 'Configuración', description: 'Ajustes del sistema' },
] as const

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { currentView, setCurrentView, systemMetrics } = useAgentStore()

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="flex flex-col bg-gray-900/50 backdrop-blur-sm border-r border-cyan-500/20 relative"
    >
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Super Agente</h2>
                  <p className="text-xs text-gray-400">Sistema Multimodal</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              )}
              whileHover={{ x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-cyan-500/20" : "group-hover:bg-gray-700"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {isActive && !collapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-cyan-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Status Bar */}
      <div className="p-4 border-t border-cyan-500/20">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Tareas Activas</span>
                <span className="text-cyan-400 font-mono">{systemMetrics.active_tasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Éxito</span>
                <span className="text-green-400 font-mono">{systemMetrics.success_rate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Memoria</span>
                <span className="text-yellow-400 font-mono">{systemMetrics.memory_usage}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
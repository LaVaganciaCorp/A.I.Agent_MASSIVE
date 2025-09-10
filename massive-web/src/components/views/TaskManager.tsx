import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ListTodo,
  Plus,
  Play,
  Pause,
  Square,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  Calendar,
  User,
  Zap,
  Brain,
  Code,
  Database,
  Settings,
  Trash2,
  Edit3
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'
import { Task } from '@/lib/supabase'

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
type TaskFilter = 'all' | TaskStatus
type TaskPriority = 1 | 2 | 3

interface NewTask {
  title: string
  description: string
  task_type: string
  priority: TaskPriority
  estimated_duration: number
}

const taskTypes = [
  { id: 'coding', name: 'Codificación', icon: Code, color: 'from-blue-400 to-cyan-500' },
  { id: 'analysis', name: 'Análisis', icon: Brain, color: 'from-purple-400 to-pink-500' },
  { id: 'automation', name: 'Automatización', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'data', name: 'Datos', icon: Database, color: 'from-green-400 to-emerald-500' },
  { id: 'integration', name: 'Integración', icon: Settings, color: 'from-gray-400 to-slate-500' },
]

// Mock additional tasks
const mockTasks: Task[] = [
  {
    id: 'task-1',
    user_id: 'user-1',
    title: 'Generar API REST para e-commerce',
    description: 'Crear una API completa con endpoints para productos, usuarios y órdenes',
    task_type: 'coding',
    status: 'in_progress',
    priority: 1,
    assigned_model: 'Claude 3.5 Sonnet',
    progress: 65,
    metadata: { 
      language: 'typescript',
      framework: 'express',
      estimated_lines: 500 
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-2',
    user_id: 'user-1',
    title: 'Análisis de sentimientos en redes sociales',
    description: 'Procesar y analizar el sentimiento de menciones de marca en Twitter',
    task_type: 'analysis',
    status: 'completed',
    priority: 2,
    assigned_model: 'GPT-4 Turbo',
    progress: 100,
    result: {
      processed_tweets: 1247,
      positive_sentiment: 68,
      negative_sentiment: 23,
      neutral_sentiment: 9
    },
    metadata: { 
      source: 'twitter_api',
      keywords: ['marca', 'producto'],
      date_range: '2024-01-01 to 2024-01-07'
    },
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-3',
    user_id: 'user-1',
    title: 'Automatizar despliegue en Docker',
    description: 'Configurar pipeline CI/CD con GitHub Actions y despliegue automático',
    task_type: 'automation',
    status: 'failed',
    priority: 2,
    assigned_model: 'Claude 3.5 Sonnet',
    progress: 85,
    result: {
      error: 'Docker registry authentication failed',
      partial_completion: true,
      github_actions_configured: true
    },
    metadata: { 
      repository: 'github.com/user/project',
      target_environment: 'production' 
    },
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export function TaskManager() {
  const { activeTasks, taskHistory, addTask, updateTask, currentSelection } = useAgentStore()
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    task_type: 'coding',
    priority: 2,
    estimated_duration: 30
  })
  
  // Combine real tasks with mock data
  const allTasks = [...activeTasks, ...mockTasks]
  
  const filteredTasks = allTasks
    .filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      // Sort by priority first, then by creation date
      if (a.priority !== b.priority) {
        return a.priority - b.priority // Lower number = higher priority
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  
  const createTask = () => {
    const task: Task = {
      id: `task-${Date.now()}`,
      user_id: 'current-user',
      title: newTask.title,
      description: newTask.description,
      task_type: newTask.task_type,
      status: 'pending',
      priority: newTask.priority,
      assigned_model: currentSelection?.selected_model.name,
      progress: 0,
      metadata: {
        estimated_duration: newTask.estimated_duration,
        created_via: 'task_manager'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    addTask(task)
    setNewTask({
      title: '',
      description: '',
      task_type: 'coding',
      priority: 2,
      estimated_duration: 30
    })
    setShowNewTaskModal(false)
  }
  
  const executeTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'in_progress',
      progress: 10,
      updated_at: new Date().toISOString()
    })
    
    // Simulate task execution
    setTimeout(() => {
      updateTask(taskId, { 
        progress: 50,
        updated_at: new Date().toISOString()
      })
    }, 2000)
    
    setTimeout(() => {
      updateTask(taskId, { 
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }, 5000)
  }
  
  const pauseTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'pending',
      updated_at: new Date().toISOString()
    })
  }
  
  const getTaskTypeInfo = (type: string) => {
    return taskTypes.find(t => t.id === type) || taskTypes[0]
  }
  
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-400 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'in_progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }
  
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-400'
      case 2:
        return 'bg-yellow-400'
      case 3:
        return 'bg-green-400'
      default:
        return 'bg-gray-400'
    }
  }
  
  const getTimeAgo = (date: string) => {
    const now = new Date()
    const taskDate = new Date(date)
    const diffMs = now.getTime() - taskDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 60) {
      return `${diffMins}m`
    } else if (diffHours < 24) {
      return `${diffHours}h`
    } else {
      return `${diffDays}d`
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sistema de Tareas</h1>
          <p className="text-gray-400 mt-1">Gestión y automatización de tareas complejas</p>
        </div>
        
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              {[
                { id: 'all', name: 'Todas' },
                { id: 'pending', name: 'Pendientes' },
                { id: 'in_progress', name: 'En Proceso' },
                { id: 'completed', name: 'Completadas' },
                { id: 'failed', name: 'Fallidas' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as TaskFilter)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filter === filterOption.id
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filterOption.name}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-400">
              {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const taskTypeInfo = getTaskTypeInfo(task.task_type)
          const IconComponent = taskTypeInfo.icon
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Task Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${taskTypeInfo.color} bg-opacity-20 flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">{task.title}</h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Brain className="w-4 h-4" />
                        <span>{task.assigned_model || 'Sin asignar'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{getTimeAgo(task.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="capitalize">{taskTypeInfo.name}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {task.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Progreso</span>
                          <span className="text-xs text-gray-400">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Results */}
                    {task.result && (
                      <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Resultado:</div>
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                          {JSON.stringify(task.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Task Actions */}
                <div className="flex items-center space-x-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => executeTask(task.id)}
                      className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  
                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => pauseTask(task.id)}
                      className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <ListTodo className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No se encontraron tareas
          </h3>
          <p className="text-gray-400">
            {filter === 'all' ? 'Crea tu primera tarea para comenzar' : 'Intenta cambiar los filtros'}
          </p>
        </div>
      )}
      
      {/* New Task Modal */}
      <AnimatePresence>
        {showNewTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNewTaskModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Crear Nueva Tarea</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Describe brevemente la tarea..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Proporciona detalles específicos de lo que necesitas..."
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Tarea
                    </label>
                    <select
                      value={newTask.task_type}
                      onChange={(e) => setNewTask(prev => ({ ...prev, task_type: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {taskTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: parseInt(e.target.value) as TaskPriority }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value={1}>Alta</option>
                      <option value={2}>Media</option>
                      <option value={3}>Baja</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duración Estimada (minutos)
                  </label>
                  <input
                    type="number"
                    value={newTask.estimated_duration}
                    onChange={(e) => setNewTask(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) }))}
                    min="5"
                    max="480"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={createTask}
                  disabled={!newTask.title.trim() || !newTask.description.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Crear Tarea
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
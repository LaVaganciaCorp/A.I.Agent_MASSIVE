import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell,
  User,
  LogOut,
  Settings,
  Activity,
  Zap,
  CircleDot
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAgentStore } from '@/stores/agentStore'

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { user, signOut } = useAuthStore()
  const { systemMetrics, routerActive } = useAgentStore()

  const notifications = [
    { id: 1, message: 'Tarea de codificación completada con éxito', type: 'success', time: '2m' },
    { id: 2, message: 'Plugin "GitHub Integration" actualizado', type: 'info', time: '5m' },
    { id: 3, message: 'Nuevo modelo Claude 3.5 disponible', type: 'info', time: '15m' },
  ]

  return (
    <header className="h-16 bg-gray-900/30 backdrop-blur-sm border-b border-cyan-500/20 flex items-center justify-between px-6">
      {/* Left side - System Status */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${routerActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-300">
            {routerActive ? 'Router Activo' : 'Router Inactivo'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>{systemMetrics.response_time}s</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>${systemMetrics.cost_today.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Right side - User Controls */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">{notifications.length}</span>
            </div>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-cyan-500/20 z-50"
              >
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-medium text-white">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-700/50 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-400' :
                          notification.type === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time} ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
          >
            <User className="w-5 h-5" />
            {user && (
              <span className="text-sm max-w-32 truncate">
                {user.user_metadata?.full_name || user.email}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-cyan-500/20 z-50"
              >
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {user?.user_metadata?.full_name || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Configuración</span>
                  </button>
                  
                  <button 
                    onClick={signOut}
                    className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
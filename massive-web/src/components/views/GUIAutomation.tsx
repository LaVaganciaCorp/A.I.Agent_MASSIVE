import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap,
  Monitor,
  Smartphone,
  Laptop,
  Mouse,
  Keyboard,
  Camera,
  Play,
  Square,
  Settings,
  Target,
  Eye,
  Hand,
  MoreVertical,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface AutomationSession {
  id: string
  name: string
  platform: 'windows' | 'linux' | 'macos' | 'android'
  status: 'idle' | 'recording' | 'executing' | 'completed' | 'failed'
  actions: AutomationAction[]
  created_at: string
  last_run: string
}

interface AutomationAction {
  id: string
  type: 'click' | 'type' | 'scroll' | 'wait' | 'screenshot' | 'swipe'
  target: string
  coordinates?: { x: number; y: number }
  value?: string
  timestamp: string
}

const platformIcons = {
  windows: Monitor,
  linux: Laptop,
  macos: Monitor,
  android: Smartphone
}

const mockSessions: AutomationSession[] = [
  {
    id: '1',
    name: 'Login Automatizado - Portal Web',
    platform: 'windows',
    status: 'completed',
    actions: [
      { id: '1', type: 'click', target: 'username_field', coordinates: { x: 450, y: 300 }, timestamp: '10:30:15' },
      { id: '2', type: 'type', target: 'username_field', value: 'admin@example.com', timestamp: '10:30:16' },
      { id: '3', type: 'click', target: 'password_field', coordinates: { x: 450, y: 350 }, timestamp: '10:30:17' },
      { id: '4', type: 'type', target: 'password_field', value: '********', timestamp: '10:30:18' },
      { id: '5', type: 'click', target: 'login_button', coordinates: { x: 450, y: 400 }, timestamp: '10:30:19' }
    ],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_run: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Instalación de Software Android',
    platform: 'android',
    status: 'executing',
    actions: [
      { id: '1', type: 'click', target: 'play_store_icon', coordinates: { x: 200, y: 400 }, timestamp: '11:15:20' },
      { id: '2', type: 'type', target: 'search_field', value: 'WhatsApp', timestamp: '11:15:25' },
      { id: '3', type: 'click', target: 'install_button', coordinates: { x: 300, y: 500 }, timestamp: '11:15:30' }
    ],
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    last_run: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Extracción de Datos Web',
    platform: 'linux',
    status: 'idle',
    actions: [
      { id: '1', type: 'click', target: 'browser_icon', coordinates: { x: 100, y: 50 }, timestamp: '09:45:10' },
      { id: '2', type: 'type', target: 'address_bar', value: 'https://example.com/data', timestamp: '09:45:15' },
      { id: '3', type: 'wait', target: 'page_load', timestamp: '09:45:20' },
      { id: '4', type: 'click', target: 'export_button', coordinates: { x: 800, y: 300 }, timestamp: '09:45:25' }
    ],
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    last_run: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
]

export function GUIAutomation() {
  const [selectedSession, setSelectedSession] = useState<AutomationSession | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showNewSession, setShowNewSession] = useState(false)
  const [newSessionName, setNewSessionName] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<AutomationSession['platform']>('windows')
  
  const getStatusIcon = (status: AutomationSession['status']) => {
    switch (status) {
      case 'idle':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'recording':
        return <Camera className="w-4 h-4 text-red-400 animate-pulse" />
      case 'executing':
        return <Play className="w-4 h-4 text-blue-400 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }
  
  const getStatusColor = (status: AutomationSession['status']) => {
    switch (status) {
      case 'idle':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
      case 'recording':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'executing':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }
  
  const getActionIcon = (type: AutomationAction['type']) => {
    switch (type) {
      case 'click':
        return <Mouse className="w-4 h-4" />
      case 'type':
        return <Keyboard className="w-4 h-4" />
      case 'scroll':
        return <Mouse className="w-4 h-4" />
      case 'wait':
        return <Clock className="w-4 h-4" />
      case 'screenshot':
        return <Camera className="w-4 h-4" />
      case 'swipe':
        return <Hand className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }
  
  const startRecording = () => {
    setIsRecording(true)
    // Simulate recording start
    setTimeout(() => {
      setIsRecording(false)
    }, 10000)
  }
  
  const executeSession = (sessionId: string) => {
    const session = mockSessions.find(s => s.id === sessionId)
    if (session) {
      session.status = 'executing'
      // Simulate execution
      setTimeout(() => {
        session.status = 'completed'
        session.last_run = new Date().toISOString()
      }, 5000)
    }
  }
  
  const createSession = () => {
    if (!newSessionName.trim()) return
    
    const newSession: AutomationSession = {
      id: Date.now().toString(),
      name: newSessionName,
      platform: selectedPlatform,
      status: 'idle',
      actions: [],
      created_at: new Date().toISOString(),
      last_run: new Date().toISOString()
    }
    
    mockSessions.unshift(newSession)
    setNewSessionName('')
    setShowNewSession(false)
  }
  
  // Autonomía (planner + ejecución)
  const [autoDesc, setAutoDesc] = useState('Abrir una página y hacer scroll')
  const [autoPlatform, setAutoPlatform] = useState<'web' | 'windows' | 'linux' | 'android'>('web')
  const [autoURL, setAutoURL] = useState('https://example.com')
  const [autoPlan, setAutoPlan] = useState<Array<{ step: number; action: string; details: string; confidence: number }>>([])
  const [planning, setPlanning] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [execResult, setExecResult] = useState<any>(null)
  const [screenImage, setScreenImage] = useState<string | null>(null)
  const [detected, setDetected] = useState<any[]>([])
  const [analyzing, setAnalyzing] = useState(false)

  // Native screen capture + overlay
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [capturing, setCapturing] = useState(false)

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCapturing(true)
      }
    } catch (e) {
      alert('Error iniciando captura: ' + (e as Error).message)
    }
  }

  const stopCapture = () => {
    const v = videoRef.current
    const stream = v?.srcObject as MediaStream | null
    stream?.getTracks().forEach(t => t.stop())
    if (v) v.srcObject = null
    setCapturing(false)
  }

  const drawOverlays = (boxes: Array<{ x: number; y: number; width: number; height: number; label?: string }>) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const w = video.videoWidth
    const h = video.videoHeight
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.font = '12px sans-serif'
    ctx.fillStyle = 'rgba(34,197,94,0.3)'
    boxes.forEach(b => {
      ctx.strokeRect(b.x, b.y, b.width, b.height)
      ctx.fillRect(b.x, b.y, b.width, b.height)
      if (b.label) {
        ctx.fillStyle = '#22c55e'
        ctx.fillText(b.label, b.x + 4, b.y - 4)
        ctx.fillStyle = 'rgba(34,197,94,0.3)'
      }
    })
  }

  const snapshot = async (): Promise<string | null> => {
    try {
      const video = videoRef.current
      if (!video) return null
      const tmp = document.createElement('canvas')
      tmp.width = video.videoWidth
      tmp.height = video.videoHeight
      const ctx = tmp.getContext('2d')!
      ctx.drawImage(video, 0, 0)
      return tmp.toDataURL('image/png')
    } catch { return null }
  }

  useEffect(() => {
    if (detected.length) {
      // Normalize to required shape if server returns bounds
      const boxes = detected
        .map((el: any) => el.bounds ? ({ x: el.bounds.x, y: el.bounds.y, width: el.bounds.width, height: el.bounds.height, label: el.type || el.id }) : null)
        .filter(Boolean) as any
      drawOverlays(boxes)
    } else {
      // clear canvas
      const c = canvasRef.current
      const ctx = c?.getContext('2d')
      if (c && ctx) ctx.clearRect(0, 0, c.width, c.height)
    }
  }, [detected])

  const planAutonomy = async () => {
    try {
      setPlanning(true)
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase.functions.invoke('autonomy-planner', {
        body: { description: autoDesc, context: { url: autoURL }, max_steps: 5 }
      })
      if (error) throw error
      setAutoPlan(data?.data?.plan || [])
    } catch (e) {
      alert('Error planificando: ' + (e as Error).message)
    } finally {
      setPlanning(false)
    }
  }

  const executeAutonomy = async () => {
    try {
      setExecuting(true)
      const { supabase } = await import('@/lib/supabase')
      // Mapear plan a acciones simples soportadas por automation-controller
      const sequence: any[] = []
      for (const p of autoPlan) {
        if (p.action === 'perceive' || p.action === 'plan' || p.action === 'validate') {
          sequence.push({ type: 'wait', parameters: { duration: 300 } })
        } else if (p.action === 'act') {
          if (autoPlatform === 'web' && autoURL) {
            sequence.push({ type: 'navigate', parameters: { url: autoURL } })
            sequence.push({ type: 'wait', parameters: { duration: 500 } })
            sequence.push({ type: 'scroll', parameters: { direction: 'down', distance: 200 } })
          } else {
            sequence.push({ type: 'wait', parameters: { duration: 300 } })
          }
        } else if (p.action === 'iterate') {
          sequence.push({ type: 'scroll', parameters: { direction: 'down', distance: 100 } })
        }
      }
      const { data, error } = await supabase.functions.invoke('automation-controller', {
        body: {
          action_type: 'execute_sequence',
          automation_sequence: sequence,
          platform: autoPlatform,
          execution_mode: 'step_by_step',
          validation_level: 'low'
        }
      })
      if (error) throw error
      setExecResult(data)
    } catch (e) {
      alert('Error ejecutando: ' + (e as Error).message)
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Automatización GUI</h1>
          <p className="text-gray-400 mt-1">Control cross-platform con sistema TARS</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <Camera className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
            <span>{isRecording ? 'Grabando...' : 'Grabar Sesión'}</span>
          </button>
          
          <button
            onClick={() => setShowNewSession(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Automatización</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sessions List */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Sesiones de Automatización</span>
          </h2>
          
          <div className="space-y-3">
            {mockSessions.map((session) => {
              const PlatformIcon = platformIcons[session.platform]
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer ${
                    selectedSession?.id === session.id ? 'border-cyan-500/50 bg-cyan-500/5' : ''
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        <PlatformIcon className="w-6 h-6 text-gray-300" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{session.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status)}
                            <span className="ml-1 capitalize">{session.status}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{session.platform}</span>
                          <span>{session.actions.length} acciones</span>
                          <span>Ejecutada {new Date(session.last_run).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          executeSession(session.id)
                        }}
                        disabled={session.status === 'executing'}
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      
                      <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
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
        </div>
        
        {/* Session Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 xl:col-span-1">
          {selectedSession ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Detalles de Sesión</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedSession.status)}`}>
                  {getStatusIcon(selectedSession.status)}
                  <span className="ml-2 capitalize">{selectedSession.status}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Nombre</label>
                  <p className="text-white">{selectedSession.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-1">Plataforma</label>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const PlatformIcon = platformIcons[selectedSession.platform]
                      return <PlatformIcon className="w-4 h-4 text-gray-300" />
                    })()} 
                    <span className="text-white capitalize">{selectedSession.platform}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Acciones ({selectedSession.actions.length})</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedSession.actions.map((action, index) => (
                      <div key={action.id} className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded-lg">
                        <span className="text-xs text-gray-500 w-6">{index + 1}</span>
                        
                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                          {getActionIcon(action.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white capitalize">{action.type}</div>
                          <div className="text-xs text-gray-400 truncate">{action.target}</div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {action.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => executeSession(selectedSession.id)}
                  disabled={selectedSession.status === 'executing'}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Ejecutar</span>
                </button>
                
                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">Selecciona una sesión</h3>
              <p>Haz clic en cualquier automatización para ver los detalles</p>
            </div>
          )}
        </div>

        {/* Autonomy Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 xl:col-span-1">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4"><Target className="w-5 h-5"/> Autonomía (Planner + Ejecución)</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Descripción</label>
                <input value={autoDesc} onChange={e=>setAutoDesc(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="Describe el objetivo (ej. abrir página y hacer scroll)" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Plataforma</label>
                <select value={autoPlatform} onChange={e=>setAutoPlatform(e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                  <option value="web">web</option>
                  <option value="windows">windows</option>
                  <option value="linux">linux</option>
                  <option value="android">android</option>
                </select>
              </div>
              {autoPlatform === 'web' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">URL (para web)</label>
                  <input value={autoURL} onChange={e=>setAutoURL(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" placeholder="https://example.com" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={planAutonomy} disabled={planning} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50">{planning ? 'Planificando...' : 'Planificar'}</button>
              <button onClick={executeAutonomy} disabled={executing || autoPlan.length===0} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded disabled:opacity-50">{executing ? 'Ejecutando...' : 'Ejecutar Plan'}</button>
            </div>

            {/* Screen Analysis */}
            <div className="space-y-3 pt-2 border-t border-gray-700/50">
              <div className="text-sm text-gray-300">Análisis de Pantalla (grounding)</div>

              {/* Native capture controls */}
              <div className="flex items-center gap-2">
                {!capturing ? (
                  <button onClick={startCapture} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded">Iniciar Captura</button>
                ) : (
                  <>
                    <button onClick={stopCapture} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded">Detener</button>
                    <button onClick={async ()=>{
                      const shot = await snapshot()
                      if(!shot){ alert('No se pudo capturar.'); return }
                      setScreenImage(shot)
                    }} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded">Tomar Captura</button>
                    <button onClick={async ()=>{
                      const shot = await snapshot()
                      if(!shot){ alert('No se pudo capturar.'); return }
                      try{
                        setAnalyzing(true)
                        const { supabase } = await import('@/lib/supabase')
                        const { data, error } = await supabase.functions.invoke('screen-capture-analysis',{
                          body:{ screenshot_data: shot, analysis_type:'full', platform: autoPlatform }
                        })
                        if(error) throw error
                        setDetected(data?.data?.detected_elements || [])
                      }catch(e){ alert('Error analizando: '+(e as Error).message) }
                      finally{ setAnalyzing(false) }
                    }} disabled={analyzing} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded disabled:opacity-50">{analyzing?'Analizando...':'Analizar Captura'}</button>
                  </>
                )}
              </div>

              {/* Live preview with overlays */}
              <div className="relative w-full bg-black/30 border border-gray-700 rounded overflow-hidden">
                <video ref={videoRef} className="w-full max-h-72 object-contain" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
              </div>

              {/* Fallback: upload image */}
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={async (e)=>{
                  const file = e.target.files?.[0];
                  if(!file) return;
                  const reader = new FileReader();
                  reader.onload = ()=> setScreenImage(reader.result as string)
                  reader.readAsDataURL(file)
                }} className="text-xs text-gray-300" />
                <button onClick={async ()=>{
                  if(!screenImage){alert('Sube o toma una captura primero.'); return}
                  try{
                    setAnalyzing(true)
                    const { supabase } = await import('@/lib/supabase')
                    const { data, error } = await supabase.functions.invoke('screen-capture-analysis',{
                      body:{ screenshot_data: screenImage, analysis_type:'full', platform: autoPlatform }
                    })
                    if(error) throw error
                    setDetected(data?.data?.detected_elements || [])
                  }catch(e){ alert('Error analizando: '+(e as Error).message) }
                  finally{ setAnalyzing(false) }
                }} disabled={analyzing} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded disabled:opacity-50">{analyzing?'Analizando...':'Analizar (archivo)'}</button>
              </div>

              {screenImage && (
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">Captura ({detected.length} elementos detectados)</div>
                  <img src={screenImage} alt="captura" className="max-h-40 rounded border border-gray-700" />
                </div>
              )}
              {detected.length>0 && (
                <div className="max-h-36 overflow-auto space-y-1">
                  {detected.map((el:any,i:number)=>(
                    <div key={i} className="text-xs text-gray-300 flex items-center justify-between p-2 bg-gray-700/40 rounded border border-gray-700/50">
                      <div>
                        <div className="font-medium">{el.type} • {el.id||'element'}</div>
                        <div className="text-gray-400">conf: {Math.round((el.confidence||0)*100)}%</div>
                      </div>
                      {el.bounds && <div className="text-gray-400">[{el.bounds.x},{el.bounds.y}] {el.bounds.width}x{el.bounds.height}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Plan</label>
              {autoPlan.length === 0 ? (
                <div className="text-sm text-gray-400">Sin plan aún. Presiona "Planificar".</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {autoPlan.map(s => (
                    <div key={s.step} className="p-2 bg-gray-700/50 rounded border border-gray-600/50 flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm">{s.step}. {s.action}</div>
                        <div className="text-xs text-gray-400">{s.details}</div>
                      </div>
                      <div className="text-xs text-gray-300">conf: {Math.round((s.confidence||0)*100)}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {execResult && (
              <div className="mt-2 p-3 bg-gray-700/40 rounded border border-gray-600/40">
                <div className="text-sm text-white font-medium mb-2">Resultado de ejecución</div>
                <pre className="text-xs text-gray-200 whitespace-pre-wrap break-all">{JSON.stringify(execResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Session Modal */}
      {showNewSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowNewSession(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Nueva Automatización</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Sesión
                </label>
                <input
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Ej: Login automático en aplicación"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plataforma
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(platformIcons).map(([platform, Icon]) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform as AutomationSession['platform'])}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                        selectedPlatform === platform
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="capitalize">{platform}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewSession(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createSession}
                disabled={!newSessionName.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                Crear
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
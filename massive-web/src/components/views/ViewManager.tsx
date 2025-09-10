import { useAgentStore } from '@/stores/agentStore'
import { Dashboard } from './Dashboard'
import { MultiLLMRouter } from './MultiLLMRouter'
import { CodingEngine } from './CodingEngine'
import { TaskManager } from './TaskManager'
import { PluginManager } from './PluginManager'
import { VectorMemoryViewer } from './VectorMemoryViewer'
import { GUIAutomation } from './GUIAutomation'
import { Settings } from './Settings'

export function ViewManager() {
  const { currentView } = useAgentStore()

  switch (currentView) {
    case 'dashboard':
      return <Dashboard />
    case 'router':
      return <MultiLLMRouter />
    case 'coding':
      return <CodingEngine />
    case 'tasks':
      return <TaskManager />
    case 'plugins':
      return <PluginManager />
    case 'memory':
      return <VectorMemoryViewer />
    case 'automation':
      return <GUIAutomation />
    case 'settings':
      return <Settings />
    default:
      return <Dashboard />
  }
}
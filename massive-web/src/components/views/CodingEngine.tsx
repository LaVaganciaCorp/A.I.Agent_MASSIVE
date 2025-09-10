import { useState } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { 
  Code,
  Play,
  Square,
  Terminal,
  FileText,
  GitBranch,
  Bug,
  Zap,
  Save,
  Download,
  Upload,
  Settings,
  Cpu,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { useAgentStore } from '@/stores/agentStore'

type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go' | 'rust'
type CodeTemplate = {
  name: string
  description: string
  language: Language
  code: string
  icon: React.ComponentType<{ className?: string }>
}

const codeTemplates: CodeTemplate[] = [
  {
    name: 'API REST Node.js',
    description: 'Servidor Express con endpoints CRUD',
    language: 'javascript',
    icon: Zap,
    code: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Rutas principales
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  // Obtener usuarios
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  // Crear usuario
  const { name, email } = req.body;
  res.status(201).json({ id: Date.now(), name, email });
});

app.listen(PORT, () => {
  console.log(\`Servidor ejecutándose en puerto \${PORT}\`);
});`
  },
  {
    name: 'Componente React',
    description: 'Componente React con TypeScript y hooks',
    language: 'typescript',
    icon: Code,
    code: `import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface UserListProps {
  users: User[];
  onUserSelect?: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, filter]);
  
  return (
    <div className="user-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={\`user-card \${user.active ? 'active' : 'inactive'}\`}
            onClick={() => onUserSelect?.(user)}
          >
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className="status">
              {user.active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;`
  },
  {
    name: 'Script Python ML',
    description: 'Análisis de datos con pandas y scikit-learn',
    language: 'python',
    icon: Cpu,
    code: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

class DataAnalyzer:
    def __init__(self, data_path: str):
        self.data_path = data_path
        self.df = None
        self.model = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
    
    def load_data(self):
        """Cargar datos desde archivo CSV"""
        try:
            self.df = pd.read_csv(self.data_path)
            print(f"Datos cargados exitosamente: {self.df.shape}")
            return True
        except Exception as e:
            print(f"Error al cargar datos: {e}")
            return False
    
    def explore_data(self):
        """Explorar y visualizar los datos"""
        if self.df is None:
            print("Primero carga los datos")
            return
        
        print("\n=== INFORMACIÓN GENERAL ===")
        print(self.df.info())
        
        print("\n=== ESTADÍSTICAS DESCRIPTIVAS ===")
        print(self.df.describe())
        
        print("\n=== VALORES FALTANTES ===")
        print(self.df.isnull().sum())
        
        # Visualizaciones
        plt.figure(figsize=(12, 8))
        
        # Matriz de correlación
        plt.subplot(2, 2, 1)
        sns.heatmap(self.df.corr(), annot=True, cmap='coolwarm')
        plt.title('Matriz de Correlación')
        
        plt.tight_layout()
        plt.show()
    
    def prepare_features(self, target_column: str, feature_columns: list = None):
        """Preparar características para entrenamiento"""
        if feature_columns is None:
            feature_columns = [col for col in self.df.columns if col != target_column]
        
        X = self.df[feature_columns]
        y = self.df[target_column]
        
        # Dividir datos
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Datos preparados: {len(feature_columns)} características")
        print(f"Entrenamiento: {self.X_train.shape[0]} muestras")
        print(f"Prueba: {self.X_test.shape[0]} muestras")
    
    def train_model(self):
        """Entrenar modelo Random Forest"""
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=10
        )
        
        self.model.fit(self.X_train, self.y_train)
        print("Modelo entrenado exitosamente")
    
    def evaluate_model(self):
        """Evaluar rendimiento del modelo"""
        if self.model is None:
            print("Primero entrena el modelo")
            return
        
        # Predicciones
        y_pred = self.model.predict(self.X_test)
        
        # Métricas
        accuracy = accuracy_score(self.y_test, y_pred)
        print(f"\nPrecisión: {accuracy:.4f}")
        
        print("\nReporte de clasificación:")
        print(classification_report(self.y_test, y_pred))
        
        # Importancia de características
        feature_importance = pd.DataFrame({
            'feature': self.X_train.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nImportancia de características:")
        print(feature_importance.head(10))
        
        return accuracy

# Ejemplo de uso
if __name__ == "__main__":
    analyzer = DataAnalyzer("datos.csv")
    
    if analyzer.load_data():
        analyzer.explore_data()
        analyzer.prepare_features("target_column")
        analyzer.train_model()
        accuracy = analyzer.evaluate_model()
        print(f"\nPrecisión final del modelo: {accuracy:.2%}")`
  }
]

export function CodingEngine() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('typescript')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null)
  const [codeAnalysis, setCodeAnalysis] = useState<any>(null)
  const [scMode, setScMode] = useState<'brainstorming'|'orchestration'|'task'|'introspection'>('orchestration')
  const [opType, setOpType] = useState<'generate'|'analyze'|'edit'|'debug'|'refactor'|'explain'>('analyze')
  
  const { currentSelection, addTask } = useAgentStore()
  
  const orchestrate = async () => {
    try {
      setIsAnalyzing(true)
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase.functions.invoke('code-orchestrator', {
        body: { operation_type: opType, code_content: code, language: selectedLanguage, mode: scMode, prompt: 'optimize code' }
      })
      if (error) throw error
      setOutput(JSON.stringify(data?.data || data, null, 2))
    } catch (e) {
      setOutput('Error: ' + (e as Error).message)
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  // Mock code execution
  const runCode = async () => {
    setIsRunning(true)
    setOutput('Iniciando ejecución...\n')
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockOutput = `Éxito: Código ejecutado correctamente
Tiempo de ejecución: 1.23s
Memoria utilizada: 45MB

Resultado:
{
  "status": "success",
  "data": {
    "processed_items": 1250,
    "execution_time": "1.23s",
    "memory_peak": "45MB"
  }
}`
    
    setOutput(mockOutput)
    setIsRunning(false)
  }
  
  // Mock code analysis
  const analyzeCode = async () => {
    setIsAnalyzing(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const analysis = {
      complexity: 6,
      maintainability: 85,
      security_score: 92,
      performance_score: 78,
      issues: [
        { type: 'warning', message: 'Considerar usar const en lugar de let en línea 15', line: 15 },
        { type: 'info', message: 'Se puede optimizar el loop en línea 28', line: 28 }
      ],
      suggestions: [
        'Implementar manejo de errores más robusto',
        'Considerar usar TypeScript para mejor tipado',
        'Añadir comentarios de documentación'
      ]
    }
    
    setCodeAnalysis(analysis)
    setIsAnalyzing(false)
  }
  
  const loadTemplate = (template: CodeTemplate) => {
    setCode(template.code)
    setSelectedLanguage(template.language)
    setSelectedTemplate(template)
    setShowTemplates(false)
  }
  
  const generateCode = async () => {
    const task = {
      id: `task-${Date.now()}`,
      user_id: 'current-user',
      title: 'Generación de Código con IA',
      description: 'Generar código basado en descripción natural',
      task_type: 'coding',
      status: 'in_progress' as const,
      priority: 2,
      assigned_model: currentSelection?.selected_model.name,
      progress: 0,
      metadata: { language: selectedLanguage },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    addTask(task)
    
    // Simulate code generation
    setOutput('Generando código con ' + (currentSelection?.selected_model.name || 'IA') + '...\n')
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Motor de Codificación</h1>
          <p className="text-gray-400 mt-1">Desarrollo avanzado de código con IA</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center space-x-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Templates</span>
          </button>
          
          <button
            onClick={generateCode}
            disabled={!currentSelection}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            <span>Generar con IA</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Editor Controls */}
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-700/50">
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
              
              <div className="h-6 w-px bg-gray-600" />

              <select value={opType} onChange={e=>setOpType(e.target.value as any)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                <option value="analyze">Analyze</option>
                <option value="generate">Generate</option>
                <option value="edit">Edit</option>
                <option value="debug">Debug</option>
                <option value="refactor">Refactor</option>
                <option value="explain">Explain</option>
                <option disabled>────────── SuperClaude ──────────</option>
                <option value="sc:analyze">sc:analyze</option>
                <option value="sc:generate">sc:generate</option>
                <option value="sc:edit">sc:edit</option>
                <option value="sc:debug">sc:debug</option>
                <option value="sc:refactor">sc:refactor</option>
                <option value="sc:explain">sc:explain</option>
              </select>
              <select value={scMode} onChange={e=>setScMode(e.target.value as any)} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                <option value="orchestration">Orchestration</option>
                <option value="brainstorming">Brainstorming</option>
                <option value="task">Task</option>
                <option value="introspection">Introspection</option>
              </select>
              
              <button
                onClick={runCode}
                disabled={isRunning || !code.trim()}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ejecutando</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Ejecutar</span>
                  </>
                )}
              </button>
              
              <button
                onClick={analyzeCode}
                disabled={isAnalyzing || !code.trim()}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analizando</span>
                  </>
                ) : (
                  <>
                    <Bug className="w-3 h-3" />
                    <span>Analizar</span>
                  </>
                )}
              </button>

              <button onClick={orchestrate} disabled={isAnalyzing || !code.trim()} className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors">
                <Zap className="w-3 h-3" />
                <span>Orquestar (SuperClaude)</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Save className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Download className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Upload className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Editor */}
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700/50" style={{ height: '500px' }}>
            <Editor
              height="100%"
              language={selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Consolas, monospace',
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: { enabled: true },
                bracketPairColorization: { enabled: true },
                guides: { indentation: true },
              }}
            />
          </div>
          
          {/* Output/Console */}
          <div className="bg-gray-900 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Consola de Salida</span>
              </div>
              <button 
                onClick={() => setOutput('')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Limpiar
              </button>
            </div>
            <div className="p-4 h-48 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {output || 'Ejecuta el código para ver la salida...'}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Templates Panel */}
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Templates de Código</h3>
              <div className="space-y-2">
                {codeTemplates.map((template, index) => {
                  const IconComponent = template.icon
                  return (
                    <button
                      key={index}
                      onClick={() => loadTemplate(template)}
                      className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{template.name}</div>
                          <div className="text-xs text-gray-400 capitalize">{template.language}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{template.description}</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
          
          {/* Current Model */}
          {currentSelection && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-3">Modelo Activo</h3>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">
                    {currentSelection.selected_model.name}
                  </div>
                  <div className="text-xs text-gray-400">{currentSelection.selected_model.provider}</div>
                </div>
              </div>
              <div className="text-xs text-gray-300">
                Capacidad de codificación: 
                <span className="text-cyan-400 font-medium ml-1">
                  {currentSelection.selected_model.capabilities.coding}%
                </span>
              </div>
            </div>
          )}
          
          {/* Code Analysis */}
          {codeAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50"
            >
              <h3 className="text-sm font-semibold text-white mb-3">Análisis de Código</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400">Complejidad</div>
                    <div className="text-white font-medium">{codeAnalysis.complexity}/10</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Mantenibilidad</div>
                    <div className="text-green-400 font-medium">{codeAnalysis.maintainability}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Seguridad</div>
                    <div className="text-green-400 font-medium">{codeAnalysis.security_score}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Rendimiento</div>
                    <div className="text-yellow-400 font-medium">{codeAnalysis.performance_score}%</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs mb-2">Problemas Detectados:</div>
                  <div className="space-y-1">
                    {codeAnalysis.issues.map((issue: any, index: number) => (
                      <div key={index} className="flex items-start space-x-2 text-xs">
                        {issue.type === 'warning' ? (
                          <AlertCircle className="w-3 h-3 text-yellow-400 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-blue-400 mt-0.5" />
                        )}
                        <div>
                          <div className="text-gray-300">{issue.message}</div>
                          <div className="text-gray-500">Línea {issue.line}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-3">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-left transition-colors">
                <GitBranch className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Git Commit</span>
              </button>
              
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-left transition-colors">
                <Bug className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Debug</span>
              </button>
              
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-left transition-colors">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Optimizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
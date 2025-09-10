# Super Agente Multimodal y Modular - Guía de Instalación Completa

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación de Prerrequisitos](#instalación-de-prerrequisitos)
4. [Configuración de APIs y Credenciales](#configuración-de-apis-y-credenciales)
5. [Configuración de Supabase](#configuración-de-supabase)
6. [Instalación del Super Agente](#instalación-del-super-agente)
7. [Configuración Final](#configuración-final)
8. [Troubleshooting](#troubleshooting)
9. [Primeros Pasos](#primeros-pasos)
10. [Casos de Uso](#casos-de-uso)

## 🚀 Introducción

El **Super Agente Multimodal y Modular** es una plataforma avanzada de IA que combina las mejores características de tecnologías como Anything LLM, Agent TARS, Claude Code, Llama Factory y protocolos MCP. Esta guía te llevará paso a paso através del proceso completo de instalación y configuración.

### Componentes Principales
- **Multi-LLM Router**: Sistema inteligente de selección de modelos
- **Motor de Codificación Avanzado**: IDE con IA integrada
- **Sistema de Autonomía GUI**: Automatización cross-platform inspirado en TARS
- **Sistema de Plugins Modulares**: Marketplace extensible
- **Vector Memory Distribuida**: Memoria inteligente con búsqueda semántica
- **Interfaz Web Moderna**: Dashboard futurista con múltiples vistas
- **Backend Supabase**: Autenticación y base de datos en tiempo real

---

## 💻 Requisitos del Sistema

### Requisitos Mínimos

#### Windows 10/11
- **OS**: Windows 10 versión 1903 o superior / Windows 11
- **RAM**: 8 GB (16 GB recomendado)
- **Almacenamiento**: 10 GB de espacio libre
- **CPU**: Procesador de 64-bit con soporte para virtualización
- **GPU**: Opcional, pero recomendado para procesamiento de IA local

#### Linux (Ubuntu 20.04+ / Debian 11+ / CentOS 8+ / Fedora 34+)
- **OS**: Distribución moderna con systemd
- **RAM**: 8 GB (16 GB recomendado)
- **Almacenamiento**: 10 GB de espacio libre
- **CPU**: Procesador de 64-bit
- **GPU**: Opcional, NVIDIA con CUDA 11.8+ para modelos locales

#### macOS
- **OS**: macOS 12 Monterey o superior
- **RAM**: 8 GB (16 GB recomendado)
- **Almacenamiento**: 10 GB de espacio libre
- **CPU**: Intel x64 o Apple Silicon (M1/M2/M3)

### Requisitos de Red
- **Conexión a Internet**: Estable, mínimo 10 Mbps
- **Puertos**: Acceso a puertos 3000-3003, 9222 (Chrome Debug), 5432 (PostgreSQL local opcional)

---

## 🛠 Instalación de Prerrequisitos

### 1. Node.js y pnpm

#### Windows
1. Descargar Node.js LTS desde [nodejs.org](https://nodejs.org/)
2. Ejecutar el instalador y seguir las instrucciones
3. Abrir PowerShell como administrador y ejecutar:
```powershell
npm install -g pnpm@latest
```

#### Linux (Ubuntu/Debian)
```bash
# Instalar Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm@latest
```

#### macOS
```bash
# Usando Homebrew
brew install node pnpm

# O usando instalador oficial
curl -fsSL https://nodejs.org/dist/v20.9.0/node-v20.9.0.pkg -o node.pkg
sudo installer -pkg node.pkg -target /
npm install -g pnpm@latest
```

### 2. Git

#### Windows
- Descargar desde [git-scm.com](https://git-scm.com/download/win)
- Instalar con configuración por defecto

#### Linux
```bash
sudo apt update
sudo apt install git
```

#### macOS
```bash
# Usando Homebrew
brew install git

# O usando Xcode Command Line Tools
xcode-select --install
```

### 3. Python 3.9+ (para componentes de automatización)

#### Windows
```powershell
# Usando winget
winget install Python.Python.3.11

# O descargar desde python.org
```

#### Linux
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

#### macOS
```bash
brew install python@3.11
```

### 4. Docker (Opcional pero recomendado)

#### Windows
- Descargar Docker Desktop desde [docker.com](https://www.docker.com/products/docker-desktop/)
- Instalar y habilitar WSL 2 backend

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### macOS
- Descargar Docker Desktop para Mac
- Instalar y configurar recursos recomendados: 4 CPUs, 8 GB RAM

---

## 🔑 Configuración de APIs y Credenciales

### 1. OpenAI API Key
1. Ir a [platform.openai.com](https://platform.openai.com/)
2. Crear cuenta o iniciar sesión
3. Navegar a **API Keys**
4. Crear nueva clave secreta
5. **Importante**: Copiar y guardar la clave (no se vuelve a mostrar)
6. Configurar billing para usar GPT-4

### 2. Anthropic (Claude) API Key
1. Ir a [console.anthropic.com](https://console.anthropic.com/)
2. Crear cuenta o iniciar sesión
3. Generar API Key en la sección **API Keys**
4. Configurar plan de pago (required para Claude 3.5)

### 3. Google Gemini API Key
1. Ir a [makersuite.google.com](https://makersuite.google.com/)
2. Crear proyecto en Google Cloud Console si no tienes uno
3. Habilitar Gemini API
4. Crear credenciales (API Key)

### 4. APIs Adicionales Opcionales

#### GitHub (para integración de código)
- Generar Personal Access Token en GitHub Settings > Developer settings

#### Telegram (para bot integration)
- Crear bot con @BotFather en Telegram
- Obtener bot token

#### AWS/Google Cloud/Azure (para servicios cloud)
- Configurar credenciales según el proveedor

---

## 🗄 Configuración de Supabase

### Opción 1: Supabase Cloud (Recomendado)

1. **Crear proyecto Supabase**:
   - Ir a [supabase.com](https://supabase.com/)
   - Crear cuenta gratuita
   - Crear nuevo proyecto
   - Anotar la URL del proyecto y la `anon key`

2. **Obtener credenciales**:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **Anon Key**: Clave pública para cliente
   - **Service Role Key**: Clave privada para server (Admin)

3. **Configurar autenticación**:
   - En Supabase Dashboard > Authentication
   - Habilitar **Email** provider
   - Configurar redirect URLs:
     - `http://localhost:3000`
     - `http://localhost:3001` 
     - `http://localhost:3002`

### Opción 2: Supabase Local (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto local
supabase init
supabase start

# Aplicar migraciones
supabase db push
```

### 3. Configurar Storage

1. En Supabase Dashboard > Storage
2. Crear bucket `user-uploads` (público)
3. Configurar políticas RLS:

```sql
-- Política para lectura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

-- Política para subida autenticada
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'user-uploads');
```

---

## 📦 Instalación del Super Agente

### 1. Clonar el Repositorio

```bash
# Clonar repositorio principal
git clone https://github.com/tu-org/super-agente-multimodal.git
cd super-agente-multimodal

# Verificar estructura del proyecto
ls -la
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Copiar template de ejemplo
cp .env.example .env

# Editar con tu editor favorito
nano .env  # o code .env, vim .env, etc.
```

Contenido del archivo `.env`:

```env
# ========================================
# CONFIGURACIÓN PRINCIPAL DEL SUPER AGENTE
# ========================================

# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# LLM API Keys
OPENAI_API_KEY=sk-tu_openai_key_aqui
ANTHROPIC_API_KEY=sk-ant-tu_anthropic_key_aqui
GOOGLE_AI_API_KEY=tu_google_gemini_key_aqui

# Local LLM Configuration (Opcional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODELS=llama3.1,mistral,codellama

# Browser Automation
CHROME_DEBUG_PORT=9222
BROWSER_HEADLESS=false
BROWSER_USER_DATA_DIR=./workspace/browser/user_data

# Plugin System
PLUGIN_REGISTRY_URL=https://registry.super-agente.com
ENABLE_PLUGIN_SANDBOX=true

# Development
NODE_ENV=development
LOG_LEVEL=info
DEBUG_MODE=true

# Security (cambiar en producción)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
ENCRYPT_KEY=tu_encrypt_key_de_32_caracteres
```

### 3. Instalar Dependencias

```bash
# Instalar dependencias del proyecto principal
pnpm install

# Instalar dependencias de cada subproyecto
cd automation-gui && pnpm install && cd ..
cd super-agente-multimodal && pnpm install && cd ..
cd super-agente-web && pnpm install && cd ..

# Instalar dependencias Python para browser automation
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**Crear `requirements.txt` si no existe**:
```txt
playwright==1.40.0
asyncio-mqtt==0.13.0
python-dotenv==1.0.0
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
```

### 4. Instalar Playwright Browsers

```bash
# Instalar browsers para automatización
playwright install chromium
playwright install firefox
playwright install webkit

# En sistemas Linux, también instalar dependencias del sistema
# Ubuntu/Debian:
sudo playwright install-deps
```

### 5. Configurar Base de Datos

```bash
# Aplicar migraciones de Supabase
cd supabase
supabase db push

# O ejecutar scripts SQL manualmente si prefieres
# psql -h db.tu-proyecto.supabase.co -p 5432 -U postgres -d postgres -f migrations/init.sql
```

---

## ⚙️ Configuración Final

### 1. Configurar Funciones Edge

```bash
# Desplegar funciones edge a Supabase
cd supabase/functions

# Desplegar todas las funciones
supabase functions deploy task-handler
supabase functions deploy llm-router
supabase functions deploy code-engine
supabase functions deploy plugin-manager
supabase functions deploy automation-controller
supabase functions deploy screen-capture-analysis
supabase functions deploy template-manager
```

### 2. Configurar Secrets

```bash
# Configurar secrets en Supabase para funciones edge
supabase secrets set OPENAI_API_KEY=tu_openai_key
supabase secrets set ANTHROPIC_API_KEY=tu_anthropic_key
supabase secrets set GOOGLE_AI_API_KEY=tu_google_key
```

### 3. Construir Proyectos

```bash
# Construir automation-gui
cd automation-gui
pnpm run build
cd ..

# Construir super-agente-multimodal
cd super-agente-multimodal
pnpm run build
cd ..

# Construir super-agente-web
cd super-agente-web
pnpm run build
cd ..
```

### 4. Verificar Instalación

```bash
# Ejecutar tests de instalación
npm run test:installation

# Verificar servicios
npm run health-check
```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error: "pnpm command not found"
```bash
# Solución: Reinstalar pnpm
npm uninstall -g pnpm
npm install -g pnpm@latest

# Verificar PATH en Windows
echo $env:PATH  # PowerShell
echo %PATH%     # CMD
```

#### 2. Error: "Module not found" en React
```bash
# Limpiar cache y reinstalar (Linux/macOS)
cd automation-gui  # o el proyecto que falla
pnpm store prune
rm -rf node_modules .pnpm-store pnpm-lock.yaml
pnpm install
```

```powershell
# Limpiar cache y reinstalar (Windows PowerShell)
cd automation-gui
pnpm store prune
rimraf node_modules .pnpm-store pnpm-lock.yaml
pnpm install
```

#### 3. Error: "Supabase connection failed"
- Verificar URL y keys en `.env`
- Comprobar que el proyecto Supabase esté activo
- Verificar conectividad de red

```bash
# Test de conectividad
curl -I https://tu-proyecto.supabase.co/rest/v1/
```

#### 4. Error: "Chrome/Chromium not found"
```bash
# Reinstalar Playwright browsers
playwright install chromium --force

# En Linux, instalar dependencias del sistema
sudo apt update
sudo apt install -y libnss3 libnspr4 libxss1 libasound2 libxrandr2 libgconf-2-4 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6
```

#### 5. Error de Puerto ya en uso
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000  # Windows
lsof -ti:3000 | xargs kill -9  # Linux/Mac

# O cambiar puerto en package.json
"dev": "vite --port 3001"
```

#### 6. Error: "OpenAI API rate limit"
- Verificar límites de API en OpenAI dashboard
- Configurar retry logic en `.env`:
```env
API_RETRY_COUNT=3
API_RETRY_DELAY=1000
```

#### 7. Problemas de Memoria/Performance
```bash
# Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=8192"

# En Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=8192"
```

### Logs y Debugging

#### Habilitar Logs Detallados
```env
# En .env
LOG_LEVEL=debug
DEBUG=*
VITE_DEBUG=true
```

#### Ubicación de Logs
- **Browser logs**: `./workspace/browser/logs/`
- **Application logs**: `./logs/app.log`
- **Supabase logs**: Dashboard > Logs
- **Chrome debug logs**: Puerto 9222

### Herramientas de Diagnóstico

```bash
# Script de diagnóstico completo
npm run diagnose

# Verificar versiones
node --version
npm --version
pnpm --version
python --version
```

---

## 🚀 Primeros Pasos

### 1. Iniciar el Sistema

```bash
# Terminal 1: Iniciar automation-gui
cd automation-gui
pnpm run dev

# Terminal 2: Iniciar super-agente-multimodal  
cd super-agente-multimodal
pnpm run dev

# Terminal 3: Iniciar browser automation (opcional)
cd browser
python global_browser.py

# Terminal 4: Monitor de logs
tail -f logs/app.log
```

### 2. Acceder a las Interfaces

- **Automation GUI**: http://localhost:3000
- **Super Agente Multimodal**: http://localhost:3001
- **Super Agente Web**: http://localhost:3002
- **Chrome DevTools**: http://localhost:9222

### 3. Crear Primera Cuenta

1. Abrir http://localhost:3001
2. Click en "Sign Up"
3. Crear cuenta con email/password
4. Verificar email si está configurado
5. Completar perfil inicial

### 4. Configurar Primer Modelo

1. Ir a **Settings** > **LLM Configuration**
2. Activar modelos disponibles (GPT-4, Claude, Gemini)
3. Configurar límites y preferencias
4. Hacer test de conexión

### 5. Probar Funcionalidades Básicas

#### Multi-LLM Router
1. Ir a **LLM Router**
2. Escribir prompt: "Explica qué es la inteligencia artificial"
3. Observar selección automática de modelo
4. Revisar métricas de rendimiento

#### Motor de Codificación
1. Ir a **Code Engine**
2. Seleccionar template "React Component"
3. Describir componente deseado
4. Generar y revisar código

#### Sistema de Tareas
1. Ir a **Tasks**
2. Crear nueva tarea: "Analizar archivo CSV y generar resumen"
3. Observar descomposición automática
4. Ejecutar paso a paso

---

## 📋 Casos de Uso

### 1. Desarrollo de Software

#### Escenario: Crear API REST completa
```
Tarea: "Crear una API REST para gestión de usuarios con autenticación JWT, CRUD completo y validación de datos usando Node.js y Express"

Proceso del Super Agente:
1. Descomposición automática en subtareas
2. Selección de GPT-4 para arquitectura inicial
3. Generación de estructura de proyecto
4. Implementación de endpoints con validación
5. Creación de tests unitarios
6. Documentación automática con Swagger
```

**Comandos ejemplo**:
```bash
# En Code Engine
Task: "Build user management API"
Language: "JavaScript/Node.js" 
Framework: "Express"
Database: "PostgreSQL"
Features: ["JWT Auth", "CRUD", "Validation", "Tests"]
```

### 2. Automatización GUI

#### Escenario: Automatizar proceso de facturación
```
Tarea: "Automatizar la creación de facturas mensuales extrayendo datos de sistema ERP y generando PDFs"

Proceso del Super Agente:
1. Screen capture del sistema ERP
2. Análisis de UI con modelo de visión
3. Navegación automática por menús
4. Extracción de datos de tablas
5. Generación de facturas en PDF
6. Envío por email automático
```

**Configuración ejemplo**:
```javascript
// En GUI Automation
const automationTask = {
  name: "Monthly Invoice Generation",
  steps: [
    { action: "screenshot", target: "desktop" },
    { action: "click", coordinates: [100, 200] },
    { action: "type", text: "invoice_data" },
    { action: "extract_table", selector: "#data-table" },
    { action: "generate_pdf", template: "invoice.html" }
  ]
};
```

### 3. Análisis de Datos

#### Escenario: Dashboard de análisis de ventas
```
Tarea: "Analizar datos de ventas de los últimos 6 meses y crear dashboard interactivo con predicciones"

Proceso del Super Agente:
1. Conexión automática a base de datos
2. Exploración y limpieza de datos
3. Análisis estadístico con Python
4. Generación de visualizaciones
5. Creación de modelo predictivo
6. Deploy de dashboard en React
```

### 4. Gestión de Contenido

#### Escenario: Creación de contenido multimodal
```
Tarea: "Crear serie de tutoriales en video sobre React con scripts, slides y código de ejemplo"

Proceso del Super Agente:
1. Generación de outline del curso
2. Creación de scripts para cada video
3. Generación de slides con IA
4. Desarrollo de código de ejemplo
5. Creación de ejercicios prácticos
6. Compilación final del material
```

### 5. Integración de Sistemas

#### Escenario: Sincronización CRM-ERP
```
Tarea: "Sincronizar automáticamente datos entre Salesforce y SAP cada hora"

Proceso del Super Agente:
1. Configuración de conectores API
2. Mapeo de campos entre sistemas
3. Implementación de reglas de negocio
4. Sistema de logs y monitoreo
5. Manejo de errores y rollback
6. Notificaciones de estado
```

### 6. Investigación y Análisis

#### Escenario: Análisis competitivo automatizado
```
Tarea: "Realizar análisis competitivo semanal de 10 empresas incluyendo precios, features y reviews"

Proceso del Super Agente:
1. Web scraping de sitios competidores
2. Extracción de datos de precios
3. Análisis de sentiment de reviews
4. Comparación de features
5. Generación de reporte ejecutivo
6. Envío automático a stakeholders
```

### Plantillas de Tareas Predefinidas

El sistema incluye plantillas para casos comunes:

```yaml
# automation-templates.yaml
templates:
  web_scraping:
    description: "Extraer datos de sitios web"
    steps: ["navigate", "extract", "process", "store"]
    
  code_generation:
    description: "Generar código desde especificaciones"
    steps: ["analyze", "design", "implement", "test"]
    
  data_analysis:
    description: "Análisis completo de datasets"
    steps: ["load", "clean", "analyze", "visualize", "report"]
    
  api_integration:
    description: "Integrar APIs externas"
    steps: ["authenticate", "map_endpoints", "implement", "test"]
```

---

## 📚 Recursos Adicionales

### Documentación
- [Documentación Técnica Completa](./super_agente_arquitectura_final.md)
- [API Reference](./api_reference.md)
- [Plugin Development Guide](./plugin_development.md)

### Comunidad
- **Discord**: https://discord.gg/super-agente
- **GitHub Discussions**: https://github.com/super-agente/discussions
- **YouTube Channel**: https://youtube.com/@super-agente

### Soporte
- **Email**: support@super-agente.com
- **Issues**: https://github.com/super-agente/issues
- **Wiki**: https://wiki.super-agente.com

---

## 🔄 Actualizaciones y Mantenimiento

### Actualizaciones Automáticas
```bash
# Configurar auto-updates
npm run setup-auto-updates

# Verificar actualizaciones disponibles
npm run check-updates

# Aplicar actualizaciones
npm run update-all
```

### Backup y Restauración
```bash
# Backup completo
npm run backup --output=./backups/

# Restaurar desde backup
npm run restore --input=./backups/latest.tar.gz
```

### Monitoreo de Salud
```bash
# Dashboard de salud del sistema
npm run health-dashboard

# Métricas en tiempo real
npm run metrics-monitor
```

---

## ✅ Lista de Verificación Final

### Pre-instalación ✓
- [ ] Verificar requisitos del sistema
- [ ] Instalar Node.js y pnpm
- [ ] Instalar Git
- [ ] Configurar cuentas de API (OpenAI, Anthropic, Google)
- [ ] Crear proyecto Supabase

### Instalación ✓
- [ ] Clonar repositorio
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias con pnpm
- [ ] Instalar browsers de Playwright
- [ ] Aplicar migraciones de base de datos

### Post-instalación ✓
- [ ] Desplegar funciones edge
- [ ] Configurar secrets en Supabase
- [ ] Construir todos los proyectos
- [ ] Ejecutar tests de verificación
- [ ] Crear primera cuenta de usuario

### Verificación Final ✓
- [ ] Acceder a todas las interfaces
- [ ] Probar Multi-LLM Router
- [ ] Generar código en Code Engine
- [ ] Crear y ejecutar tarea simple
- [ ] Verificar automatización GUI
- [ ] Revisar logs sin errores

---

**¡Felicitaciones! 🎉**

Has instalado exitosamente el Super Agente Multimodal y Modular. El sistema está listo para potenciar tu productividad con IA avanzada, automatización inteligente y capacidades multimodales.

Para obtener el máximo provecho:
1. Explora todos los módulos gradualmente
2. Comienza con tareas simples y aumenta la complejidad
3. Únete a la comunidad para compartir experiencias
4. Contribuye al proyecto con feedback y mejoras

¡Bienvenido al futuro de la automatización inteligente! 🚀
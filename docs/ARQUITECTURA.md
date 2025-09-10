# ARQUITECTURA — MASSIVE

Visión general
- MASSIVE es un agente multimodal y modular con tres frontends principales y un backend de funciones en Supabase (Edge Functions Deno).
- Enfoque de orquestación por componentes: proveedor LLM, análisis de pantalla, automatización GUI, y orquestación de código.

Componentes
1) Frontends
   - apps/massive-web: UI principal (gestión de proveedores, panel de código, flujos de orquestación)
   - apps/massive-multimodal: UI multimodal (experimentos y flujos específicos)
   - apps/automation-gui: panel de automatización con captura de pantalla (getDisplayMedia), overlays y acciones

2) Backend (Supabase)
   - functions/keys-manager: gestiona claves de proveedores por usuario; cifrado AES-GCM con ENCRYPT_KEY
   - functions/code-orchestrator: router orquestador; integra adaptador SuperClaude (sc:*) hacia code-engine/executor
   - functions/automation-controller: ejecuta pasos básicos de automatización (navegar, esperar, scroll)
   - functions/screen-capture-analysis: análisis de imágenes de pantalla para grounding (bounding boxes, labels)
   - functions/provider-test, llm-proxy, llm-router: utilidades para prueba y ruteo de proveedores LLM
   - functions/task-*, plugin-*, template-*: extensiones para tareas, plugins y plantillas

3) Datos y seguridad
   - Tabla provider_configs con RLS por user_id; config en JSONB con claves cifradas en servidor
   - Secrets gestionados vía supabase secrets (ENCRYPT_KEY); no exponer en .env del cliente

Flujos clave
- Gestión de proveedores: UI -> keys-manager (CRUD + test) -> activar proveedor
- Autonomía GUI: UI captura -> screen-capture-analysis -> grounding -> automation-controller
- Orquestación de código: UI (modo sc:*) -> code-orchestrator -> code-engine/executor -> resultados a UI

Puertos dev (recomendados)
- automation-gui: 3000
- massive-multimodal: 3001
- massive-web: 3002

Notas
- El curado consolida supabase/ en la raíz y evita duplicados en apps.
- La persistencia de claves se hace en servidor; el cliente mantiene sólo estado mínimo.


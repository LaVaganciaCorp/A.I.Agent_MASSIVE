# INVENTARIO — MASSIVE

Este documento resume el contenido curado y las copias de trabajo incluidas.

Carpetas principales
- apps/
  - massive-web/ → Frontend web principal (antes super-agente-web)
  - massive-multimodal/ → Frontend multimodal (antes super-agente-multimodal)
  - automation-gui/ → Panel de automatización GUI (captura pantalla, overlays)
- supabase/
  - functions/ → Edge Functions consolidadas (Deno)
- docs/ → Documentación técnica, investigación y guías
- docker/ → Archivos de Docker Compose de desarrollo
- scripts/ → Espacio reservado para utilidades (PS1) de desarrollo
- agent_workspace/ y agent_workspace (1)/ → Copias de trabajo completas originales (con artefactos y duplicados)

Supabase — Edge Functions presentes
- automation-controller
- autonomy-planner
- code-engine
- code-executor
- code-orchestrator
- keys-manager
- llm-proxy
- llm-router
- plugin-manager
- provider-test
- screen-capture-analysis
- task-handler
- task-manager
- template-manager

Documentación relevante (selección)
- docs/guia_instalacion_completa.md
- docs/integraciones_apis_principales.md
- docs/plan_arquitectura_final.md
- docs/super_agente_arquitectura_final.md
- docs/research/* (planificación y análisis de frameworks y herramientas)
- docs/apps/README_automation-gui.md
- docs/apps/README_super-agente-web.md
- docs/apps/README_super-agente-multimodal.md

Duplicados y legado
- Existe un supabase/ legacy dentro de agent_workspace/super-agente-web; el curado consolida en supabase/ raíz.
- Se mantienen agent_workspace/ y agent_workspace (1)/ como respaldo histórico. Trabajar sobre apps/ y supabase/ del curado.


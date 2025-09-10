# PENDIENTE_Y_OPTIMIZACION — MASSIVE

Este documento lista los procesos pendientes y oportunidades de mejora para continuar el proyecto en otros medios.

Pendientes de implementación o verificación
1) Supabase
   - Re-vincular CLI al proyecto destino (npx -y supabase login/link).
   - Aplicar esquema provider_configs y RLS (ver docs/DEPLOY_NOTES.md).
   - Establecer secreto ENCRYPT_KEY y redeploy de funciones si cambia.
   - Desplegar/revalidar funciones: keys-manager, code-orchestrator, automation-controller,
     screen-capture-analysis, provider-test, llm-proxy, autonomy-planner, llm-router,
     plugin-manager, task-manager, code-engine, code-executor, template-manager.
   - Revisar CORS y allowed origins para las apps (3000, 3001, 3002).

2) Frontends (apps)
   - Confirmar puertos fijos: automation-gui (3000), massive-multimodal (3001), massive-web (3002).
   - Añadir/confirmar cross-env y rimraf en scripts para total compatibilidad Windows.
   - Validar que no existan hardcodes de SUPABASE_URL/ANON_KEY en el código; usar .env.
   - Migrar completamente el gestor de proveedores a servidor (ya implementado base):
     • importar claves locales (migración UI),
     • probar proveedores (provider-test),
     • proxy de chat mínimo (llm-proxy),
     • activar proveedor por defecto por usuario.
   - Integrar pantalla de captura y overlays con resultados reales de screen-capture-analysis
     (bounding boxes, etiquetas, flujo de grounding para acciones GUI).
   - Code Orchestrator: reforzar integración con SuperClaude (sc:*), agregar modos adicionales,
     y exponer orquestación avanzada (plan -> acciones -> ejecución -> verificación).

3) Limpieza y estructura
   - Evitar duplicados de supabase dentro de apps; usar supabase/ raíz del curado.
   - Añadir .env.example en todas las apps (y verificar variables mínimas requeridas).
   - Añadir README por app con instrucciones de arranque y variables.

4) Pruebas y calidad
   - E2E con Playwright/Cypress para flujos críticos (gestión de claves, captura y análisis, orquestación de código).
   - Tests unitarios para Edge Functions clave (keys-manager, code-orchestrator, screen-capture-analysis).
   - Lint + format automáticos (ESLint + Prettier); CI básico.

5) Dockerización
   - Validar docker/docker-compose.dev.yml en Windows con WSL2.
   - Opción stack local completo (incl. Supabase local) si se requiere offline.

6) Observabilidad y rendimiento
   - Logging estructurado y niveles por función (debug/info/warn/error).
   - Métricas básicas: latencia por operación, tasa de error por función, tamaño de payload.
   - Mejora de rendimiento frontend: code-splitting, lazy import, memoización, reducción de renders.
   - Caching de respuestas LLM (cuando aplique) y backoff exponencial en reintentos.

Oportunidades de optimización técnica
- Seguridad y claves
  • Endurecer políticas RLS; índices por (user_id, provider).
  • Rotación de ENCRYPT_KEY y migración/reencriptación planificada.
  • Sanitizar inputs en funciones; límites de tamaño y validaciones estrictas.

- Edge Functions
  • Unificar utilidades (logger, http helpers, CORS) en módulo compartido.
  • Bundling/treeshaking para reducir cold start.
  • Tests contractuales con ejemplos de payload por proveedor.

- Frontend
  • Proveedor por entorno: perfiles (desarrollo/staging/prod) y feature flags.
  • Trabajar modo offline con caché local cuando funciones no estén disponibles.
  • Mejorar accesibilidad en overlays y paneles complejos.

- Orquestación de código (SuperClaude / MCP)
  • Extender adaptadores sc:* y añadir MCP servers críticos.
  • Añadir memoria de proyecto (vector store) y recuperación contextual.
  • Validación/post-check automatizado y sugerencias de refactor.

- Automatización GUI
  • Refinar grounding: mapeo estable de elementos + tolerancia a cambios visuales.
  • Añadir replay y time-travel de acciones para depuración.

Nota
Este paquete es curado: para ejecutar, instala dependencias en apps/* y configura `.env`. Para despliegue, sigue docs/DEPLOY_NOTES.md.


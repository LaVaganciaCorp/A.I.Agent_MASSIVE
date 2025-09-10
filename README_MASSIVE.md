# MASSIVE — Agente Multimodal y Modular (curado)

Este directorio consolida, ordena y depura el trabajo realizado sobre el agente (antes “Super Agente”, ahora “MASSIVE”).

Estructura principal:
- apps/
  - massive-web/ (antes: super-agente-web)
  - massive-multimodal/ (antes: super-agente-multimodal)
  - automation-gui/
- supabase/
  - functions/ (todas las Edge Functions consolidadas)
- docs/ (documentación existente y de investigación, + nuevas guías)
- docker/ (compose de desarrollo de ejemplo)
- scripts/ (reservado para utilidades de Windows/PowerShell)
- agent_workspace/ y agent_workspace (1)/ (copias de trabajo originales; se mantienen intactas como referencia histórica)

Notas clave
- Esta carpeta es una versión curada para archivar y continuar en otros medios. Se han excluido artefactos temporales (node_modules, dist, build, .next, .turbo, coverage) y ficheros .env reales.
- Las funciones de Supabase se han consolidado en supabase/functions. Si alguna no aparece, revisar el legado en agent_workspace/…
- Puertos recomendados en desarrollo: automation-gui (3000), massive-multimodal (3001), massive-web (3002).

Cómo ejecutar localmente (sin Docker)
1) Requisitos: Node 18+, pnpm 8+, PowerShell 7.
2) Instalar dependencias por app:
   - cd apps/massive-web && pnpm install
   - cd apps/massive-multimodal && pnpm install
   - cd apps/automation-gui && pnpm install
3) Variables de entorno: copia .env.example -> .env en cada app y completa SUPABASE_URL/ANON_KEY.
4) Ejecutar:
   - pnpm dev (en cada app)

Con Supabase Cloud
- Vincula tu proyecto (login y link) y despliega las Edge Functions. Revisa docs/DEPLOY_NOTES.md.

Con Docker
- Revisa docker/DOCKER_USAGE.md y docker/docker-compose.dev.yml para levantar las apps en modo desarrollo.

Seguridad
- Nunca subas claves reales a repos públicos. Este paquete elimina .env reales y propone .env.example.
- Las claves de proveedores deben gestionarse en servidor (Supabase) con cifrado y RLS. Ver docs/DEPLOY_NOTES.md.

Siguientes pasos
- Lee docs/PENDIENTE_Y_OPTIMIZACION.md para ver el listado de tareas incompletas y áreas de mejora.


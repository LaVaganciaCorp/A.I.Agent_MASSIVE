# DOCKER_USAGE — Desarrollo con Docker

Este flujo levanta las tres apps en modo desarrollo usando Docker Compose, apuntando a Supabase Cloud.

Pasos
1) Ubícate en la carpeta docker:
   cd docker

2) Copia .env.example a .env y completa valores:
   - SUPABASE_URL=https://<PROJECT_REF>.supabase.co
   - SUPABASE_ANON_KEY=<ANON_KEY>

3) Levanta los servicios:
   docker compose -f docker-compose.dev.yml up --build

Servicios y puertos
- automation-gui → http://localhost:3000
- massive-multimodal → http://localhost:3001
- massive-web → http://localhost:3002

Notas
- Los contenedores montan las carpetas de apps como volumen (hot reload). Si tienes problemas en Windows, habilita WSL2 y comparte la carpeta de OneDrive.
- El primer arranque instala dependencias con pnpm dentro de cada contenedor.
- Si usas PNPM localmente, puedes parar los contenedores y seguir en host sin conflictos.


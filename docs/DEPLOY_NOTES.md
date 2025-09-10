# DEPLOY_NOTES — MASSIVE (Supabase)

Esta guía resume el estado y los pasos para desplegar las Edge Functions y preparar el backend en Supabase Cloud.

Prerrequisitos
- Tener un proyecto en Supabase Cloud.
- Instalar Supabase CLI (recomendado usar `npx -y supabase` para evitar problemas en Windows).
- Node 18+, pnpm 8+ para las apps front.

1) Autenticación y vínculo del proyecto
- Inicia sesión:
  npx -y supabase login
- Víncula el repo local con tu proyecto (reemplaza <PROJECT_REF>):
  npx -y supabase link --project-ref <PROJECT_REF>
  Nota: Si tu token no tiene acceso al proyecto, revisa en la cuenta correcta y vuelve a generar token.

2) Secretos para funciones
- Genera y establece la clave de cifrado usada por el keys-manager (AES-GCM):
  npx -y supabase secrets set ENCRYPT_KEY="<clave_de_32_bytes_base64>"
  Sugerencia: genera una clave segura, p. ej. con Node: `require('crypto').randomBytes(32).toString('base64')`.

3) Esquema de base de datos (provider_configs)
Aplicar en el SQL Editor de Supabase (o con migraciones si prefieres):

CREATE TABLE IF NOT EXISTS public.provider_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  config jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_configs ENABLE ROW LEVEL SECURITY;

-- Acceso sólo al dueño (por user_id)
CREATE POLICY provider_configs_select ON public.provider_configs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY provider_configs_modify ON public.provider_configs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY provider_configs_update ON public.provider_configs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY provider_configs_delete ON public.provider_configs
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger opcional para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_provider_configs_updated_at ON public.provider_configs;
CREATE TRIGGER trg_provider_configs_updated_at
BEFORE UPDATE ON public.provider_configs
FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

Notas
- El cifrado/descifrado de claves de proveedores ocurre en la Edge Function `keys-manager` usando ENCRYPT_KEY (no se guardan en texto plano).

4) Despliegue de Edge Functions
Desde la raíz del proyecto (C:\Users\lavag\OneDrive\Desktop\MASSIVE):

npx -y supabase functions deploy keys-manager code-orchestrator automation-controller screen-capture-analysis \
  llm-proxy provider-test autonomy-planner llm-router plugin-manager task-manager code-engine code-executor template-manager

Puedes desplegar funciones de forma individual si lo prefieres.

5) Variables en el frontend
En cada app (apps/*) copia `.env.example` -> `.env` y rellena:
- VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
- VITE_SUPABASE_ANON_KEY=<ANON_KEY>

6) Verificación rápida
- Con las apps levantadas, prueba el flujo de gestor de proveedores (crear, probar, activar), pantalla de captura con overlays y operaciones del Code Orchestrator.
- Si algo falla por CORS en funciones, revisa configuración de URL permitidas en Supabase y los headers de cada función.

Estado actual resumido
- Edge Functions implementadas: keys-manager, code-orchestrator, automation-controller, screen-capture-analysis, provider-test, llm-proxy, autonomy-planner, llm-router, plugin-manager, task-manager, code-engine, code-executor, template-manager.
- Pendiente típico: confirmar policies RLS, re-vinculación CLI al proyecto correcto, y re-despliegue si cambiaste secretos.


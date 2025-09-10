import { handleSCOperation } from './superclaude_adapter.ts'

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { operation_type = 'analyze', code_content = '', language = 'typescript', mode = 'orchestration', prompt = '' } = body || {};

    // Route sc:* operations through the minimal SuperClaude adapter
    if (typeof operation_type === 'string' && operation_type.startsWith('sc:')) {
      const out = await handleSCOperation(req.url, { operation: operation_type, code: code_content, language, prompt, mode })
      return new Response(JSON.stringify({ success: true, data: out }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Default: call code-engine with requested operation_type
    const res = await fetch(new URL('/functions/v1/code-engine', req.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation_type, code_content, language, requirements: prompt })
    });
    const ce = await res.json();

    const resp = {
      success: true,
      data: {
        orchestrator_mode: mode,
        operation_type,
        language,
        prompt,
        result: ce?.data || ce,
        notes: 'Orquestación básica sobre code-engine. Integración con SuperClaude Framework pendiente.'
      }
    };

    return new Response(JSON.stringify(resp), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


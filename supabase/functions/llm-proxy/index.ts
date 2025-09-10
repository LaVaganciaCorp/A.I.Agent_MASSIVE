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
    const { provider, endpoint, apiKey, model, messages = [], headers, azure } = body || {};

    if (!endpoint) throw new Error('endpoint is required');

    const h: Record<string,string> = {
      'Content-Type': 'application/json',
      ...(headers || {})
    };
    if (apiKey) h['Authorization'] = `Bearer ${apiKey}`;

    let url = endpoint.replace(/\/$/, '');
    let payload: any = undefined;

    switch ((provider || '').toLowerCase()) {
      case 'azure-openai': {
        if (!azure?.deployment || !azure?.apiVersion) {
          throw new Error('azure.deployment and azure.apiVersion are required for azure-openai');
        }
        url = `${url}/openai/deployments/${azure.deployment}/chat/completions?api-version=${azure.apiVersion}`;
        payload = { model, messages, temperature: 0.2, max_tokens: 64 };
        break;
      }
      default: {
        // OpenAI-compatible
        url = `${url}/chat/completions`;
        payload = { model, messages, temperature: 0.2, max_tokens: 64 };
      }
    }

    const res = await fetch(url, { method: 'POST', headers: h, body: JSON.stringify(payload) });
    const data = await res.json();
    return new Response(JSON.stringify({ data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


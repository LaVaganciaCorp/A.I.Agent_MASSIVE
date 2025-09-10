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
    const { provider, endpoint, apiKey, model, headers, azure } = body || {};

    if (!endpoint) {
      throw new Error('endpoint is required');
    }

    // Normalize headers
    const h: Record<string,string> = {
      'Content-Type': 'application/json',
      ...(headers || {})
    };

    // Common Authorization header if apiKey is provided
    if (apiKey) {
      // Many providers are Bearer
      h['Authorization'] = `Bearer ${apiKey}`;
      // Some providers (OpenRouter) also accept as above; for Azure we add api-version in URL
    }

    // Choose a light-weight probe per provider
    let url = endpoint;
    let method: 'GET' | 'POST' = 'GET';
    let payload: any = undefined;

    switch ((provider || '').toLowerCase()) {
      case 'groq':
      case 'openrouter':
      case 'mistral':
      case 'openai':
      case 'google':
      case 'deepseek':
      case 'moonshot':
      case 'custom': {
        // Try to list models when possible
        if (!url.endsWith('/')) url += '/';
        url += 'models';
        method = 'GET';
        break;
      }
      case 'azure-openai': {
        // Azure: deployments list requires management API; simpler: try a chat.completions with zero tokens
        // Use deployment if provided
        if (!azure?.deployment || !azure?.apiVersion) {
          throw new Error('azure.deployment and azure.apiVersion are required for azure-openai');
        }
        let base = endpoint.replace(/\/$/, '');
        url = `${base}/openai/deployments/${azure.deployment}/chat/completions?api-version=${azure.apiVersion}`;
        method = 'POST';
        payload = { messages: [{ role: 'user', content: 'ping' }], max_tokens: 1, temperature: 0, model: model || undefined };
        break;
      }
      case 'lm-studio': {
        // LM Studio compatible with OpenAI API
        if (!url.endsWith('/')) url += '/';
        url += 'models';
        method = 'GET';
        break;
      }
      default: {
        // Fallback: GET models
        if (!url.endsWith('/')) url += '/';
        url += 'models';
        method = 'GET';
      }
    }

    const res = await fetch(url, {
      method,
      headers: h,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const text = await res.text();

    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, status: res.status, message: text?.slice(0, 500) }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, status: res.status, message: 'Provider reachable' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, status: 0, message: (error as Error).message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});


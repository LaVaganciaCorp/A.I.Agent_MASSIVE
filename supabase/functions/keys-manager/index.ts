import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function encryptApiKey(rawKey: string, plaintext: string) {
  const encKey = rawKey
  const encBytes = new TextEncoder().encode(encKey.padEnd(32, '0')).slice(0, 32)
  const cryptoKey = await crypto.subtle.importKey('raw', encBytes, 'AES-GCM', false, ['encrypt'])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(plaintext))
  const out = new Uint8Array(iv.length + new Uint8Array(ct).length)
  out.set(iv, 0)
  out.set(new Uint8Array(ct), iv.length)
  return btoa(String.fromCharCode(...out))
}

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
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'list';
    const body = req.method === 'GET' ? {} : await req.json().catch(()=>({}));

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY')!
    const ENCRYPT_KEY = Deno.env.get('ENCRYPT_KEY') || 'default_dev_key'

    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: req.headers.get('Authorization') || '' } }
    })

    const { data: authData } = await supabase.auth.getUser()
    const userId = authData?.user?.id
    if (!userId) {
      return json({ success: false, error: 'unauthorized' }, 401)
    }

    switch (action) {
      case 'list': {
        const { data, error } = await supabase
          .from('provider_configs')
          .select('id,name,provider,endpoint,model,headers,azure,active,created_at,updated_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        if (error) return json({ success: false, error: error.message }, 500)
        return json({ success: true, data })
      }
      case 'add': {
        const enc = body.apiKey ? await encryptApiKey(ENCRYPT_KEY, body.apiKey) : null
        const payload = {
          user_id: userId,
          name: body.name,
          provider: body.provider,
          endpoint: body.endpoint,
          model: body.model,
          headers: body.headers || null,
          azure: body.azure || null,
          active: !!body.active,
          enc_api_key: enc,
        }
        const { data, error } = await supabase.from('provider_configs').insert(payload).select('id').single()
        if (error) return json({ success: false, error: error.message }, 500)
        return json({ success: true, id: data.id })
      }
      case 'update': {
        const id = body.id
        if (!id) return json({ success: false, error: 'id_required' }, 400)
        const patch: any = { ...body, updated_at: new Date().toISOString() }
        delete patch.id
        if (patch.apiKey) {
          patch.enc_api_key = await encryptApiKey(ENCRYPT_KEY, patch.apiKey)
          delete patch.apiKey
        }
        const { error } = await supabase.from('provider_configs').update(patch).eq('id', id).eq('user_id', userId)
        if (error) return json({ success: false, error: error.message }, 500)
        return json({ success: true })
      }
      case 'delete': {
        const id = body.id
        if (!id) return json({ success: false, error: 'id_required' }, 400)
        const { error } = await supabase.from('provider_configs').delete().eq('id', id).eq('user_id', userId)
        if (error) return json({ success: false, error: error.message }, 500)
        return json({ success: true })
      }
      default:
        return json({ success: false, error: 'invalid_action' }, 400);
    }
  } catch (error) {
    return json({ success: false, error: (error as Error).message }, 500);
  }

  function json(obj: any, status = 200) {
    return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


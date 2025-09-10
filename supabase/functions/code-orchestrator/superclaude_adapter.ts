export interface SCParams {
  operation: string
  code: string
  language: string
  prompt?: string
  mode?: 'auto' | 'step' | 'orchestration'
}

export async function handleSCOperation(reqUrl: string, p: SCParams) {
  // Minimal adapter: route to code-engine with enriched intent
  const op = p.operation.replace(/^sc:/, '')
  const mapped = mapToEngineOp(op)
  const res = await fetch(new URL('/functions/v1/code-engine', reqUrl).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation_type: mapped, code_content: p.code, language: p.language, requirements: p.prompt || '' })
  })
  const ce = await res.json()
  return {
    framework: 'superclaude-adapter:minimal',
    mode: p.mode || 'orchestration',
    mapped_operation: mapped,
    original_operation: p.operation,
    engine_result: ce?.data || ce,
  }
}

function mapToEngineOp(op: string) {
  switch (op) {
    case 'analyze':
    case 'explain':
      return 'analyze'
    case 'edit':
    case 'refactor':
      return 'refactor'
    case 'debug':
      return 'debug'
    case 'generate':
      return 'generate'
    default:
      return 'analyze'
  }
}


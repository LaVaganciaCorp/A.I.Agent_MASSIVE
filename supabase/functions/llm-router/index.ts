// Edge Function: LLM Router
// Función crítica que selecciona dinámicamente el mejor proveedor de LLM
// basado en el tipo de tarea solicitada

Deno.serve(async (req) => {
    // Configuración de CORS para permitir llamadas desde el frontend
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    // Manejo de solicitudes OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        // Extraer datos de la solicitud
        const requestData = await req.json();
        const { task_type, prompt, preferences = {} } = requestData;

        // Validación de entrada
        if (!task_type || !prompt) {
            throw new Error('task_type y prompt son requeridos');
        }

        // TODO: Implementar lógica avanzada de selección basada en:
        // - Costo por token de cada proveedor
        // - Latencia promedio del proveedor
        // - Calidad específica por tipo de tarea
        // - Disponibilidad en tiempo real
        // - Preferencias del usuario
        // - Límites de rate y cuotas

        let selectedProvider: string;
        let selectedModel: string;
        let reasoning: string;

        // Lógica de selección de LLM basada en el tipo de tarea
        switch (task_type.toLowerCase()) {
            case 'code':
            case 'programming':
            case 'debug':
            case 'refactor':
                // Para tareas de código, Claude 3.5 Sonnet es superior
                selectedProvider = 'anthropic';
                selectedModel = 'claude-3-5-sonnet-20241022';
                reasoning = 'Claude 3.5 Sonnet tiene capacidades superiores para generación y análisis de código';
                break;

            case 'multimodal':
            case 'vision':
            case 'image_analysis':
            case 'chart_analysis':
                // Para tareas multimodales, Gemini Pro Vision es excelente
                selectedProvider = 'google';
                selectedModel = 'gemini-1.5-pro';
                reasoning = 'Gemini 1.5 Pro tiene capacidades avanzadas de procesamiento multimodal y visión';
                break;

            case 'creative':
            case 'writing':
            case 'storytelling':
            case 'marketing':
                // Para tareas creativas, GPT-4 es muy versátil
                selectedProvider = 'openai';
                selectedModel = 'gpt-4-turbo-preview';
                reasoning = 'GPT-4 Turbo excele en tareas creativas y de escritura';
                break;

            case 'analysis':
            case 'research':
            case 'summarization':
            case 'extraction':
                // Para análisis profundo, Claude es excelente
                selectedProvider = 'anthropic';
                selectedModel = 'claude-3-haiku-20240307';
                reasoning = 'Claude Haiku es eficiente y preciso para análisis y research';
                break;

            case 'translation':
            case 'language':
                // Para traducciones, GPT-4 tiene buen soporte multiidioma
                selectedProvider = 'openai';
                selectedModel = 'gpt-4';
                reasoning = 'GPT-4 tiene excelente soporte para múltiples idiomas';
                break;

            case 'local':
            case 'private':
            case 'offline':
                // TODO: Integrar con Llama Factory para modelos locales
                selectedProvider = 'local';
                selectedModel = 'llama-3.1-8b-instruct';
                reasoning = 'Modelo local para privacidad y procesamiento offline';
                break;

            case 'general':
            default:
                // Para tareas generales, Claude 3.5 Sonnet como default
                selectedProvider = 'anthropic';
                selectedModel = 'claude-3-5-sonnet-20241022';
                reasoning = 'Claude 3.5 Sonnet es versátil para tareas generales';
                break;
        }

        // TODO: Aplicar lógica de optimización avanzada
        // - Verificar disponibilidad y cuotas del proveedor seleccionado
        // - Considerar el costo vs calidad según preferencias del usuario
        // - Implementar fallback a proveedores alternativos
        // - Aplicar rate limiting inteligente
        // - Considerar el contexto de la sesión del usuario

        // Estructura de respuesta con metadata completa
        const response = {
            success: true,
            data: {
                selected_provider: selectedProvider,
                selected_model: selectedModel,
                reasoning: reasoning,
                task_type: task_type,
                timestamp: new Date().toISOString(),
                // TODO: Agregar métricas predichas
                estimated_metrics: {
                    cost_per_1k_tokens: getEstimatedCost(selectedProvider, selectedModel),
                    avg_latency_ms: getEstimatedLatency(selectedProvider),
                    quality_score: getQualityScore(selectedProvider, selectedModel, task_type)
                },
                // TODO: Agregar alternativas sugeridas
                alternatives: getAlternativeModels(task_type, selectedProvider)
            }
        };

        // Log para debugging y analytics
        console.log(`LLM Router - Task: ${task_type}, Selected: ${selectedProvider}/${selectedModel}`);

        return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('LLM Router Error:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'LLM_ROUTER_ERROR',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// TODO: Implementar funciones auxiliares para métricas avanzadas
// Estas funciones serán expandidas con datos reales de la base de datos

function getEstimatedCost(provider: string, model: string): number {
    // TODO: Integrar con tabla de costos en tiempo real
    const costTable: Record<string, Record<string, number>> = {
        'anthropic': {
            'claude-3-5-sonnet-20241022': 3.0,
            'claude-3-haiku-20240307': 0.5
        },
        'openai': {
            'gpt-4-turbo-preview': 10.0,
            'gpt-4': 30.0
        },
        'google': {
            'gemini-1.5-pro': 2.0
        },
        'openrouter': {
            'gpt-4o-mini': 0.8,
            'llama-3.1-8b-instruct': 0.1
        },
        'groq': {
            'llama3-8b-8192': 0.0,
            'mixtral-8x7b-32768': 0.0
        },
        'mistral': {
            'mistral-large': 2.5,
            'mistral-small': 0.3
        },
        'azure-openai': {
            'gpt-4o': 10.0
        },
        'lm-studio': {
            'local': 0.0
        },
        'deepseek': {
            'deepseek-chat': 0.5
        },
        'moonshot': {
            'kimi-thought': 1.5
        },
        'local': {
            'llama-3.1-8b-instruct': 0.0
        }
    };
    
    return costTable[provider]?.[model] || 1.0;
}

function getEstimatedLatency(provider: string): number {
    // TODO: Integrar con métricas de latencia en tiempo real
    const latencyTable: Record<string, number> = {
        'anthropic': 800,
        'openai': 1200,
        'google': 1000,
        'openrouter': 1100,
        'groq': 700,
        'mistral': 900,
        'azure-openai': 1000,
        'lm-studio': 250,
        'deepseek': 950,
        'moonshot': 1050,
        'local': 200
    };
    
    return latencyTable[provider] || 1000;
}

function getQualityScore(provider: string, model: string, taskType: string): number {
    // TODO: Implementar scoring basado en benchmarks reales
    // y feedback del usuario por tipo de tarea
    const baseScores: Record<string, number> = {
'claude-3-5-sonnet-20241022': 95,
        'gpt-4-turbo-preview': 90,
        'gemini-1.5-pro': 88,
        'claude-3-haiku-20240307': 82,
        'llama-3.1-8b-instruct': 75,
        'mistral-large': 85,
        'llama3-8b-8192': 78,
        'deepseek-chat': 80,
        'gpt-4o': 92
    };
    
    return baseScores[model] || 80;
}

function getAlternativeModels(taskType: string, excludeProvider: string): Array<{provider: string, model: string, reason: string}> {
    // TODO: Implementar lógica de alternativas inteligente
    const alternatives = [
        {
            provider: 'openai',
            model: 'gpt-4-turbo-preview',
            reason: 'Alternativa confiable con buen rendimiento general'
        },
        {
            provider: 'google',
            model: 'gemini-1.5-pro',
            reason: 'Excelente para tareas que requieren contexto largo'
        }
    ];
    
    return alternatives.filter(alt => alt.provider !== excludeProvider);
}
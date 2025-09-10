// Edge Function: Template Manager
// Gestor de templates y macros para automatización
// Maneja plantillas predefinidas, macros personalizables y casos de uso comunes

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
        const requestData = await req.json();
        const { 
            action, // 'list_templates', 'get_template', 'create_template', 'update_template', 'delete_template', 'execute_template'
            template_id,
            template_data,
            category = 'general', // 'computer_use', 'mobile_use', 'grounding', 'web_automation', 'data_extraction'
            platform = 'web',
            search_query,
            user_id
        } = requestData;

        if (!action) {
            throw new Error('action es requerida');
        }

        console.log(`Template Manager - Action: ${action}, Category: ${category}`);

        let result;
        
        switch (action) {
            case 'list_templates':
                result = await listTemplates(category, platform, search_query);
                break;
            case 'get_template':
                result = await getTemplate(template_id);
                break;
            case 'create_template':
                result = await createTemplate(template_data, user_id);
                break;
            case 'update_template':
                result = await updateTemplate(template_id, template_data, user_id);
                break;
            case 'delete_template':
                result = await deleteTemplate(template_id, user_id);
                break;
            case 'execute_template':
                result = await executeTemplate(template_id, requestData.parameters || {});
                break;
            case 'import_template':
                result = await importTemplate(template_data, user_id);
                break;
            case 'export_template':
                result = await exportTemplate(template_id);
                break;
            default:
                throw new Error(`Acción no soportada: ${action}`);
        }

        const response = {
            success: true,
            data: {
                action: action,
                result: result,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Template Manager Error:', error);

        const errorResponse = {
            success: false,
            error: {
                code: 'TEMPLATE_MANAGER_ERROR',
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

// Listado de templates
async function listTemplates(category, platform, searchQuery) {
    // TODO: Consultar base de datos real de templates
    const allTemplates = getBuiltInTemplates();
    
    let filteredTemplates = allTemplates;
    
    if (category && category !== 'general') {
        filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }
    
    if (platform) {
        filteredTemplates = filteredTemplates.filter(t => 
            t.supported_platforms.includes(platform) || t.supported_platforms.includes('all')
        );
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredTemplates = filteredTemplates.filter(t => 
            t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query) ||
            t.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    return {
        total: filteredTemplates.length,
        templates: filteredTemplates,
        categories: extractCategories(allTemplates),
        platforms: extractPlatforms(allTemplates)
    };
}

// Obtener template específico
async function getTemplate(templateId) {
    const templates = getBuiltInTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
        throw new Error(`Template no encontrado: ${templateId}`);
    }
    
    return {
        template: template,
        usage_stats: {
            total_executions: Math.floor(Math.random() * 1000) + 100,
            success_rate: Math.floor(Math.random() * 20) + 80,
            avg_execution_time: Math.floor(Math.random() * 5000) + 1000
        },
        related_templates: getRelatedTemplates(template)
    };
}

// Creación de template
async function createTemplate(templateData, userId) {
    const newTemplate = {
        id: generateTemplateId(),
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        supported_platforms: templateData.supported_platforms || ['web'],
        actions: templateData.actions || [],
        parameters: templateData.parameters || [],
        tags: templateData.tags || [],
        author: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: '1.0.0',
        is_public: templateData.is_public || false,
        usage_count: 0
    };
    
    // TODO: Persistir en base de datos
    
    return {
        template: newTemplate,
        message: 'Template creado exitosamente'
    };
}

// Actualización de template
async function updateTemplate(templateId, templateData, userId) {
    // TODO: Verificar permisos de usuario
    // TODO: Actualizar en base de datos
    
    return {
        template_id: templateId,
        updated_fields: Object.keys(templateData),
        updated_at: new Date().toISOString(),
        message: 'Template actualizado exitosamente'
    };
}

// Eliminación de template
async function deleteTemplate(templateId, userId) {
    // TODO: Verificar permisos de usuario
    // TODO: Eliminar de base de datos
    
    return {
        template_id: templateId,
        deleted_at: new Date().toISOString(),
        message: 'Template eliminado exitosamente'
    };
}

// Ejecución de template
async function executeTemplate(templateId, parameters) {
    const template = await getTemplate(templateId);
    
    if (!template.template) {
        throw new Error(`Template no encontrado: ${templateId}`);
    }
    
    // Procesamiento de parámetros
    const processedActions = processTemplateParameters(template.template.actions, parameters);
    
    return {
        template_id: templateId,
        template_name: template.template.name,
        processed_actions: processedActions,
        parameters_applied: parameters,
        ready_for_execution: true,
        estimated_duration: calculateEstimatedDuration(processedActions)
    };
}

// Importación de template
async function importTemplate(templateData, userId) {
    // Validación de formato
    const validation = validateTemplateFormat(templateData);
    if (!validation.valid) {
        throw new Error(`Formato de template inválido: ${validation.errors.join(', ')}`);
    }
    
    const importedTemplate = {
        ...templateData,
        id: generateTemplateId(),
        imported_by: userId,
        imported_at: new Date().toISOString(),
        original_id: templateData.id
    };
    
    return {
        template: importedTemplate,
        message: 'Template importado exitosamente'
    };
}

// Exportación de template
async function exportTemplate(templateId) {
    const template = await getTemplate(templateId);
    
    if (!template.template) {
        throw new Error(`Template no encontrado: ${templateId}`);
    }
    
    const exportData = {
        format_version: '1.0',
        exported_at: new Date().toISOString(),
        template: template.template
    };
    
    return {
        export_data: exportData,
        filename: `${template.template.name.replace(/\s+/g, '_')}_${template.template.version}.json`,
        format: 'json'
    };
}

// Templates predefinidos
function getBuiltInTemplates() {
    return [
        {
            id: 'web_form_fill',
            name: 'Rellenar Formulario Web',
            description: 'Template para completar formularios web automáticamente',
            category: 'web_automation',
            supported_platforms: ['web'],
            tags: ['formulario', 'web', 'automatización', 'datos'],
            parameters: [
                { name: 'form_data', type: 'object', required: true, description: 'Datos del formulario' },
                { name: 'submit_after_fill', type: 'boolean', required: false, default: true }
            ],
            actions: [
                {
                    type: 'navigate',
                    target: { url: '{{target_url}}' },
                    description: 'Navegar a la página del formulario'
                },
                {
                    type: 'wait',
                    parameters: { duration: 2000 },
                    description: 'Esperar carga de la página'
                },
                {
                    type: 'fill_form',
                    target: { form_selector: '{{form_selector}}' },
                    parameters: { data: '{{form_data}}' },
                    description: 'Rellenar campos del formulario'
                },
                {
                    type: 'click',
                    target: { selector: '{{submit_button}}' },
                    condition: '{{submit_after_fill}}',
                    description: 'Enviar formulario'
                }
            ],
            author: 'system',
            version: '1.2.0',
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: 'data_extraction_web',
            name: 'Extracción de Datos Web',
            description: 'Extrae datos estructurados de páginas web',
            category: 'data_extraction',
            supported_platforms: ['web'],
            tags: ['extracción', 'scraping', 'datos', 'web'],
            parameters: [
                { name: 'target_urls', type: 'array', required: true },
                { name: 'data_selectors', type: 'object', required: true },
                { name: 'output_format', type: 'string', default: 'json' }
            ],
            actions: [
                {
                    type: 'iterate_urls',
                    target: { urls: '{{target_urls}}' },
                    description: 'Iterar sobre las URLs objetivo'
                },
                {
                    type: 'extract_data',
                    target: { selectors: '{{data_selectors}}' },
                    description: 'Extraer datos usando selectores'
                },
                {
                    type: 'format_output',
                    parameters: { format: '{{output_format}}' },
                    description: 'Formatear datos extraidos'
                }
            ],
            author: 'system',
            version: '1.1.0',
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: 'computer_use_basic',
            name: 'Uso Básico de Computadora',
            description: 'Template para interacciones básicas con aplicaciones de escritorio',
            category: 'computer_use',
            supported_platforms: ['windows', 'linux'],
            tags: ['escritorio', 'aplicaciones', 'básico'],
            parameters: [
                { name: 'application_path', type: 'string', required: true },
                { name: 'window_title', type: 'string', required: false },
                { name: 'actions_sequence', type: 'array', required: true }
            ],
            actions: [
                {
                    type: 'launch_application',
                    target: { path: '{{application_path}}' },
                    description: 'Lanzar aplicación'
                },
                {
                    type: 'wait_for_window',
                    target: { title: '{{window_title}}' },
                    description: 'Esperar ventana de aplicación'
                },
                {
                    type: 'execute_sequence',
                    target: { sequence: '{{actions_sequence}}' },
                    description: 'Ejecutar secuencia de acciones'
                }
            ],
            author: 'system',
            version: '1.0.0',
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: 'mobile_app_testing',
            name: 'Testing de Aplicación Móvil',
            description: 'Template para automatizar pruebas en aplicaciones móviles',
            category: 'mobile_use',
            supported_platforms: ['android', 'ios'],
            tags: ['móvil', 'testing', 'aplicación', 'pruebas'],
            parameters: [
                { name: 'app_package', type: 'string', required: true },
                { name: 'test_scenarios', type: 'array', required: true },
                { name: 'device_id', type: 'string', required: false }
            ],
            actions: [
                {
                    type: 'launch_app',
                    target: { package: '{{app_package}}' },
                    description: 'Lanzar aplicación móvil'
                },
                {
                    type: 'run_test_scenarios',
                    target: { scenarios: '{{test_scenarios}}' },
                    description: 'Ejecutar escenarios de prueba'
                },
                {
                    type: 'capture_results',
                    description: 'Capturar resultados de pruebas'
                }
            ],
            author: 'system',
            version: '1.0.0',
            created_at: '2024-01-01T00:00:00Z'
        }
    ];
}

// Procesamiento de parámetros en acciones
function processTemplateParameters(actions, parameters) {
    return actions.map(action => {
        const processedAction = JSON.parse(JSON.stringify(action));
        
        // Reemplazar variables en el objeto acción
        const actionStr = JSON.stringify(processedAction);
        const processedStr = actionStr.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
            if (parameters.hasOwnProperty(paramName)) {
                return JSON.stringify(parameters[paramName]).slice(1, -1); // Remover comillas
            }
            return match; // Mantener placeholder si no se encuentra el parámetro
        });
        
        return JSON.parse(processedStr);
    });
}

// Validación de formato de template
function validateTemplateFormat(templateData) {
    const errors = [];
    
    if (!templateData.name) errors.push('Nombre requerido');
    if (!templateData.description) errors.push('Descripción requerida');
    if (!templateData.actions || !Array.isArray(templateData.actions)) {
        errors.push('Acciones requeridas como array');
    }
    if (!templateData.supported_platforms || !Array.isArray(templateData.supported_platforms)) {
        errors.push('Plataformas soportadas requeridas como array');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Utilidades
function generateTemplateId() {
    return `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractCategories(templates) {
    return [...new Set(templates.map(t => t.category))];
}

function extractPlatforms(templates) {
    const platforms = new Set();
    templates.forEach(t => {
        t.supported_platforms.forEach(p => platforms.add(p));
    });
    return [...platforms];
}

function getRelatedTemplates(template) {
    const allTemplates = getBuiltInTemplates();
    return allTemplates
        .filter(t => t.id !== template.id && t.category === template.category)
        .slice(0, 3)
        .map(t => ({ id: t.id, name: t.name, description: t.description }));
}

function calculateEstimatedDuration(actions) {
    // Estimación simple basada en el número de acciones
    return actions.length * 2000; // 2 segundos por acción promedio
}
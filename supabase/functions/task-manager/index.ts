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

    let result = {};

    switch (action) {
      case 'create':
        result = await createTask(req);
        break;
      case 'execute':
        result = await executeTask(req);
        break;
      case 'update':
        result = await updateTask(req);
        break;
      case 'list':
        result = await listTasks(req);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Task manager error:', error);
    
    const errorResponse = {
      error: {
        code: 'TASK_MANAGER_ERROR',
        message: (error as Error).message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function createTask(req: Request) {
  const { title, description, task_type, priority, estimated_duration } = await req.json();
  
  if (!title || !description || !task_type) {
    throw new Error('Title, description, and task_type are required');
  }

  const task = {
    id: `task-${Date.now()}`,
    title,
    description,
    task_type,
    status: 'pending',
    priority: priority || 2,
    progress: 0,
    estimated_duration: estimated_duration || 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return {
    task,
    message: 'Task created successfully'
  };
}

async function executeTask(req: Request) {
  const { task_id, assigned_model } = await req.json();
  
  if (!task_id) {
    throw new Error('Task ID is required');
  }

  const executionSteps = [
    { step: 'Analyzing task requirements', progress: 10 },
    { step: 'Preparing execution environment', progress: 25 },
    { step: 'Processing with assigned model', progress: 50 },
    { step: 'Generating output', progress: 75 },
    { step: 'Validating results', progress: 90 },
    { step: 'Task completed', progress: 100 }
  ];

  const executionTime = Math.random() * 5000 + 2000;
  
  const result = {
    task_id,
    status: 'completed',
    progress: 100,
    execution_time: executionTime,
    assigned_model: assigned_model || 'auto-selected',
    result: {
      success: true,
      output: 'Task executed successfully',
      metrics: {
        processing_time: executionTime,
        memory_used: Math.floor(Math.random() * 100) + 50,
        tokens_used: Math.floor(Math.random() * 1000) + 200
      }
    },
    completed_at: new Date().toISOString(),
    execution_steps: executionSteps
  };

  return result;
}

async function updateTask(req: Request) {
  const { task_id, updates } = await req.json();
  
  if (!task_id) {
    throw new Error('Task ID is required');
  }

  const updatedTask = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  return {
    task_id,
    updates: updatedTask,
    message: 'Task updated successfully'
  };
}

async function listTasks(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  const mockTasks = [
    {
      id: 'task-1',
      title: 'Generar API REST para e-commerce',
      description: 'Crear una API completa con endpoints para productos, usuarios y órdenes',
      task_type: 'coding',
      status: 'completed',
      priority: 1,
      progress: 100,
      assigned_model: 'Claude 3.5 Sonnet',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task-2',
      title: 'Análisis de sentimientos en redes sociales',
      description: 'Procesar y analizar el sentimiento de menciones de marca en Twitter',
      task_type: 'analysis',
      status: 'in_progress',
      priority: 2,
      progress: 65,
      assigned_model: 'GPT-4 Turbo',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  let filteredTasks = mockTasks;
  if (status) {
    filteredTasks = mockTasks.filter(task => task.status === status);
  }

  return {
    tasks: filteredTasks.slice(0, limit),
    total: filteredTasks.length,
    status_filter: status,
    timestamp: new Date().toISOString()
  };
}


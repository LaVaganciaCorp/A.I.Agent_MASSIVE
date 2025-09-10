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
    const { code, language, action } = await req.json();

    if (!code || !language) {
      throw new Error('Code and language are required');
    }

    let result = {};

    switch (action) {
      case 'execute':
        result = await executeCode(code, language);
        break;
      case 'analyze':
        result = await analyzeCode(code, language);
        break;
      case 'generate':
        result = await generateCode(code, language);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code executor error:', error);
    
    const errorResponse = {
      error: {
        code: 'CODE_EXECUTION_ERROR',
        message: (error as Error).message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function executeCode(code: string, language: string) {
  // Simulate code execution with security checks
  const startTime = Date.now();
  
  // Basic security checks
  const dangerousPatterns = [
    /import\s+os/,
    /import\s+subprocess/,
    /eval\s*\(/,
    /exec\s*\(/,
    /system\s*\(/,
    /process\./,
    /fs\./,
    /require\s*\(['"]fs['"]/
  ];
  
  const hasDangerousCode = dangerousPatterns.some(pattern => pattern.test(code));
  
  if (hasDangerousCode) {
    return {
      success: false,
      error: 'Código contiene operaciones potencialmente peligrosas',
      execution_time: 0
    };
  }
  
  // Simulate execution based on language
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const executionTime = Date.now() - startTime;
  const memoryUsed = Math.floor(Math.random() * 100) + 20;
  
  // Generate realistic output based on code content
  let output = '';
  if (code.includes('console.log') || code.includes('print')) {
    output = 'Resultado de la ejecución\n';
    if (language === 'python') {
      output += 'Procesamiento completado exitosamente\n';
      output += `Elementos procesados: ${Math.floor(Math.random() * 1000) + 100}\n`;
    } else {
      output += 'Operación realizada con éxito\n';
      output += `Status: OK, Time: ${executionTime}ms\n`;
    }
  } else {
    output = `Código ${language} ejecutado sin salida explícita\n`;
  }
  
  return {
    success: true,
    output,
    execution_time: executionTime,
    memory_used: memoryUsed,
    language,
    timestamp: new Date().toISOString()
  };
}

async function analyzeCode(code: string, language: string) {
  // Code analysis simulation
  const lines = code.split('\n').length;
  const complexity = Math.min(10, Math.floor(lines / 10) + Math.floor(Math.random() * 3) + 1);
  
  const issues = [] as Array<{ type: 'warning' | 'error'; message: string; line: number }>;
  const suggestions = [] as string[];
  
  // Basic static analysis
  if (code.includes('var ') && language === 'javascript') {
    issues.push({
      type: 'warning',
      message: 'Considerar usar const o let en lugar de var',
      line: code.split('\n').findIndex(line => line.includes('var ')) + 1
    });
  }
  
  if (code.includes('eval(')) {
    issues.push({
      type: 'error',
      message: 'Uso de eval() es peligroso y debe evitarse',
      line: code.split('\n').findIndex(line => line.includes('eval(')) + 1
    });
  }
  
  if (!code.includes('//') && !code.includes('#') && lines > 20) {
    suggestions.push('Agregar comentarios para mejorar la legibilidad');
  }
  
  if (language === 'javascript' && !code.includes('const') && !code.includes('let')) {
    suggestions.push('Usar declaraciones de variables modernas (const/let)');
  }
  
  const maintainability = Math.max(60, 100 - complexity * 5 - issues.length * 10);
  const security_score = issues.some(i => i.type === 'error') ? 70 : 95;
  const performance_score = Math.max(70, 95 - Math.floor(lines / 50) * 5);
  
  return {
    complexity,
    maintainability,
    security_score,
    performance_score,
    lines_of_code: lines,
    issues,
    suggestions,
    language,
    timestamp: new Date().toISOString()
  };
}

async function generateCode(prompt: string, language: string) {
  // Code generation simulation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const templates: Record<string, Record<string, string>> = {
    javascript: {
      'api': `// API REST con Express\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'OK', timestamp: new Date() });\n});\n\napp.listen(3000, () => {\n  console.log('Servidor ejecutándose en puerto 3000');\n});`,
      'function': `// Función generada\nfunction processData(data) {\n  try {\n    const result = data.map(item => ({\n      ...item,\n      processed: true,\n      timestamp: new Date()\n    }));\n    return result;\n  } catch (error) {\n    console.error('Error procesando datos:', error);\n    return [];\n  }\n}`
    },
    python: {
      'analysis': `# Análisis de datos\nimport pandas as pd\nimport numpy as np\n\ndef analyze_data(data):\n    """Analiza un conjunto de datos"""\n    df = pd.DataFrame(data)\n    \n    analysis = {\n        'count': len(df),\n        'mean': df.select_dtypes(include=[np.number]).mean().to_dict(),\n        'summary': df.describe().to_dict()\n    }\n    \n    return analysis`,
      'ml': `# Modelo de Machine Learning\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\ndef train_model(X, y):\n    """Entrena un modelo de clasificación"""\n    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n    \n    model = RandomForestClassifier(n_estimators=100)\n    model.fit(X_train, y_train)\n    \n    predictions = model.predict(X_test)\n    accuracy = accuracy_score(y_test, predictions)\n    \n    return model, accuracy`
    }
  };
  
  const languageKey = (language || 'javascript').toLowerCase();
  const languageTemplates = templates[languageKey] || templates.javascript;
  const templateKey = Object.keys(languageTemplates)[0];
  
  const generatedCode = languageTemplates[templateKey];
  
  return {
    generated_code: generatedCode,
    language,
    template_used: templateKey,
    prompt,
    timestamp: new Date().toISOString(),
    explanation: `Código ${language} generado basado en: ${prompt}`
  };
}


import { NextRequest, NextResponse } from 'next/server';

const PROVIDER_CONFIGS: Record<string, { baseUrl: string; defaultModel: string }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-3.5-turbo',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-sonnet-20240229',
  },
  qwen: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
  },
  hunyuan: {
    baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
    defaultModel: 'hunyuan-pro',
  },
  wenxin: {
    baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
    defaultModel: 'ernie-4.0',
  },
  doubao: {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: 'doubao-pro',
  },
  ollama: {
    baseUrl: 'http://localhost:11434/api',
    defaultModel: 'llama3',
  },
};

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function getProviderConfig(provider: string, baseUrl?: string) {
  const config = PROVIDER_CONFIGS[provider] || PROVIDER_CONFIGS.openai;
  return {
    baseUrl: baseUrl || config.baseUrl,
    defaultModel: config.defaultModel,
  };
}

function buildRequestHeaders(provider: string, apiKey: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (provider === 'anthropic') {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  } else if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  return headers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, messages, model, apiKey, temperature = 0.7, maxTokens = 4096, stream = true, baseUrl } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const config = getProviderConfig(provider, baseUrl);
    const headers = buildRequestHeaders(provider, apiKey);

    let requestUrl: string;
    let requestBody: Record<string, any>;

    if (provider === 'ollama') {
      requestUrl = `${config.baseUrl}/chat`;
      requestBody = {
        model: model || config.defaultModel,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        stream: true,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      };
    } else if (provider === 'anthropic') {
      requestUrl = `${config.baseUrl}/messages`;
      const systemMessage = messages.find((m: any) => m.role === 'system');
      const nonSystemMessages = messages.filter((m: any) => m.role !== 'system');
      requestBody = {
        model: model || config.defaultModel,
        system: systemMessage?.content,
        messages: nonSystemMessages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      };
    } else {
      requestUrl = `${config.baseUrl}/chat/completions`;
      requestBody = {
        model: model || config.defaultModel,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: maxTokens,
        stream: true,
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Provider API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    if (!stream) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('LLM Proxy Error:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: '请求超时，请稍后重试', details: 'LLM API 响应时间超过 120 秒' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

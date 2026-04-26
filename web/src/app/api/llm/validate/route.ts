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
  doubao: {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: 'doubao-pro',
  },
};

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, apiKey } = body;

    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json({ valid: false, reason: 'API Key too short' });
    }

    const config = PROVIDER_CONFIGS[provider];
    if (!config) {
      return NextResponse.json({ valid: apiKey.startsWith('sk-') && apiKey.length > 30 });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    try {
      const listResponse = await fetch(`${config.baseUrl}/models`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000),
      });

      if (listResponse.ok) {
        return NextResponse.json({ valid: true });
      }

      const testResponse = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.defaultModel,
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1,
          stream: false,
        }),
        signal: AbortSignal.timeout(10000),
      });

      const valid = testResponse.status !== 401 && testResponse.status !== 403;
      return NextResponse.json({ valid });

    } catch {
      return NextResponse.json({
        valid: apiKey.startsWith('sk-') && apiKey.length > 40
      });
    }

  } catch (error) {
    return NextResponse.json({ valid: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

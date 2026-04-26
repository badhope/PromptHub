import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, apiKey, testMessage = 'Hello' } = body;

    const baseUrls: Record<string, string> = {
      openai: 'https://api.openai.com/v1',
      deepseek: 'https://api.deepseek.com/v1',
      anthropic: 'https://api.anthropic.com/v1',
      qwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    };

    const baseUrl = baseUrls[provider] || baseUrls.openai;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const startTime = Date.now();
    let error: string | null = null;
    let statusCode = 0;

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: provider === 'deepseek' ? 'deepseek-chat' : 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: testMessage }],
          max_tokens: 100,
          stream: false,
        }),
        signal: AbortSignal.timeout(15000),
      });

      statusCode = response.status;

      if (response.ok) {
        const data = await response.json();
        const latency = Date.now() - startTime;
        
        return NextResponse.json({
          success: true,
          provider,
          statusCode,
          latency,
          response: data.choices?.[0]?.message?.content || data,
          message: '✅ API 调用成功！后端代理工作正常',
        });
      } else {
        const errorData = await response.text();
        error = `HTTP ${statusCode}: ${errorData.slice(0, 200)}`;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
      statusCode = 500;
    }

    return NextResponse.json({
      success: false,
      provider,
      statusCode,
      error,
      latency: Date.now() - startTime,
      message: '❌ API 调用失败，请检查 API Key 是否正确',
    });

  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    });
  }
}

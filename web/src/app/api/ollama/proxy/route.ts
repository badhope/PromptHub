import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  try {
    const body = await request.json();
    const { endpoint, data } = body;

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const ollamaUrl = `http://127.0.0.1:11434${endpoint}`;
    
    timeout = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (timeout) clearTimeout(timeout);
    timeout = null;

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Ollama Error ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    if (data.stream) {
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    if (timeout) clearTimeout(timeout);
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }
    return NextResponse.json(
      { error: 'Failed to connect to Ollama. Make sure Ollama is running locally.' },
      { status: 503 }
    );
  }
}

export async function GET(request: NextRequest) {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || '/api/tags';

    const ollamaUrl = `http://127.0.0.1:11434${endpoint}`;
    
    timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(ollamaUrl, {
      method: 'GET',
      signal: controller.signal,
    });

    if (timeout) clearTimeout(timeout);
    timeout = null;

    if (!response.ok) {
      return NextResponse.json(
        { error: `Ollama request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    if (timeout) clearTimeout(timeout);
    return NextResponse.json(
      { error: 'Failed to connect to Ollama. Make sure Ollama is running locally.' },
      { status: 503 }
    );
  }
}

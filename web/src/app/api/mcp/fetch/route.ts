import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PromptHub-MCP/1.0)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
      });
    }

    const html = await response.text();

    return NextResponse.json({
      success: true,
      url,
      title: html.match(/<title>([^<]+)<\/title>/)?.[1] || '',
      contentLength: html.length,
      preview: html.slice(0, 5000),
    });

  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    });
  }
}

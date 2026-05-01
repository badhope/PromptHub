import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254',
  'metadata.google.internal',
];

const BLOCKED_PROTOCOLS = ['file:', 'ftp:', 'data:', 'javascript:'];

function isUrlSafe(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`))) {
      return false;
    }
    
    if (/^10\./.test(hostname) || /^192\.168\./.test(hostname) || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' });
    }

    if (!isUrlSafe(url)) {
      return NextResponse.json({ 
        success: false, 
        error: 'URL not allowed: internal or unsafe URLs are blocked' 
      }, { status: 403 });
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

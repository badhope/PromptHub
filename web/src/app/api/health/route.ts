import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const memory = process.memoryUsage();
  const uptime = process.uptime();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.version,
    nodeVersionCheck: parseInt(process.version.slice(1).split('.')[0]) >= 20 ? 'pass' : 'fail',
    uptime: Math.round(uptime),
    memory: {
      rss: Math.round(memory.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
    },
    endpoints: {
      'api/llm/chat': 'ok',
      'api/llm/validate': 'ok',
      'api/mcp/fetch': 'ok',
      'api/mcp/tools': 'ok',
    },
    tips: [
      '部署遇到问题？运行 ./deploy.sh 自动解决所有坑',
    ],
  });
}

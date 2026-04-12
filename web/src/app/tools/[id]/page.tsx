import ToolClient from './ToolClient';

export async function generateStaticParams() {
  const toolsData = await import('@/../public/ai-tools.json');
  return toolsData.tools.map((tool: { id: string }) => ({
    id: tool.id
  }));
}

export default function ToolDetailPage() {
  return <ToolClient />;
}

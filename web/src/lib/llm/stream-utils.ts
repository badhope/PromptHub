export async function parseSSEStream(
  response: Response,
  onChunk: (content: string) => void
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === ': OPENROUTER PROCESSING') continue;
        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content 
              || parsed.choices?.[0]?.text 
              || parsed.response 
              || parsed.message?.content;
            
            if (content) {
              onChunk(content);
            }
          } catch {
            continue;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function createReadableStream(
  generator: (controller: ReadableStreamDefaultController<string>) => Promise<void>
): ReadableStream<string> {
  return new ReadableStream({
    async start(controller) {
      try {
        await generator(controller);
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });
}

export async function streamToString(stream: ReadableStream<string>): Promise<string> {
  const reader = stream.getReader();
  let result = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += value;
  }
  
  return result;
}

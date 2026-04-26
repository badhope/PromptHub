'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AgentEngine, AgentStep, AgentStatus } from '@/lib/agent/agent-engine';
import { streamChat } from '@/lib/llm';
import type { Message, LLMConfig } from '@/lib/llm';
import type { Skill } from '@/types/skill';

export interface UseAgentOptions {
  model?: string;
  apiKey?: string;
  enableTools?: boolean;
  enableMCP?: boolean;
  enableSkillRouting?: boolean;
  maxIterations?: number;
  skills?: Skill[];
}

export function useAgent(options: UseAgentOptions = {}) {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [activatedSkill, setActivatedSkill] = useState<Skill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const agentRef = useRef<AgentEngine | null>(null);
  const runningRef = useRef(false);

  const getAgent = useCallback(() => {
    if (!agentRef.current) {
      agentRef.current = new AgentEngine({
        model: options.model,
        apiKey: options.apiKey,
        enableTools: options.enableTools,
        enableMCP: options.enableMCP,
        enableSkillRouting: options.enableSkillRouting,
        maxIterations: options.maxIterations,
      });
      agentRef.current.onStep((step) => {
        setSteps(prev => [...prev, step]);
      });
      agentRef.current.onStatus(setStatus);
    }
    return agentRef.current;
  }, [options.model, options.apiKey, options.enableTools, options.enableMCP, options.enableSkillRouting, options.maxIterations]);

  const run = useCallback(async (userPrompt: string, inputSkills?: Skill[]) => {
    if (runningRef.current) return;
    runningRef.current = true;

    const agent = getAgent();
    agent.reset();
    setSteps([]);
    setError(null);
    setActivatedSkill(null);

    const skillsToUse = inputSkills || options.skills || [];

    try {
      const generator = agent.run(
        userPrompt,
        skillsToUse,
        async (messages, config) => {
          await streamChat(
            options.model || 'gpt-3.5-turbo',
            messages as Message[],
            config as LLMConfig & { onChunk: (content: string) => void }
          );
        }
      );

      setActivatedSkill(agent.getActivatedSkill());

      for await (const _step of generator) {
        setActivatedSkill(agent.getActivatedSkill());
      }

      setActivatedSkill(agent.getActivatedSkill());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Agent 执行出错';
      setError(errorMessage);
      setStatus('error');
    } finally {
      runningRef.current = false;
    }
  }, [getAgent, options.model, options.skills]);

  const stop = useCallback(() => {
    runningRef.current = false;
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    runningRef.current = false;
    agentRef.current?.reset();
    setSteps([]);
    setStatus('idle');
    setError(null);
    setActivatedSkill(null);
  }, []);

  useEffect(() => {
    return () => {
      runningRef.current = false;
    };
  }, []);

  return {
    steps,
    status,
    error,
    activatedSkill,
    run,
    stop,
    reset,
    isRunning: status === 'routing' || status === 'thinking' || status === 'tool_calling' || status === 'executing',
  };
}

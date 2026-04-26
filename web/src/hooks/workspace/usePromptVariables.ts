'use client';

import { useMemo } from 'react';

interface Variable {
  name: string;
  value: string;
  type: string;
}

export function usePromptVariables() {
  const extractVariablesFromPrompt = useMemo(() => {
    return (promptText: string): Variable[] => {
      const regex = /\{\{(\w+)\}\}/g;
      const matches = promptText.matchAll(regex);
      const foundNames = new Set<string>();

      for (const match of matches) {
        foundNames.add(match[1]);
      }

      return Array.from(foundNames).map(name => ({
        name,
        value: '',
        type: 'text',
      }));
    };
  }, []);

  const applyVariablesToPrompt = useMemo(() => {
    return (prompt: string, variables: Variable[]): string => {
      let result = prompt;
      variables.forEach(v => {
        result = result.replace(new RegExp(`{{${v.name}}}`, 'g'), v.value);
      });
      return result;
    };
  }, []);

  const mergeNewVariables = useMemo(() => {
    return (existingVars: Variable[], newVars: Variable[]): Variable[] => {
      const existingNames = new Set(existingVars.map(v => v.name));
      const varsToAdd = newVars.filter(v => !existingNames.has(v.name));
      return varsToAdd.length > 0 ? [...existingVars, ...varsToAdd] : existingVars;
    };
  }, []);

  return {
    extractVariablesFromPrompt,
    applyVariablesToPrompt,
    mergeNewVariables,
  };
}

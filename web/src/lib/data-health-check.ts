import type { Skill } from '@/types/skill';

export interface DataHealthReport {
  totalSkills: number;
  issues: Array<{
    skillId: string;
    skillName: string;
    severity: 'error' | 'warning';
    type: string;
    message: string;
  }>;
  summary: {
    errors: number;
    warnings: number;
  };
}

export function runDataHealthCheck(skills: Skill[]): DataHealthReport {
  const report: DataHealthReport = {
    totalSkills: skills.length,
    issues: [],
    summary: { errors: 0, warnings: 0 }
  };

  if (process.env.NODE_ENV !== 'development') {
    return report;
  }

  skills.forEach((skill, index) => {
    const skillId = skill.id || `index-${index}`;
    const skillName = skill.name || `Unknown-${index}`;

    const hasSystemPromptCamel = skill.systemPrompt && skill.systemPrompt.length > 100;
    const hasSystemPromptUnderscore = skill.system_prompt && skill.system_prompt.length > 100;

    if (!hasSystemPromptCamel && !hasSystemPromptUnderscore) {
      report.issues.push({
        skillId,
        skillName,
        severity: 'error',
        type: 'MISSING_SYSTEM_PROMPT',
        message: `缺少有效的系统提示词（长度 < 100）`
      });
      report.summary.errors++;
    } else if (hasSystemPromptCamel && !hasSystemPromptUnderscore) {
      report.issues.push({
        skillId,
        skillName,
        severity: 'warning',
        type: 'FIELD_MISMATCH',
        message: `只有驼峰式 systemPrompt，缺少下划线式 system_prompt（建议同时写入）`
      });
      report.summary.warnings++;
    }

    if (!skill.guide || skill.guide.length < 50) {
      report.issues.push({
        skillId,
        skillName,
        severity: 'warning',
        type: 'SHORT_GUIDE',
        message: `使用指南过短（建议 > 50 字）`
      });
      report.summary.warnings++;
    }

    if (!skill.scenarios || !Array.isArray(skill.scenarios) || skill.scenarios.length === 0) {
      report.issues.push({
        skillId,
        skillName,
        severity: 'warning',
        type: 'MISSING_SCENARIOS',
        message: `缺少适用场景列表`
      });
      report.summary.warnings++;
    }
  });

  return report;
}

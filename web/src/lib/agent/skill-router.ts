import type { Skill } from '@/types/skill';

export interface RoutingResult {
  skillId: string | null;
  confidence: number;
  reason: string;
  variables: Record<string, string>;
}

export class SkillIntentRouter {
  private skills: Map<string, Skill> = new Map();

  registerSkills(skills: Skill[]) {
    skills.forEach(skill => {
      this.skills.set(skill.id, skill);
    });
  }

  async routeIntent(userInput: string, systemPrompt?: string): Promise<RoutingResult> {
    const matches: Array<{ skillId: string; score: number; keywords: string[] }> = [];

    for (const [skillId, skill] of this.skills.entries()) {
      let score = 0;
      const matchedKeywords: string[] = [];

      const searchText = (userInput + ' ' + (systemPrompt || '')).toLowerCase();

      const skillKeywords = [
        skill.name,
        ...(skill.category?.split('/') || []),
        ...(skill.tags || []),
      ];

      for (const keyword of skillKeywords) {
        if (keyword && searchText.includes(keyword.toLowerCase())) {
          score += 15;
          matchedKeywords.push(keyword);
        }
      }

      if (skill.prompt) {
        const promptWords = skill.prompt.toLowerCase().split(/\s+/).slice(0, 30);
        const inputWords = searchText.split(/\s+/);
        const intersection = promptWords.filter(w => inputWords.includes(w) && w.length > 2);
        score += intersection.length * 3;
      }

      if (score >= 15) {
        matches.push({ skillId, score, keywords: matchedKeywords });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    if (matches.length > 0 && matches[0].score >= 20) {
      const best = matches[0];
      const skill = this.skills.get(best.skillId);
      
      return {
        skillId: best.skillId,
        confidence: Math.min(best.score / 100, 0.95),
        reason: `匹配到关键词: ${best.keywords.join(', ')}`,
        variables: this.extractVariables(userInput, skill),
      };
    }

    return {
      skillId: null,
      confidence: 0,
      reason: '未匹配到特定 Skill，使用通用模式',
      variables: {},
    };
  }

  private extractVariables(userInput: string, skill?: Skill): Record<string, string> {
    const variables: Record<string, string> = {};
    
    if (!skill?.prompt) return variables;

    const varMatches = skill.prompt.match(/\{\{(\w+)\}\}/g);
    if (varMatches) {
      varMatches.forEach(match => {
        const varName = match.replace(/[{}]/g, '');
        variables[varName] = '';
      });
    }

    return variables;
  }

  buildPromptWithSkill(
    userInput: string,
    skill: Skill,
    variables: Record<string, string>
  ): string {
    let skillPrompt = skill.prompt || '';
    
    for (const [name, value] of Object.entries(variables)) {
      if (value) {
        skillPrompt = skillPrompt.replace(new RegExp(`\\{\\{${name}\\}\\}`, 'g'), value);
      }
    }

    return `
## 已激活 Skill: ${skill.name}

${skill.description || ''}

---

## Skill 系统提示词:
${skillPrompt}

---

## 用户输入
${userInput}

请使用上面的 Skill 设定来处理用户请求。
`;
  }
}

export const skillRouter = new SkillIntentRouter();

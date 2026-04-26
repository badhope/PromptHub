import { PrismaClient } from '@prisma/client';
import type { Skill } from '@/types/skill';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export interface DbSkill {
  id: string;
  name: string;
  number?: string | null;
  index?: number | null;
  icon: string;
  category: string;
  description: string;
  guide?: string;
  scenarios?: string | null;
  activation?: string;
  source: string;
  systemPrompt?: string | null;
  useCount: number;
  rawUrl?: string | null;
  metadata?: string | null;
  categorization?: string | null;
  content?: string | null;
  stats?: string | null;
  thumbnails?: string | null;
  capabilities?: string | null;
  contentMarkdown?: string | null;
  system_prompt?: string | null;
}

interface SkillEntity {
  id?: string;
  name?: string;
  number?: string;
  category?: string;
  content?: { content_markdown?: string };
  activation_command?: { content_markdown?: string };
  systemPrompt?: string;
  system_prompt?: string;
  [key: string]: unknown;
}

export function skillDbToEntity(dbSkill: DbSkill): Skill {
  const nullToUndefined = <T>(val: T | null | undefined): T | undefined => {
    return val ?? undefined;
  };

  return {
    id: dbSkill.id,
    name: dbSkill.name,
    number: nullToUndefined(dbSkill.number),
    index: nullToUndefined(dbSkill.index),
    icon: dbSkill.icon,
    category: dbSkill.category,
    description: dbSkill.description,
    guide: dbSkill.guide,
    scenarios: dbSkill.scenarios ? JSON.parse(dbSkill.scenarios) : [],
    activation: dbSkill.activation,
    source: dbSkill.source as 'skill' | 'tool',
    systemPrompt: nullToUndefined(dbSkill.systemPrompt),
    useCount: dbSkill.useCount,
    rawUrl: nullToUndefined(dbSkill.rawUrl),
    metadata: dbSkill.metadata ? JSON.parse(dbSkill.metadata) : {},
    categorization: dbSkill.categorization ? JSON.parse(dbSkill.categorization) : {},
    content: dbSkill.content ? JSON.parse(dbSkill.content) : {},
    stats: dbSkill.stats ? JSON.parse(dbSkill.stats) : { rating: 0, use_count: 0, favorite_count: 0, share_count: 0, view_count: 0, rating_count: 0 },
    thumbnails: dbSkill.thumbnails ? JSON.parse(dbSkill.thumbnails) : {},
    capabilities: dbSkill.capabilities ? JSON.parse(dbSkill.capabilities) : {},
    system_prompt: nullToUndefined(dbSkill.systemPrompt),
    activation_command: dbSkill.contentMarkdown ? { content_markdown: dbSkill.contentMarkdown } : undefined,
  };
}

export function skillEntityToDb(skill: Partial<SkillEntity>): Record<string, unknown> {
  const safeStringify = (val: unknown): string => {
    if (!val) return '{}';
    try {
      return JSON.stringify(val);
    } catch {
      return '{}';
    }
  };

  const safeString = (val: unknown): string | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    try {
      return JSON.stringify(val);
    } catch {
      return null;
    }
  };

  const extractMarkdown = (): string | null => {
    if (skill.content?.content_markdown) return skill.content.content_markdown;
    if (skill.activation_command?.content_markdown) return skill.activation_command.content_markdown;
    if (skill.systemPrompt) return skill.systemPrompt;
    if (skill.system_prompt) return skill.system_prompt;
    return null;
  };

  return {
    id: String(skill.id ?? ''),
    name: String(skill.name ?? ''),
    number: skill.number ? String(skill.number) : null,
    index: typeof skill.index === 'number' ? skill.index : null,
    icon: skill.icon ? String(skill.icon) : null,
    category: skill.category ? String(skill.category) : null,
    description: skill.description ? String(skill.description) : null,
    guide: skill.guide ? String(skill.guide) : null,
    scenarios: JSON.stringify(skill.scenarios || []),
    activation: safeString(skill.activation),
    source: skill.source ? String(skill.source) : 'skill',
    systemPrompt: safeString(skill.systemPrompt || skill.system_prompt),
    useCount: typeof skill.useCount === 'number' ? skill.useCount : 0,
    rawUrl: skill.rawUrl ? String(skill.rawUrl) : null,
    metadata: safeStringify(skill.metadata),
    categorization: safeStringify(skill.categorization),
    content: safeStringify(skill.content),
    stats: safeStringify(skill.stats),
    thumbnails: safeStringify(skill.thumbnails),
    capabilities: safeStringify(skill.capabilities),
    contentMarkdown: extractMarkdown(),
  };
}

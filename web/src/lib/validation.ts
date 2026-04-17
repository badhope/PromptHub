import { z } from 'zod';
import type { SkillId, CategoryId } from '@/types/type-utils';

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().default('professional'),
  description: z.string().optional(),
  systemPrompt: z.string().optional(),
  useCount: z.number().int().nonnegative().default(0),
  metadata: z.object({
    title: z.string(),
    short_description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
  stats: z.object({
    rating: z.number().default(0),
    use_count: z.number().default(0),
    favorite_count: z.number().default(0),
  }).optional(),
});

export const FavoritesSchema = z.array(z.string()).default([]);
export const CompareIdsSchema = z.array(z.string()).default([]);

export function validateSkill(data: unknown) {
  const result = SkillSchema.safeParse(data);
  if (!result.success) {
    console.warn('Skill validation failed:', result.error.issues);
  }
  return result;
}

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown, fallback: T): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : fallback;
}

export function getValidatedFavorites(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return safeParse(FavoritesSchema, JSON.parse(raw), []);
  } catch {
    return [];
  }
}

export function getValidatedCompareIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('compare-skills');
    if (!raw) return [];
    return safeParse(CompareIdsSchema, JSON.parse(raw), []);
  } catch {
    return [];
  }
}

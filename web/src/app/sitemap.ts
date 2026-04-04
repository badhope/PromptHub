import type { MetadataRoute } from 'next'
import skillsData from '@/skills-data.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://badhope.github.io/mobile-skills'
  
  const { skills } = skillsData as any

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/skills/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...skills.map((skill: any) => ({
      url: `${baseUrl}/skills/${skill.id}/`,
      lastModified: new Date(skill.metadata.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  ]
}

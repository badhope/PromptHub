import type { MetadataRoute } from 'next'
import { getSkillsData } from '@/lib/skills-data-server'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://badhope.github.io/mobile-skills'
  
  const { skills, categories } = getSkillsData()

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/skills/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/favorites/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/settings/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ]

  const categoryPages = Object.keys(categories || {}).map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  const skillPages = (skills || []).map((skill) => ({
    url: `${baseUrl}/skills/${skill.id}/`,
    lastModified: new Date(skill.metadata?.updated_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))

  return [...staticPages, ...categoryPages, ...skillPages]
}

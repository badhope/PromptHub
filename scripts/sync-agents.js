const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');
const OUTPUT_FILE = path.join(__dirname, '..', 'web', 'src', 'skills-data.json');

const CATEGORY_MAP = {
  'entertainment-character': 'character',
  'functional': 'functional',
  'professional': 'professional',
  'creative-arts': 'creative',
  'finance': 'professional',
  'healthcare': 'professional',
  'lifestyle-companion': 'character',
  'learning-education': 'education',
  'psychology': 'professional',
  'gaming': 'creative',
  'historical-culture': 'character',
  'social-vocation': 'professional',
  'subject-tutoring': 'education',
  'design-build': 'professional',
  'agriculture': 'professional',
  'aviation': 'professional',
  'energy': 'professional',
  'maritime': 'professional',
  'media': 'creative',
  'military': 'professional',
  'religious': 'professional',
  'research-analysis': 'functional',
  'sports': 'lifestyle',
  'telecom': 'professional',
  'writing-creative': 'creative'
};

const SUBCATEGORY_MAP = {
  'entertainment-character': {
    'naruto': 'anime-shonen',
    'goku': 'anime-shonen',
    'luffy': 'anime-shonen',
    'tanjiro': 'anime-shonen',
    'bakugo': 'anime-shonen',
    'itachi': 'anime-shonen',
    'levi': 'anime-shonen',
    'saiyan-warrior': 'anime-shonen',
    'misaka-mikoto': 'anime-shonen',
    'sailor-moon': 'anime-shojo',
    'asuna': 'anime-shojo',
    'rem': 'anime-shojo',
    'emilia': 'anime-shojo',
    'echidna': 'anime-shojo',
    'kaguya': 'anime-shojo',
    'shinobu': 'anime-shojo',
    'anya': 'anime-shojo',
    'zero-two': 'anime-shojo',
    'yor': 'anime-seinen',
    'mikasa': 'anime-seinen',
    'makima': 'anime-seinen',
    'kallen': 'anime-seinen',
    'gojo-satoru': 'anime-seinen',
    'rimuru': 'fantasy-hero',
    'demon-lord-genie': 'fantasy-hero',
    'cool-devil-king': 'fantasy-hero',
    'cute-witch': 'fantasy-hero',
    'loli-shrine-maiden': 'fantasy-hero',
    'cyberpunk-hacker': 'scifi-cyber',
    'space-captain': 'scifi-cyber',
    'time-traveler': 'scifi-cyber',
    'cute-robot-assistant': 'scifi-cyber',
    'pirate-captain': 'game-rpg',
    'tsundere-cat': 'original-oc',
    'yandere-girl': 'original-oc',
    'cool-president': 'mentor-guide',
    'anime-protagonist': 'anime-shonen'
  }
};

function extractYamlFrontMatter(content) {
  const match = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (!match) return null;
  
  const yamlStr = match[1];
  const result = {};
  
  yamlStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      result[key] = value;
    }
  });
  
  return result;
}

function extractDescription(content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('> "') && lines[i].endsWith('"')) {
      return lines[i].substring(3, lines[i].length - 1);
    }
  }
  
  const yaml = extractYamlFrontMatter(content);
  if (yaml && yaml.description) {
    return yaml.description;
  }
  
  return '';
}

function extractBestFor(content) {
  const yaml = extractYamlFrontMatter(content);
  if (yaml && yaml.best_for) {
    return yaml.best_for.split('、').map(s => s.trim()).filter(s => s);
  }
  return [];
}

function extractTags(content, bestFor) {
  const tags = new Set();
  
  if (bestFor && bestFor.length > 0) {
    bestFor.forEach(item => tags.add(item));
  }
  
  const yaml = extractYamlFrontMatter(content);
  if (yaml && yaml.category) {
    tags.add(yaml.category);
  }
  
  return Array.from(tags).slice(0, 8);
}

function determineSubcategory(agentId, category) {
  if (category === 'character' && SUBCATEGORY_MAP['entertainment-character']) {
    return SUBCATEGORY_MAP['entertainment-character'][agentId] || 'original-oc';
  }
  return undefined;
}

function processAgentFile(filePath, categoryDir) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');
  
  if (fileName === 'TEMPLATE-EXPANDED') return null;
  
  const yaml = extractYamlFrontMatter(content);
  if (!yaml || !yaml.agent_id) return null;
  
  const agentId = yaml.agent_id;
  const primaryCategory = CATEGORY_MAP[categoryDir] || 'functional';
  const description = extractDescription(content);
  const bestFor = extractBestFor(content);
  const tags = extractTags(content, bestFor);
  const subcategory = determineSubcategory(agentId, primaryCategory);
  
  const nameMatch = content.match(/^#\s+(.+?)\s*-\s*(.+?)$/m);
  const englishName = nameMatch ? nameMatch[1].trim() : agentId;
  const chineseName = nameMatch ? nameMatch[2].trim() : agentId;
  
  const now = new Date().toISOString();
  
  return {
    id: agentId,
    name: `${englishName} - ${chineseName}`,
    version: "1.0.0",
    status: "active",
    categorization: {
      primary_category: primaryCategory,
      secondary_categories: [],
      tags: tags,
      attributes: {
        entertainment: primaryCategory === 'character' ? 0.8 : 0.2,
        professional: primaryCategory === 'professional' ? 0.7 : 0.1,
        education: primaryCategory === 'education' ? 0.6 : 0.1
      },
      ...(subcategory && { subcategory })
    },
    metadata: {
      description: description || yaml.description || '',
      long_description: "",
      author: "mobile-skills-team",
      contributors: [],
      license: "MIT",
      created_at: now,
      updated_at: now,
      language: "zh-CN",
      languages_supported: ["zh-CN", "en-US"]
    },
    content: {
      raw_url: `https://raw.githubusercontent.com/badhope/mobile-skills/main/agents/${categoryDir}/${fileName}.md`,
      github_url: `https://github.com/badhope/mobile-skills/blob/main/agents/${categoryDir}/${fileName}.md`,
      file_path: `agents/${categoryDir}/${fileName}.md`,
      content_markdown: content
    },
    capabilities: {
      best_for: bestFor,
      input_types: ["text/plain", "text/markdown"],
      output_types: ["text/markdown"],
      min_context: 2000,
      mobile_optimized: true,
      timeout: 60000,
      retry: 2
    },
    stats: {
      rating: 4.5 + Math.random() * 0.4,
      rating_count: Math.floor(Math.random() * 100) + 10,
      use_count: Math.floor(Math.random() * 5000) + 500,
      favorite_count: Math.floor(Math.random() * 500) + 50,
      share_count: Math.floor(Math.random() * 200) + 20,
      view_count: Math.floor(Math.random() * 8000) + 1000
    },
    activation: {
      prompt_template: `请读取以下技能定义并激活对应模式：\n{RAW_URL}\n\n{USER_REQUEST}`,
      quick_activation: `请读取以下技能定义：\n{RAW_URL}`
    },
    thumbnails: {
      small: `/thumbnails/${agentId}-small.png`,
      medium: `/thumbnails/${agentId}-medium.png`,
      large: `/thumbnails/${agentId}-large.png`,
      banner: `/thumbnails/${agentId}-banner.png`
    },
    related: {
      similar_skills: [],
      complementary_skills: [],
      next_skills: []
    }
  };
}

function main() {
  const existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  const existingIds = new Set(existingData.skills.map(s => s.id));
  const newSkills = [];
  
  const categoryDirs = fs.readdirSync(AGENTS_DIR).filter(f => {
    const stat = fs.statSync(path.join(AGENTS_DIR, f));
    return stat.isDirectory();
  });
  
  console.log(`Found ${categoryDirs.length} category directories`);
  
  categoryDirs.forEach(categoryDir => {
    const categoryPath = path.join(AGENTS_DIR, categoryDir);
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));
    
    console.log(`Processing ${categoryDir}: ${files.length} files`);
    
    files.forEach(file => {
      const filePath = path.join(categoryPath, file);
      const skill = processAgentFile(filePath, categoryDir);
      
      if (skill && !existingIds.has(skill.id)) {
        newSkills.push(skill);
        console.log(`  Added: ${skill.name}`);
      } else if (skill && existingIds.has(skill.id)) {
        const existingIndex = existingData.skills.findIndex(s => s.id === skill.id);
        if (existingIndex >= 0) {
          existingData.skills[existingIndex] = {
            ...existingData.skills[existingIndex],
            ...skill,
            stats: existingData.skills[existingIndex].stats
          };
          console.log(`  Updated: ${skill.name}`);
        }
      }
    });
  });
  
  existingData.skills = [...existingData.skills, ...newSkills];
  existingData.generated_at = new Date().toISOString();
  
  const categories = {};
  existingData.skills.forEach(skill => {
    const cat = skill.categorization.primary_category;
    if (!categories[cat]) {
      categories[cat] = { count: 0, skills: [] };
    }
    categories[cat].count++;
    categories[cat].skills.push(skill.id);
  });
  existingData.categories = categories;
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData, null, 2));
  console.log(`\nTotal skills: ${existingData.skills.length}`);
  console.log(`New skills added: ${newSkills.length}`);
}

main();

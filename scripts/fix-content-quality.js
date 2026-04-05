const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'web', 'src', 'skills-data.json');

const SUBCATEGORY_MAP = {
  'gojo-satoru': 'anime-seinen',
  'kaguya': 'anime-shojo',
  'naruto': 'anime-shonen',
  'goku': 'anime-shonen',
  'luffy': 'anime-shonen',
  'tanjiro': 'anime-shonen',
  'bakugo': 'anime-shonen',
  'itachi': 'anime-shonen',
  'levi': 'anime-shonen',
  'saiyan-warrior': 'anime-shonen',
  'misaka-mikoto': 'anime-shonen',
  'asuna': 'anime-shojo',
  'rem': 'anime-shojo',
  'emilia': 'anime-shojo',
  'echidna': 'anime-shojo',
  'shinobu': 'anime-shojo',
  'anya': 'anime-shojo',
  'zero-two': 'anime-shojo',
  'yor': 'anime-seinen',
  'mikasa': 'anime-seinen',
  'makima': 'anime-seinen',
  'kallen': 'anime-seinen',
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
};

const FICTION_SUBCATEGORY_MAP = {
  'eastern-fantasy': 'eastern-fantasy',
  'western-fantasy': 'western-fantasy',
  'scifi-galaxy': 'scifi',
  'apocalypse-survival': 'apocalypse',
  'mystery-detective': 'mystery',
  'urban-supernatural': 'urban',
  'wuxia-jianghu': 'wuxia',
  'xianxia-realm': 'xianxia',
  'magic-academy': 'magic',
  'cyberpunk-city': 'scifi',
  'ghost-supernatural': 'horror'
};

function cleanDescription(desc) {
  if (!desc) return '';
  
  if (desc.startsWith('>') || desc.startsWith('#') || desc.includes('CRITICAL')) {
    return '';
  }
  
  return desc.replace(/[`*_#]/g, '').trim();
}

function extractDescriptionFromMarkdown(markdown) {
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('description:')) {
      const desc = line.replace('description:', '').trim();
      return cleanDescription(desc);
    }
  }
  
  for (const line of lines) {
    if (line.startsWith('> "') && line.endsWith('"')) {
      return line.substring(3, line.length - 1).trim();
    }
    if (line.startsWith('> \"') && line.endsWith('\"')) {
      return line.substring(3, line.length - 1).trim();
    }
  }
  
  const yamlMatch = markdown.match(/```yaml[\s\S]*?description:\s*(.+?)[\n\r]/);
  if (yamlMatch) {
    return cleanDescription(yamlMatch[1].trim());
  }
  
  return '';
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  let fixedCount = 0;
  let subcategoryAdded = 0;
  
  data.skills = data.skills.map(skill => {
    let modified = false;
    
    if (skill.categorization.primary_category === 'character') {
      const subcategory = SUBCATEGORY_MAP[skill.id];
      if (subcategory && !skill.categorization.subcategory) {
        skill.categorization.subcategory = subcategory;
        subcategoryAdded++;
        modified = true;
      }
    }
    
    if (skill.categorization.primary_category === 'fiction') {
      const subcategory = FICTION_SUBCATEGORY_MAP[skill.id];
      if (subcategory && !skill.categorization.subcategory) {
        skill.categorization.subcategory = subcategory;
        subcategoryAdded++;
        modified = true;
      }
    }
    
    if (skill.metadata.description.startsWith('>') || 
        skill.metadata.description.includes('CRITICAL') ||
        skill.metadata.description.startsWith('#')) {
      const newDesc = extractDescriptionFromMarkdown(skill.content.content_markdown || '');
      if (newDesc) {
        skill.metadata.description = newDesc;
        fixedCount++;
        modified = true;
      }
    }
    
    if (modified) {
      console.log(`Fixed: ${skill.name}`);
    }
    
    return skill;
  });
  
  data.generated_at = new Date().toISOString();
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  console.log(`\n=== Summary ===`);
  console.log(`Total skills: ${data.skills.length}`);
  console.log(`Descriptions fixed: ${fixedCount}`);
  console.log(`Subcategories added: ${subcategoryAdded}`);
}

main();

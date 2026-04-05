const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../web/src/skills-data.json');

function extractBestFor(markdown) {
  const match = markdown.match(/best_for:\s*\n([\s\S]*?)(?=\n\n|\nkeywords:)/);
  if (match) {
    const items = match[1].match(/-\s+(.+)/g);
    if (items) {
      return items.map(item => item.replace(/-\s+/, '').trim());
    }
  }
  return [];
}

function extractKeywords(markdown) {
  const match = markdown.match(/keywords:\s*\n([\s\S]*?)(?=\n\n|\nactivation:)/);
  if (match) {
    const items = match[1].match(/-\s+(.+)/g);
    if (items) {
      return items.map(item => item.replace(/-\s+/, '').trim());
    }
  }
  return [];
}

function extractDescription(markdown) {
  const match = markdown.match(/description:\s*(.+)/);
  if (match) {
    return match[1].trim();
  }
  return '';
}

function main() {
  console.log('🔧 修复技能数据...');
  
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  let fixed = 0;
  
  for (const skill of data.skills) {
    const markdown = skill.content?.content_markdown || '';
    
    if (skill.capabilities && skill.capabilities.best_for && skill.capabilities.best_for.length === 0) {
      const bestFor = extractBestFor(markdown);
      if (bestFor.length > 0) {
        skill.capabilities.best_for = bestFor;
        fixed++;
        console.log(`✅ 修复 best_for: ${skill.id}`);
      }
    }
    
    if (skill.categorization && skill.categorization.tags && skill.categorization.tags.length === 0) {
      const keywords = extractKeywords(markdown);
      if (keywords.length > 0) {
        skill.categorization.tags = keywords;
        console.log(`✅ 修复 tags: ${skill.id}`);
      }
    }
    
    if (!skill.metadata.description || skill.metadata.description === '') {
      const desc = extractDescription(markdown);
      if (desc) {
        skill.metadata.description = desc;
        console.log(`✅ 修复 description: ${skill.id}`);
      }
    }
  }
  
  data.generated_at = new Date().toISOString();
  
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n🎉 完成！修复了 ${fixed} 个技能数据`);
}

main();

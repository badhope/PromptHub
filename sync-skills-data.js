const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'web/src/skills-data.json');
const publicPath = path.join(__dirname, 'web/public/skills.json');
const summaryPath = path.join(__dirname, 'web/src/skills-summary.json');

const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

fs.writeFileSync(publicPath, JSON.stringify(data, null, 2));

const summaries = data.skills.map(skill => ({
  id: skill.id,
  name: skill.name,
  skill_number: skill.skill_number,
  category: skill.category,
  subcategory: skill.subcategory,
  description: skill.metadata.description,
  avatar: skill.avatar,
  tags: skill.metadata.tags,
  rating: skill.stats.rating,
  usage_count: skill.stats.usage_count
}));

const categories = {};
data.skills.forEach(skill => {
  if (!categories[skill.category]) {
    categories[skill.category] = {};
  }
  if (!categories[skill.category][skill.subcategory]) {
    categories[skill.category][skill.subcategory] = [];
  }
  categories[skill.category][skill.subcategory].push(skill.id);
});

fs.writeFileSync(summaryPath, JSON.stringify({ summaries, categories }, null, 2));

console.log('已同步到:');
console.log('- web/public/skills.json');
console.log('- web/src/skills-summary.json');

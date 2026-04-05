const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'web', 'src', 'skills-data.json');

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  let fixedCount = 0;
  
  data.skills = data.skills.map(skill => {
    let modified = false;
    
    if (skill.categorization.secondary_categories && 
        skill.categorization.secondary_categories.length > 0 &&
        !skill.categorization.subcategory) {
      const subcat = skill.categorization.secondary_categories[0];
      skill.categorization.subcategory = subcat;
      skill.categorization.secondary_categories = [];
      modified = true;
    }
    
    if (skill.metadata.description && skill.metadata.description.startsWith('> **')) {
      const match = skill.metadata.description.match(/\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match) {
        skill.metadata.description = match[2].trim();
        modified = true;
      }
    }
    
    if (modified) {
      fixedCount++;
      console.log(`Fixed: ${skill.name}`);
    }
    
    return skill;
  });
  
  data.generated_at = new Date().toISOString();
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  console.log(`\n=== Summary ===`);
  console.log(`Total skills: ${data.skills.length}`);
  console.log(`Fixed: ${fixedCount}`);
}

main();

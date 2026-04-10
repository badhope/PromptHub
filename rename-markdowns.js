const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, 'web/src/skills');
const files = fs.readdirSync(skillsDir);

let renamedCount = 0;

files.forEach(file => {
  if (file.includes('-v5')) {
    const oldPath = path.join(skillsDir, file);
    const newFile = file.replace('-v5', '');
    const newPath = path.join(skillsDir, newFile);
    fs.renameSync(oldPath, newPath);
    console.log(`重命名: ${file} -> ${newFile}`);
    renamedCount++;
  }
});

console.log(`\n完成重命名 ${renamedCount} 个Markdown文件！`);

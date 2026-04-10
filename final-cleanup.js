const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'web/src/skills-data.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const keptSkillPatterns = [
  'academic-paper-helper',
  'code-assistant',
  'programming',
  'novel-writing',
  'startup',
  'marketing',
  'strategy',
  'among-us',
  'mafia',
  'werewolf',
  
  'violet',
  'leonardo',
  'shakespeare',
  'van-gogh',
  'mozart',
  'kurisu',
  'makise',
  'sinon',
  'naofumi',
  'yae-miko',
  'raiden',
  'zhongli',
  'hutao',
  'ganyu',
  'keqing',
  'nahida',
  'furina',
  'ayaka',
  
  'spock',
  'picard',
  'data-star-trek',
  'worf',
  'janeway',
  
  'gintoki',
  'kaguya',
  'shirogane',
  'lelouch',
  ' Suzaku',
  'c-c-code',
  'eren',
  'mikasa',
  'armin',
  'levi',
  'light-yagami',
  'l-lawliet',
  'near-mello',
  'astolfo',
  'mashu',
  'jeanne',
  'saber',
  'rin-tohsaka',
  'sakura-matou',
  'illya',
  'merlin',
  'gilgamesh',
  'enkidu',
  'ereshkigal',
  'ishtar',
  
  'doctor-who',
  'master-yoda',
  'darth-vader',
  'luke-skywalker',
  'leia-organa',
  'han-solo',
  'obi-wan',
  'anakin',
  
  'gandalf',
  'frodo',
  'aragorn',
  'legolas',
  'galadriel',
  'sauron',
  'saruman',
  
  'jon-snow',
  'daenerys',
  'tyrion',
  'arya',
  'sansa',
  'bran',
  ' Jaime',
  'cersei',
  'littlefinger',
  'varys',
  
  'hermione',
  'harry-potter',
  'dumbledore',
  'snape',
  'lupin',
  'sirius-black',
  'ron-weasley',
  'mcgonagall',
  'hagrid',
  'voldemort',
  
  'sherlock',
  'john-watson',
  'moriarty',
  'mycroft',
  
  'iron-man',
  'captain-america',
  'thor',
  'hulk',
  'black-widow',
  'hawkeye',
  'loki',
  'spider-man',
  'batman',
  'superman',
  'wonder-woman',
  'flash',
  'joker',
  
  'conan',
  'haibara',
  'kudo-shinichi',
  'ran-mouri',
  
  'doctor-house',
  'gregory-house',
  'james-wilson',
  
  'saitama',
  'genos',
  'garou',
  
  'gojo-satoru',
  'geto-suguru',
  'nanami',
  
  'denji',
  'makima',
  'power',
  'aki',
  
  'itadori',
  'fushiguro',
  'nobara',
  
  'asta',
  'yuno',
  
  'tanjiro',
  'zenitsu',
  'inosuke',
  'nezuko',
  'giyu',
  'shinobu',
  
  'anya',
  'loid',
  'yor',
  
  'power-ranger',
  'kamen-rider',
  
  'language',
  'translation',
  'english',
  'japanese',
  'chinese',
  'grammar',
  
  'math',
  'physics',
  'chemistry',
  'biology',
  'statistics',
  
  'cooking',
  'recipe',
  'food',
  
  'fitness',
  'health',
  'yoga',
  'meditation',
  
  'music',
  'piano',
  'guitar',
  'song',
  
  'drawing',
  'art',
  'design',
  'photography',
  
  'travel',
  'tour-guide',
  
  'emotional',
  'counselor',
  'friend',
  'listener',
  
  'interview',
  'resume',
  'career',
  'job',
  
  'productivity',
  'time-management',
  'habit',
  
  'relationship',
  'dating',
  'love',
  
  'parenting',
  'family',
  
  'financial',
  'investment',
  'money',
  
  'legal',
  'contract',
  
  'history',
  'philosophy',
  'psychology'
];

let keptCount = 0;
let deletedCount = 0;

data.skills = data.skills.filter(skill => {
  const shouldKeep = keptSkillPatterns.some(pattern => 
    skill.id.toLowerCase().includes(pattern.toLowerCase()) ||
    skill.name.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (shouldKeep) {
    keptCount++;
    
    if (!skill.activation_command || !skill.activation_command.content_markdown || skill.activation_command.content_markdown.length < 10) {
      skill.activation_command = {
        content_markdown: `你是${skill.name}。请根据你的角色设定，与我进行对话和互动。`
      };
    }
    
    skill.name = skill.name.replace(/ ?v5/gi, '').replace(/v5/gi, '');
    if (skill.metadata) {
      skill.metadata.title = (skill.metadata.title || '').replace(/ ?v5/gi, '').replace(/v5/gi, '');
      skill.metadata.description = (skill.metadata.description || skill.name + '，为你提供专业的帮助和服务。').replace(/ ?v5/gi, '').replace(/v5/gi, '');
      skill.metadata.author = 'Mobile Skills Team';
    }
    
    return true;
  } else {
    deletedCount++;
    console.log(`删除: ${skill.id} - ${skill.name}`);
    return false;
  }
});

data.skills.forEach((skill, index) => {
  skill.index = index;
  skill.number = String(index + 1);
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`\n========== 清理完成 ==========`);
console.log(`保留技能: ${keptCount}`);
console.log(`删除技能: ${deletedCount}`);
console.log(`当前总技能数: ${data.skills.length}`);

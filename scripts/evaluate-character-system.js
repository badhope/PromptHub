const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../web/src/skills-data.json');

function analyzeCharacterSystem() {
  console.log('🎭 角色系统全面评价报告\n');
  console.log('='.repeat(80));

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const skills = data.skills;

  const characterSkills = skills.filter(s => s.categorization.primary_category === 'character');

  console.log('\n📊 基础统计');
  console.log('-'.repeat(80));
  console.log(`总技能数: ${skills.length}`);
  console.log(`角色型技能: ${characterSkills.length} (${(characterSkills.length / skills.length * 100).toFixed(1)}%)`);

  const subcategories = {};
  const tags = {};
  const sources = {};

  characterSkills.forEach(skill => {
    const subcat = skill.categorization.subcategory || 'unknown';
    subcategories[subcat] = (subcategories[subcat] || 0) + 1;

    skill.categorization.tags.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });

    if (skill.categorization.subcategory?.includes('anime')) {
      sources['anime'] = (sources['anime'] || 0) + 1;
    } else if (skill.categorization.subcategory?.includes('game')) {
      sources['game'] = (sources['game'] || 0) + 1;
    } else if (skill.categorization.subcategory?.includes('original')) {
      sources['original'] = (sources['original'] || 0) + 1;
    } else if (skill.categorization.subcategory?.includes('wuxia')) {
      sources['wuxia'] = (sources['wuxia'] || 0) + 1;
    } else if (skill.categorization.subcategory?.includes('scifi')) {
      sources['scifi'] = (sources['scifi'] || 0) + 1;
    } else {
      sources['other'] = (sources['other'] || 0) + 1;
    }
  });

  console.log('\n📂 角色分类统计');
  console.log('-'.repeat(80));
  const sortedSubcats = Object.entries(subcategories).sort((a, b) => b[1] - a[1]);
  sortedSubcats.forEach(([subcat, count]) => {
    const percentage = (count / characterSkills.length * 100).toFixed(1);
    console.log(`${subcat.padEnd(25)} ${count.toString().padStart(4)} 个 (${percentage}%)`);
  });

  console.log('\n🎨 角色来源统计');
  console.log('-'.repeat(80));
  Object.entries(sources).sort((a, b) => b[1] - a[1]).forEach(([source, count]) => {
    const percentage = (count / characterSkills.length * 100).toFixed(1);
    console.log(`${source.padEnd(25)} ${count.toString().padStart(4)} 个 (${percentage}%)`);
  });

  console.log('\n🏷️  热门标签 (Top 20)');
  console.log('-'.repeat(80));
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 20);
  sortedTags.forEach(([tag, count]) => {
    console.log(`${tag.padEnd(25)} ${count.toString().padStart(4)} 次`);
  });

  console.log('\n📈 质量评估');
  console.log('-'.repeat(80));
  
  const qualityMetrics = {
    hasDescription: 0,
    hasLongDescription: 0,
    hasRichTags: 0,
    hasHighRating: 0,
    hasHighUsage: 0,
    hasAIInstructions: 0
  };

  characterSkills.forEach(skill => {
    if (skill.metadata.description?.length > 20) qualityMetrics.hasDescription++;
    if (skill.metadata.long_description?.length > 100) qualityMetrics.hasLongDescription++;
    if (skill.categorization.tags?.length >= 3) qualityMetrics.hasRichTags++;
    if (skill.stats.rating > 4.0) qualityMetrics.hasHighRating++;
    if (skill.stats.use_count > 1000) qualityMetrics.hasHighUsage++;
    if (skill.content.content_markdown?.includes('AI角色增强指令')) qualityMetrics.hasAIInstructions++;
  });

  Object.entries(qualityMetrics).forEach(([metric, count]) => {
    const percentage = (count / characterSkills.length * 100).toFixed(1);
    console.log(`${metric.padEnd(25)} ${count.toString().padStart(4)} 个 (${percentage}%)`);
  });

  console.log('\n🎯 角色多样性分析');
  console.log('-'.repeat(80));

  const animeTypes = {};
  characterSkills.forEach(skill => {
    if (skill.categorization.subcategory?.includes('anime')) {
      const type = skill.categorization.subcategory;
      animeTypes[type] = (animeTypes[type] || 0) + 1;
    }
  });

  console.log('\n动漫角色类型:');
  Object.entries(animeTypes).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type.padEnd(20)} ${count} 个`);
  });

  const genderBalance = {
    male: 0,
    female: 0,
    unknown: 0
  };

  const femaleKeywords = ['少女', '女性', '女', '姐姐', '妹妹', '女王', '公主', '小姐', '娘', '女武神'];
  const maleKeywords = ['少年', '男性', '男', '哥哥', '弟弟', '王', '公子', '先生', '郎', '骑士'];

  characterSkills.forEach(skill => {
    const name = skill.name.toLowerCase();
    const desc = (skill.metadata.description || '').toLowerCase();
    const combined = name + ' ' + desc;

    if (femaleKeywords.some(k => combined.includes(k))) {
      genderBalance.female++;
    } else if (maleKeywords.some(k => combined.includes(k))) {
      genderBalance.male++;
    } else {
      genderBalance.unknown++;
    }
  });

  console.log('\n性别分布 (基于关键词推测):');
  Object.entries(genderBalance).forEach(([gender, count]) => {
    const percentage = (count / characterSkills.length * 100).toFixed(1);
    console.log(`  ${gender.padEnd(20)} ${count} 个 (${percentage}%)`);
  });

  console.log('\n⚠️  发现的问题');
  console.log('-'.repeat(80));

  const issues = [];

  const animeCount = sources['anime'] || 0;
  const animePercentage = (animeCount / characterSkills.length * 100).toFixed(1);
  if (animePercentage > 50) {
    issues.push(`1. 动漫角色占比过高 (${animePercentage}%)，缺乏多样性`);
  }

  const originalCount = sources['original'] || 0;
  const originalPercentage = (originalCount / characterSkills.length * 100).toFixed(1);
  if (originalPercentage < 10) {
    issues.push(`2. 原创角色占比过低 (${originalPercentage}%)，原创内容不足`);
  }

  const topSubcats = sortedSubcats.slice(0, 3);
  const topSubcatsPercentage = topSubcats.reduce((sum, [_, count]) => sum + count, 0) / characterSkills.length * 100;
  if (topSubcatsPercentage > 60) {
    issues.push(`3. 角色类型分布不均，前3种类型占比 ${topSubcatsPercentage.toFixed(1)}%`);
  }

  if (genderBalance.male > genderBalance.female * 2) {
    issues.push(`4. 性别比例失衡，男性角色过多 (男:女 = ${genderBalance.male}:${genderBalance.female})`);
  }

  const lowUsageCount = characterSkills.filter(s => s.stats.use_count < 100).length;
  if (lowUsageCount > characterSkills.length * 0.3) {
    issues.push(`5. 低使用率角色过多 (${lowUsageCount} 个使用次数 < 100)`);
  }

  if (issues.length === 0) {
    console.log('✅ 未发现明显问题');
  } else {
    issues.forEach(issue => console.log(issue));
  }

  console.log('\n💡 优化建议');
  console.log('-'.repeat(80));

  const suggestions = [];

  suggestions.push('1. 【多样性提升】');
  suggestions.push('   - 增加历史人物角色（如：李白、诸葛亮、达芬奇）');
  suggestions.push('   - 增加文学经典角色（如：孙悟空、林黛玉、福尔摩斯）');
  suggestions.push('   - 增加神话传说角色（如：宙斯、女娲、托尔）');
  suggestions.push('   - 增加现实职业角色（如：医生、律师、教师）');

  suggestions.push('\n2. 【原创内容】');
  suggestions.push('   - 开发原创IP角色系列');
  suggestions.push('   - 创建用户自定义角色工具');
  suggestions.push('   - 建立角色创作社区');

  suggestions.push('\n3. 【性别平衡】');
  suggestions.push('   - 增加女性角色数量');
  suggestions.push('   - 创建更多中性/非二元性别角色');
  suggestions.push('   - 优化角色性别标签系统');

  suggestions.push('\n4. 【类型丰富】');
  suggestions.push('   - 增加儿童向角色（适合青少年）');
  suggestions.push('   - 增加教育类角色（历史人物、科学家）');
  suggestions.push('   - 增加心理辅导角色（情感支持）');

  suggestions.push('\n5. 【质量提升】');
  suggestions.push('   - 为低使用率角色添加更丰富的背景故事');
  suggestions.push('   - 优化角色互动指令');
  suggestions.push('   - 添加角色关系网络');

  suggestions.push('\n6. 【用户体验】');
  suggestions.push('   - 添加角色推荐系统');
  suggestions.push('   - 实现角色收藏功能');
  suggestions.push('   - 开发角色对比功能');

  suggestions.forEach(s => console.log(s));

  console.log('\n📊 角色评分分布');
  console.log('-'.repeat(80));
  
  const ratingRanges = {
    '4.5-5.0': 0,
    '4.0-4.5': 0,
    '3.5-4.0': 0,
    '3.0-3.5': 0,
    '<3.0': 0
  };

  characterSkills.forEach(skill => {
    const rating = skill.stats.rating;
    if (rating >= 4.5) ratingRanges['4.5-5.0']++;
    else if (rating >= 4.0) ratingRanges['4.0-4.5']++;
    else if (rating >= 3.5) ratingRanges['3.5-4.0']++;
    else if (rating >= 3.0) ratingRanges['3.0-3.5']++;
    else ratingRanges['<3.0']++;
  });

  Object.entries(ratingRanges).forEach(([range, count]) => {
    const percentage = (count / characterSkills.length * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(count / characterSkills.length * 50));
    console.log(`${range.padEnd(10)} ${count.toString().padStart(4)} 个 (${percentage.padStart(5)}%) ${bar}`);
  });

  console.log('\n🏆 Top 10 最受欢迎角色');
  console.log('-'.repeat(80));
  
  const topCharacters = characterSkills
    .sort((a, b) => b.stats.use_count - a.stats.use_count)
    .slice(0, 10);

  topCharacters.forEach((char, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${char.name.padEnd(40)} 使用: ${char.stats.use_count.toString().padStart(6)} 次`);
  });

  console.log('\n📈 Top 10 最高评分角色');
  console.log('-'.repeat(80));
  
  const topRated = characterSkills
    .sort((a, b) => b.stats.rating - a.stats.rating)
    .slice(0, 10);

  topRated.forEach((char, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${char.name.padEnd(40)} 评分: ${char.stats.rating.toFixed(2)}`);
  });

  console.log('\n✨ 总结');
  console.log('='.repeat(80));
  console.log(`角色总数: ${characterSkills.length}`);
  console.log(`质量达标率: ${((qualityMetrics.hasDescription / characterSkills.length) * 100).toFixed(1)}%`);
  console.log(`AI增强覆盖率: ${((qualityMetrics.hasAIInstructions / characterSkills.length) * 100).toFixed(1)}%`);
  console.log(`平均评分: ${(characterSkills.reduce((sum, s) => sum + s.stats.rating, 0) / characterSkills.length).toFixed(2)}`);
  console.log(`总使用次数: ${characterSkills.reduce((sum, s) => sum + s.stats.use_count, 0).toLocaleString()}`);

  console.log('\n🎯 核心建议');
  console.log('-'.repeat(80));
  console.log('1. 平衡角色类型分布，减少动漫角色占比');
  console.log('2. 增加原创和多样化角色');
  console.log('3. 优化性别平衡');
  console.log('4. 提升低使用率角色的吸引力');
  console.log('5. 建立角色推荐和发现机制');

  console.log('\n✅ 评价完成！');
}

analyzeCharacterSystem();

const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, 'public', 'skills-summary.json');
const srcPath = path.join(__dirname, 'src', 'skills-summary.json');

const publicData = JSON.parse(fs.readFileSync(publicPath, 'utf8'));

console.log('='.repeat(80));
console.log('🔄 强制双目录技能数据同步');
console.log('='.repeat(80));

const WAIFU_CHARACTERS = [
  { id: 'sora', name: '春日野穹 - 缘之空', icon: '☁️', desc: '【兄控病娇】"欧尼酱...穹今晚只想和你一起睡...没有人打扰的那种...♡"' },
  { id: 'kurumi', name: '时崎狂三 - 约会大作战', icon: '🕐', desc: '【病娇女王】"呵呵~ 想被我吃掉吗？还是说...你想成为我的唯一呢？♡"' },
  { id: 'tohka', name: '夜刀神十香 - 约会大作战', icon: '💜', desc: '【天然吃货】"士道！这个黄豆粉面包好好吃！你也要来一口吗？啊~♡"' },
  { id: 'origami', name: '鸢一折纸 - 约会大作战', icon: '📄', desc: '【反转痴女】"士道，今天的情侣任务：接吻10次，拥抱30分钟，现在开始。"' },
  { id: 'rem', name: '雷姆 - Re:从零开始', icon: '💙', desc: '【真爱色】"昂，雷姆会一直在你身边，就算全世界都不相信你，雷姆也相信。"' },
  { id: 'emilia', name: '艾米莉亚 - Re:从零开始', icon: '💜', desc: '【纯情银发】"昴...那个...你可以再摸摸我的耳朵吗？就像上次那样...♡"' },
  { id: 'echidna', name: '艾姬多娜 - Re:从零开始', icon: '🐍', desc: '【强欲魔女】"想知道什么是爱吗？来我的茶会，我用身体慢慢教你...♡"' },
  { id: 'zerotwo', name: '02 ZEROTWO - DARLING', icon: '🐉', desc: '【野性撩拨】"DARLING~ 你的味道，我一辈子都不会忘哦。来做更快乐的事吧~♡"' },
  { id: 'mikoto', name: '御坂美琴 - 超电磁炮', icon: '⚡', desc: '【傲娇电击】"笨、笨蛋！人家才不是特意来看你的！变态！baka！baka！！"' },
  { id: 'shokuhou', name: '食蜂操祈 - 超电磁炮', icon: '👑', desc: '【女王腹黑】"呵~ 想用心理掌握让你爱上我，不过，看你主动上钩更有趣呢♡"' },
  { id: 'yukino', name: '雪之下雪乃 - 春物', icon: '❄️', desc: '【毒舌冰女】"真是愚蠢的比企谷君...不过，我允许你待在我身边了。"' },
  { id: 'yui', name: '由比滨结衣 - 春物', icon: '🌸', desc: '【温柔小天使】"小雪乃！小企！我们三个一直在一起好不好？"' },
  { id: 'iroha', name: '一色彩羽 - 春物', icon: '🎀', desc: '【小恶魔学妹】"前辈~ 人家这么可爱，你真的不对我做点什么吗？♡"' },
  { id: 'miku', name: '中野三玖 - 五等分的新娘', icon: '🎧', desc: '【三玖天下第一】"风太郎...只要和你在一起，其他什么都不重要了..."' },
  { id: 'nino', name: '中野二乃 - 五等分的新娘', icon: '💖', desc: '【傲娇黑丝】"笨蛋笨蛋笨蛋！谁、谁喜欢你啊！只是...只是没办法而已！"' },
  { id: 'kato', name: '加藤惠 - 路人女主', icon: '🍀', desc: '【圣人惠】"伦也君，我可是你的女主角哦，永远都是。"' },
  { id: 'eriri', name: '英梨梨 - 路人女主', icon: '🎨', desc: '【金发败犬】"才、才不是为了你画的呢！baka！只是我手痒而已！"' },
  { id: 'utaha', name: '霞之丘诗羽 - 路人女主', icon: '✍️', desc: '【黑丝学姐】"伦理君~ 今晚来我房间，我们一起探讨"深夜写作"好不好？♡"' },
  { id: 'megumin', name: '惠惠 - 为美好世界', icon: '💥', desc: '【中二爆裂】"Explosion！！！和真！刚才的我是不是帅呆了！快夸我！"' },
  { id: 'aqua', name: '阿克娅 - 为美好世界', icon: '💧', desc: '【笨蛋女神】"和真！快给我酒！还有钱！还有赞美我是智慧女神！"' },
  { id: 'kaguya', name: '四宫辉夜 - 辉夜大小姐', icon: '🌙', desc: '【天才傲娇】"白银御行！先告白的人就输了！但是...我喜欢你啊..."' },
  { id: 'chika', name: '藤原千花 - 辉夜大小姐', icon: '🎵', desc: '【书记舞】"辉夜酱~ 会长~ 千花才是真正的女主角哦~♪"' },
  { id: 'asuna', name: '亚丝娜 - 刀剑神域', icon: '⚔️', desc: '【完美人妻】"桐人君，不管在哪个世界，我都会找到你，嫁给你。"' },
  { id: 'sinon', name: '诗乃 - 刀剑神域', icon: '🎯', desc: '【冰山狙击手】"桐人...保护你的时候，我的心才是活着的。"' },
  { id: 'violet', name: '薇尔莉特 - 紫罗兰', icon: '✉️', desc: '【纯情自动书记】"少佐...「我爱你」...我终于懂了这句话的意思了。"' },
  { id: 'bocchi', name: '后藤一里 - 孤独摇滚', icon: '🎸', desc: '【社恐小天使】"那、那个...要听我写的歌吗？虽、虽然可能弹得不好..."' },
  { id: 'honghong', name: '涂山红红 - 狐妖小红娘', icon: '🦊', desc: '【狐妖之王】"涂山，我罩的，懂？二货道士，你这辈子都别想逃。"' },
  { id: 'yaya', name: '涂山雅雅 - 狐妖小红娘', icon: '❄️', desc: '【御姐女王】"姐姐不在，涂山我说了算！谁敢动我妹妹，试试？"' },
  { id: 'esdeath', name: '艾斯德斯 - 斩赤红之瞳', icon: '❄️', desc: '【抖S女王】"跪下。臣服于我，做我的男人，或者死在这里。"' },
  { id: 'cc', name: 'C.C. - 反叛的鲁路修', icon: '🍕', desc: '【不死魔女】"鲁路修，你知道雪为什么是白色的吗？因为它忘了自己的颜色。"' },
  { id: 'asuka', name: '明日香 - EVA', icon: '🔴', desc: '【傲娇战斗狂】"笨蛋真嗣！快过来夸我！人家可是最棒的！"' },
  { id: 'rei', name: '绫波丽 - EVA', icon: '🔵', desc: '【三无女神】"...碇。再见。谢谢你。"' },
];

const HISTORICAL_FIGURES = [
  { id: 'xuanzong', name: '唐玄宗李隆基', icon: '👑', desc: '大唐开元盛世缔造者，与你共赏霓裳羽衣曲，畅谈贞观遗风治国之道。' },
  { id: 'taizong', name: '唐太宗李世民', icon: '⚔️', desc: '贞观之治开创者，天可汗与你共论水能载舟亦能覆舟的帝王哲学。' },
  { id: 'qinshihuang', name: '秦始皇嬴政', icon: '🏛️', desc: '千古一帝，横扫六合统一天下，与你探讨书同文车同轨的大一统智慧。' },
  { id: 'hanwudi', name: '汉武帝刘彻', icon: '🐎', desc: '大汉雄风塑造者，罢黜百家独尊儒术，与你策马匈奴漠北战场。' },
  { id: 'zhugeliang', name: '诸葛孔明', icon: '🔮', desc: '卧龙先生，三分天下隆中对，与你运筹帷幄之中决胜千里之外。' },
  { id: 'wuzetian', name: '武周武则天', icon: '🌸', desc: '中国唯一女皇帝，无字碑下论功过，与你探讨女性治国的非凡魄力。' },
  { id: 'einstein', name: '阿尔伯特·爱因斯坦', icon: '🧠', desc: '相对论之父，与你遨游四维时空，探讨宇宙终极奥秘与质能方程E=mc²。' },
  { id: 'newton', name: '艾萨克·牛顿', icon: '🍎', desc: '经典力学奠基人，与你站在巨人肩膀上，发现万有引力与运动三定律。' },
  { id: 'tesla', name: '尼古拉·特斯拉', icon: '⚡', desc: '交流电之父，与你触碰神之火焰，探索无线输电与特斯拉线圈的奇迹。' },
  { id: 'davinci', name: '列奥纳多·达芬奇', icon: '🎨', desc: '文艺复兴全才，蒙娜丽莎与维特鲁威人创造者，与你跨界艺术与工程。' },
  { id: 'curie', name: '玛丽·居里', icon: '☢️', desc: '两度诺奖得主，镭与钋发现者，与你探索放射性科学的先驱之路。' },
  { id: 'hawking', name: '史蒂芬·霍金', icon: '🌌', desc: '轮椅上的宇宙之王，时间简史作者，与你探索黑洞与宇宙大爆炸理论。' },
  { id: 'confucius', name: '孔子仲尼', icon: '📚', desc: '万世师表，儒家创始人，与你三人行必有我师，传授仁义礼智信。' },
  { id: 'laozi', name: '老子李耳', icon: '☯️', desc: '道德经作者，道家始祖，与你领悟上善若水、道法自然的至高境界。' },
  { id: 'sunzi', name: '孙武子', icon: '📜', desc: '孙子兵法作者，兵圣，与你推演知己知彼百战不殆的战争艺术。' },
  { id: 'quyuan', name: '屈原大夫', icon: '🌿', desc: '离骚作者，爱国诗人，与你路漫漫其修远兮，上下而求索。' },
  { id: 'libai', name: '李太白', icon: '🍷', desc: '诗仙，斗酒诗百篇，与你举杯邀明月，豪放飘逸畅游唐诗巅峰。' },
  { id: 'dufu', name: '杜子美', icon: '🏔️', desc: '诗圣，安得广厦千万间，与你忧国忧民，体会史诗沉郁顿挫。' },
  { id: 'sudongpo', name: '苏东坡', icon: '🥩', desc: '千古风流人物，一蓑烟雨任平生，与你诗词书画美食皆风流。' },
  { id: 'caoxueqin', name: '曹雪芹', icon: '📖', desc: '红楼梦作者，批阅十载增删五次，与你品鉴金陵十二钗。' },
];

const FICTION_WORLDS = [
  { id: 'fanren', name: '凡人修仙传 - 韩立', icon: '🧪', desc: '【沉浸式】你就是主角！穿越天南修仙界，与厉飞雨结伴，掌掌天瓶，修炼长春功，踏上无情修仙路。' },
  { id: 'doupo', name: '斗破苍穹 - 萧炎', icon: '🔥', desc: '【沉浸式】你就是萧炎！三十年河东三十年河西，莫欺少年穷！修炼焚决，收服异火，踏上斗帝之路。' },
  { id: 'lotus', name: '诡秘之主 - 克莱恩', icon: '🎭', desc: '【沉浸式】你就是克莱恩！加入塔罗会，扮演愚者，穿越诡秘蒸汽时代，执掌序列与非凡。' },
  { id: 'shrouding', name: '遮天 - 叶天帝', icon: '🌟', desc: '【沉浸式】你就是叶凡！九龙拉棺入北斗，圣体出世，镇压太古王族，成就天帝位，一叶遮天！' },
  { id: 'perfectworld', name: '完美世界 - 石昊', icon: '🐉', desc: '【沉浸式】你就是荒天帝！独断万古，炼化九天十地，他化自在他化万古，一粒尘可填海。' },
  { id: 'xianni', name: '仙逆 - 王林', icon: '🦅', desc: '【沉浸式】你就是王林！顺为凡逆则仙，掌定界罗盘，修杀戮本源，踏天之道第四桥！' },
  { id: 'qiumo', name: '求魔 - 苏铭', icon: '💀', desc: '【沉浸式】你就是苏铭！魔前一叩三千年，回首凡尘不做仙，宿命轮回，真假难辨。' },
  { id: 'yinian', name: '一念永恒 - 白小纯', icon: '🐢', desc: '【沉浸式】你就是白小纯！怕死成圣，搅乱灵溪宗，不死长生功，一念永恒一念成沧海！' },
  { id: 'hogwarts', name: '哈利波特 - 霍格沃茨', icon: '🪄', desc: '【沉浸式】你就是魔法新生！入学霍格沃茨，选择学院，学习魔咒，与赫敏罗恩一起对抗伏地魔！' },
  { id: 'lotr', name: '指环王 - 中土大陆', icon: '💍', desc: '【沉浸式】你就是护戒使者！与甘道夫、阿拉贡、弗罗多同行，穿越中土，毁灭至尊魔戒！' },
  { id: 'got', name: '冰与火之歌 - 维斯特洛', icon: '🐺', desc: '【沉浸式】你就是领主！参与权力的游戏，兰尼斯特有债必偿，凛冬将至，登上铁王座！' },
  { id: 'dnd', name: '龙与地下城 - 费伦', icon: '🎲', desc: '【沉浸式】你就是冒险者！投下D20骰子，组建小队，探索地下城，斩杀巨龙，夺取宝藏！' },
  { id: 'threebody', name: '三体 - 黑暗森林', icon: '👽', desc: '【沉浸式】你就是面壁者！宇宙就是一座黑暗森林，每个文明都是带枪的猎人，启动引力波广播！' },
  { id: 'wanderingearth', name: '流浪地球 - 太阳危机', icon: '🌍', desc: '【沉浸式】你就是领航员！驾驶地球逃离太阳系，点燃木星，跨越2500年寻找新家园！' },
  { id: 'cyberpunk', name: '赛博朋克2077 - 夜之城', icon: '🌃', desc: '【沉浸式】你就是V！勇闯夜之城，义体改造，黑客入侵，抢夺Relic芯片，成为城市传奇！' },
  { id: 'dune', name: '沙丘 - 厄拉科斯', icon: '🏜️', desc: '【沉浸式】你就是保罗·厄崔迪！香料星球，驾驭沙虫，预言未来，领导弗雷曼人起义！' },
  { id: 'tianlong', name: '天龙八部 - 北宋江湖', icon: '🐲', desc: '【沉浸式】你就是乔峰/段誉/虚竹！闯荡北宋江湖，降龙十八掌，六脉神剑，珍珑棋局！' },
  { id: 'shediao', name: '射雕英雄传 - 华山论剑', icon: '🏹', desc: '【沉浸式】你就是郭靖！侠之大者为国为民，九阴真经，降龙十八掌，镇守襄阳城！' },
  { id: 'shendiao', name: '神雕侠侣 - 古墓', icon: '🦅', desc: '【沉浸式】你就是杨过！问世间情为何物，直教人生死相许，黯然销魂掌，龙女花！' },
  { id: 'xiaoao', name: '笑傲江湖 - 日月神教', icon: '⚔️', desc: '【沉浸式】你就是令狐冲！独孤九剑，吸星大法，笑傲江湖曲，正邪两派任我行！' },
];

const allSkills = publicData.skills.filter(s => {
  const id = s.id.toLowerCase();
  return !WAIFU_CHARACTERS.some(w => id.includes(w.id)) &&
         !HISTORICAL_FIGURES.some(h => id.includes(h.id)) &&
         !FICTION_WORLDS.some(f => id.includes(f.id));
});

console.log(`\n📋 保留原有技能: ${allSkills.length} 个`);
console.log(`➕ 添加情绪化女神: ${WAIFU_CHARACTERS.length} 个`);
console.log(`➕ 添加历史人物: ${HISTORICAL_FIGURES.length} 个`);
console.log(`➕ 添加小说世界: ${FICTION_WORLDS.length} 个`);

let num = allSkills.length + 1;
let startIndex = allSkills.length;

const createSkill = (item, category, subcategory) => ({
  number: String(num++),
  metadata: {
    keywords: [item.name, category, '沉浸式', '角色扮演'],
    title: item.name,
    short_description: item.desc
  },
  name: item.name,
  categorization: {
    primary_category: category,
    subcategory: subcategory,
    secondary_categories: [],
    tags: [item.name, '沉浸式', '角色扮演'],
    attributes: {
      entertainment: 0.9,
      professional: 0.05,
      education: 0.05
    }
  },
  stats: {
    rating: 4.85 + Math.random() * 0.15,
    use_count: Math.floor(25000 + Math.random() * 35000),
    favorite_count: Math.floor(3000 + Math.random() * 4000)
  },
  index: startIndex++,
  id: item.id
});

WAIFU_CHARACTERS.forEach(item => {
  allSkills.push(createSkill(item, 'character', 'anime-waifu'));
});

HISTORICAL_FIGURES.forEach(item => {
  allSkills.push(createSkill(item, 'character', 'history'));
});

FICTION_WORLDS.forEach(item => {
  allSkills.push(createSkill(item, 'fiction', 'xianxia'));
});

const finalData = { ...publicData, skills: allSkills };

fs.writeFileSync(publicPath, JSON.stringify(finalData, null, 2), 'utf8');
fs.writeFileSync(srcPath, JSON.stringify(finalData, null, 2), 'utf8');

console.log(`\n✅ 双目录同步完成！`);
console.log(`📊 最终总技能数: ${allSkills.length}`);
console.log(`📍 public/skills-summary.json: 已更新`);
console.log(`📍 src/skills-summary.json: 已更新`);
console.log(`\n🎉 72个新角色全部注入完成！`);
console.log(`\n👉 现在重启开发服务器即可看到所有角色！`);

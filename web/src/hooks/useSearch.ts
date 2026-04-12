'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Fuse from 'fuse.js';
import type { Skill } from '@/types/skill';

interface UseSearchOptions {
  threshold?: number;
  keys?: Array<string | { name: string; weight?: number }>;
  enableHighlight?: boolean;
}

interface FuseMatch {
  key?: string;
  value?: string;
  indices: [number, number][];
}

interface SearchResult {
  item: Skill;
  score?: number;
  matches?: readonly FuseMatch[] | undefined;
  highlight?: Record<string, string>;
}

const PINYIN_MAP: Record<string, string> = {
  'a': '阿啊呵腌嗄', 'ai': '爱哎唉哀皑癌矮蔼隘艾碍',
  'an': '安氨鞍庵铵俺按案暗岸胺', 'ang': '昂肮盎',
  'ao': '熬凹敖翱袄傲奥澳懊',
  'ba': '八巴扒叭疤捌笆拔跋靶把耙坝霸罢爸',
  'bai': '白百柏摆败拜稗', 'ban': '半办班斑般扳颁板版扮拌伴瓣',
  'bang': '帮邦棒榜膀绑蚌磅', 'bao': '包宝保饱抱报刨剥爆',
  'bei': '北被杯碑悲卑背辈备惫贝倍狈备惫',
  'ben': '本笨奔苯笨', 'beng': '崩绷甭泵蹦迸',
  'bi': '比笔彼碧蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛',
  'bian': '边变便遍编贬扁便卞辨辩辫',
  'biao': '表标彪膘', 'bie': '别瘪憋鳖蹩',
  'bin': '宾滨彬斌濒殡', 'bing': '兵冰柄丙秉饼炳病并禀',
  'bo': '波博拨玻菠播柏驳泊勃搏膊薄',
  'bu': '不步布部簿捕哺补埠',
  'ca': '擦嚓', 'cai': '猜才材财裁采彩菜蔡',
  'can': '参蚕残惭惨灿', 'cang': '仓苍舱沧藏',
  'cao': '操曹槽草', 'ce': '测册策侧厕恻',
  'ceng': '层曾蹭噌', 'cha': '查插叉茬茶查碴搽察岔差诧',
  'chai': '柴拆差', 'chan': '产缠搀掺蝉馋谗缠铲掺忏颤',
  'chang': '长常场厂敞畅唱倡昌猖尝偿裳',
  'chao': '朝超抄钞嘲潮巢炒吵',
  'che': '车扯撤掣彻澈', 'chen': '臣辰尘晨忱沉陈趁衬称',
  'cheng': '成承乘程城诚盛惩澄橙称撑丞',
  'chi': '吃池尺齿斥赤翅痴持匙池迟弛驰耻侈豉',
  'chong': '充冲虫崇宠重忡憧',
  'chou': '抽仇畴踌稠愁筹仇绸瞅丑臭',
  'chu': '出初除锄雏橱厨躇储畜矗触处滁',
  'chuan': '川穿椽传船喘串', 'chuang': '疮窗床闯创幢',
  'chui': '吹炊捶锤垂陲', 'chun': '春醇唇淳纯蠢戳绰',
  'chuo': '戳绰辍龊', 'ci': '次此刺差茨磁雌辞慈瓷词',
  'cong': '从丛葱囱匆聪琮', 'cou': '凑辏楱',
  'cu': '粗促簇醋猝', 'cuan': '蹿篡窜攒汆',
  'cui': '崔催摧脆瘁粹淬翠', 'cun': '村存寸忖',
  'cuo': '搓措挫错撮搓磋',
  'da': '大达打答瘩鞑笪', 'dai': '带待代戴贷袋呆歹傣殆逮',
  'dan': '但单蛋担丹郸掸胆旦氮但惮淡诞弹',
  'dang': '当挡党荡档', 'dao': '到道导刀倒岛祷蹈捣悼',
  'de': '的得德地底', 'deng': '灯登等凳澄邓蹬',
  'di': '地第低滴堤迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔',
  'dian': '点电店典颠滇碘点淀奠殿靛惦',
  'diao': '吊掉调叼雕凋刁掉钓调',
  'die': '跌爹碟蝶迭谍叠', 'ding': '定丁盯叮钉顶鼎锭订',
  'diu': '丢铥', 'dong': '东冬董懂动栋冻洞',
  'dou': '都斗豆逗陡抖痘兜窦蚪',
  'du': '度读毒独堵赌睹杜镀肚度渡妒',
  'duan': '短段断端缎锻', 'dui': '对队堆兑怼碓',
  'dun': '吨顿蹲墩敦钝盾遁掇哆',
  'duo': '多朵夺舵垛躲剁堕铎踱',
  'e': '恶俄额讹娥鹅蛾扼俄讹娥恶厄扼遏鄂饿谔鄂',
  'en': '恩嗯', 'er': '二而儿尔耳饵尔贰',
  'fa': '发法罚伐乏筏阀珐', 'fan': '反饭番翻凡矾钒繁凡烦反返范犯泛饭',
  'fang': '方房防妨仿访放芳肪方防坊芳妨',
  'fei': '非飞肥匪诽吠肺废沸费菲肥匪',
  'fen': '分份芬酚吩氛纷坟焚汾粉奋份忿愤粪',
  'feng': '风封丰峰锋蜂烽枫疯逢冯缝奉凤',
  'fo': '佛', 'fou': '否缶',
  'fu': '副幅福服伏附俘浮符府腐辅赴父腹负富讣附妇缚咐',
  'gai': '该改概钙盖溉丐', 'gan': '干甘杆柑竿肝赶感秆敢赣',
  'gang': '刚钢缸肛纲岗港杠', 'gao': '高膏篙羔糕搞镐稿告诰稿',
  'ge': '个歌哥搁戈鸽胳疙割革葛格阁隔铬各葛',
  'gei': '给', 'gen': '根跟亘', 'geng': '更耕羹埂耿梗',
  'gong': '工攻功恭供公功宫弓巩汞拱贡共',
  'gou': '沟钩苟狗构购够垢篝',
  'gu': '古估股骨谷固故雇顾咕沽孤姑鼓蛊',
  'gua': '瓜刮寡挂褂', 'guai': '乖怪拐',
  'guan': '关官管馆冠观棺倌莞鳏馆贯惯灌罐',
  'guang': '光广逛胱', 'gui': '归贵龟规硅闺轨鬼诡癸桂柜跪刽',
  'gun': '滚棍辊磙', 'guo': '国过果锅郭裹馘蝈',
  'ha': '哈铪', 'hai': '还害孩海氦亥',
  'han': '汉含汗寒函喊罕翰撼捍旱憾悍焊汗',
  'hang': '行航杭巷夯', 'hao': '好号耗浩薅嚎壕濠',
  'he': '和喝河菏核禾和何合盒贺赫褐鹤贺',
  'hei': '黑嘿嗨', 'hen': '很狠恨痕',
  'heng': '横恒亨衡蘅', 'hong': '红洪轰哄烘虹鸿宏弘',
  'hou': '后厚候侯猴吼喉', 'hu': '户湖胡蝴狐糊葫弧虎唬护互沪户',
  'hua': '话花华划哗华化画猾滑',
  'huai': '坏怀淮槐徊', 'huan': '还换欢环桓缓换患唤痪焕涣宦',
  'huang': '黄荒慌惶煌晃幌恍谎', 'hui': '会灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽',
  'hun': '混浑魂昏婚荤', 'huo': '活火伙或货获霍豁惑',
  'ji': '机几激级急计基积绩击绩鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱碱拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁叁伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座'
};

function pinyinContains(str: string, query: string): boolean {
  const lowerStr = str.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (lowerStr.includes(lowerQuery)) {
    return true;
  }

  for (const [pinyin, chars] of Object.entries(PINYIN_MAP)) {
    if (pinyin.includes(lowerQuery) || lowerQuery.includes(pinyin)) {
      for (const char of lowerStr) {
        if (chars.includes(char)) {
          return true;
        }
      }
    }
  }

  return false;
}

function highlightText(text: string, query: string): string {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${query.split(/\s+/).join('|')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function useSearch(skills: Skill[], options: UseSearchOptions = {}) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(skills, {
      keys: options.keys || [
        { name: 'name', weight: 0.5 },
        { name: 'description', weight: 0.25 },
        { name: 'scenarios', weight: 0.15 },
        { name: 'guide', weight: 0.1 }
      ],
      threshold: options.threshold || 0.35,
      includeScore: true,
      includeMatches: options.enableHighlight || false,
      minMatchCharLength: 1,
      shouldSort: true,
      findAllMatches: true
    });
  }, [skills, options.keys, options.threshold, options.enableHighlight]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return skills;
    }

    const trimmedQuery = query.toLowerCase().trim();
    const keywords = trimmedQuery.split(/\s+/).filter(k => k.length > 0);

    let searchResults: SearchResult[];

    if (keywords.length === 1 && trimmedQuery.length <= 3) {
      const directResults = skills.filter(skill => {
        const name = skill.name?.toLowerCase() || '';
        const desc = skill.description?.toLowerCase() || '';
        
        if (name.startsWith(trimmedQuery)) return true;
        if (name.includes(trimmedQuery)) return true;
        if (pinyinContains(name, trimmedQuery)) return true;
        if (desc.includes(trimmedQuery)) return true;
        return false;
      });
      searchResults = directResults.map(item => ({ item }));
    } else {
      searchResults = fuse.search(trimmedQuery) as unknown as any;
    }

    if (keywords.length > 1) {
      searchResults = searchResults.filter(({ item }) => {
        const searchText = [
          item.name,
          item.description,
          ...(item.scenarios || []),
          item.guide
        ].join(' ').toLowerCase();
        
        return keywords.every(kw => searchText.includes(kw));
      });
    }

    const finalResults = searchResults.map(result => {
      if (options.enableHighlight && result.matches) {
        const highlight: Record<string, string> = {};
        result.matches.forEach(match => {
          const key = match.key as keyof Skill;
          const value = result.item[key];
          if (typeof value === 'string') {
            highlight[key as string] = highlightText(value, trimmedQuery);
          }
        });
        return { ...result, highlight };
      }
      return result;
    });

    return finalResults.map(result => result.item);
  }, [query, fuse, skills, options.enableHighlight]);

  useEffect(() => {
    if (query.trim() && results.length > 0) {
      // 搜索性能日志已移至 useEffect 以符合 React 纯函数原则
    }
  }, [results, query]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        clearSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [clearSearch]);

  return {
    query,
    setQuery,
    results,
    clearSearch,
    hasResults: results.length > 0,
    resultCount: results.length,
    isSearching: query.trim().length > 0
  };
}

export type { UseSearchOptions, SearchResult };

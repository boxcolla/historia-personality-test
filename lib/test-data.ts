export const dimensions = ["统筹掌控", "开放创造", "稳定韧性", "共情理解", "行动进取", "判断洞察"] as const;
export type Dimension = (typeof dimensions)[number];
export type Vector = [number, number, number, number, number, number];

export type PublicQuestion = {
  id: number;
  figure: string;
  era: string;
  scene: string;
  situation: string;
  power: string;
  cost: string;
  prompt: string;
  options: { label: string; text: string }[];
};
type Question = Omit<PublicQuestion, "options"> & { options: { label: string; text: string; points: Vector }[] };

const baseQuestions: Question[] = [
  { id:1, figure:"秦始皇", era:"秦代", scene:"六国初定", situation:"疆域刚刚统一，各地文字、度量衡与治理习惯仍不相同，旧有势力也未真正服从。", power:"以中央权力推行郡县、统一尺度，把分散的地方纳入同一套秩序。", cost:"统一提高了治理效率，也带来强制执行、沉重动员与地方反弹。", prompt:"如果你接手一个标准混乱、彼此不信任的新团队，你会先抓哪一件事？", options:[
    {label:"A",text:"先统一底线，所有人按同一把尺做事。",points:[2,0,1,0,0,0]},
    {label:"B",text:"先听各方旧习，找出最难被替代的部分。",points:[0,0,0,2,0,1]},
    {label:"C",text:"选一个小范围试行，用结果换取接受。",points:[1,1,0,0,2,0]},
    {label:"D",text:"先看混乱让谁得利，再决定从哪里动手。",points:[1,0,0,0,0,2]},
  ]},
  { id:2, figure:"曹操", era:"东汉末", scene:"官渡破局", situation:"袁绍兵多粮足，曹操兵少粮缺，正面消耗几乎没有胜算，军心也开始动摇。", power:"抓住许攸来投带来的情报，集中兵力奇袭乌巢，以速度和判断击中粮道。", cost:"一步失误就可能全军覆没，果断也让他长期背负多疑与强硬的评价。", prompt:"当对手资源远胜于你、窗口又转瞬即逝时，你更可能怎么破局？", options:[
    {label:"A",text:"把筹码压在最关键的一处，先打穿再说。",points:[1,0,0,0,2,1]},
    {label:"B",text:"继续稳住阵脚，不能被一次机会带乱节奏。",points:[1,0,2,0,0,0]},
    {label:"C",text:"先确认情报动机，真假比快慢更重要。",points:[0,0,0,1,0,2]},
    {label:"D",text:"争取更多盟友，先改变双方力量关系。",points:[1,0,0,2,0,0]},
  ]},
  { id:3, figure:"诸葛亮", era:"蜀汉", scene:"六出祁山", situation:"蜀汉国力有限、补给线漫长，却仍要在强敌环伺中维持主动与政权信心。", power:"依靠严密筹划、军纪与长期责任感，把有限资源反复组织起来。", cost:"北伐久而未成，国力与个人精力持续消耗，他也几乎把全局压在自己身上。", prompt:"一件长期重要、但回报迟迟不来的事，你会靠什么继续？", options:[
    {label:"A",text:"把大目标拆成今天还能推进的一步。",points:[1,0,2,0,1,0]},
    {label:"B",text:"先问方向是否还对，别让坚持代替判断。",points:[0,0,0,0,1,2]},
    {label:"C",text:"让更多人接住任务，不能永远由我托底。",points:[1,0,0,2,0,0]},
    {label:"D",text:"换一种打法，不让原计划困住结果。",points:[0,2,0,0,1,0]},
  ]},
  { id:4, figure:"武则天", era:"唐代", scene:"打破门第", situation:"门阀长期垄断仕途，女性掌权也不断遭遇名分质疑，朝局中没有天然安全的位置。", power:"扩大科举取士、任用新进力量，并以强势决断重组权力格局。", cost:"她赢得了实际掌控，也加剧政治对抗，并留下严酷用权与信任稀缺的争议。", prompt:"当旧圈层牢牢把住入口，而你又不被视为“自己人”时，你会怎么争取位置？", options:[
    {label:"A",text:"建立一套新标准，让结果重新决定位置。",points:[2,1,0,0,0,0]},
    {label:"B",text:"先找到被忽略的人，组成新的支持网络。",points:[0,0,0,2,1,0]},
    {label:"C",text:"不急着表态，先看清真正的权力流向。",points:[0,0,1,0,0,2]},
    {label:"D",text:"直接拿下关键成果，用事实逼出空间。",points:[1,0,0,0,2,0]},
  ]},
  { id:5, figure:"冯太后", era:"北魏", scene:"太和改制", situation:"北魏从部族统治走向庞大帝国，旧制度难以支撑户籍、赋税与地方治理。", power:"通过均田、三长等制度改革，把一时的掌控沉淀为可复制的治理结构。", cost:"制度深入社会也触动旧贵族利益，执行差异让普通人承受新的适应压力。", prompt:"眼前问题反复出现时，你更愿意怎样让它不再重演？", options:[
    {label:"A",text:"把经验写成规则，让以后的人有章可循。",points:[2,0,1,0,0,0]},
    {label:"B",text:"先解决最痛的个案，别让人等制度成熟。",points:[0,0,0,2,1,0]},
    {label:"C",text:"保留弹性，制度也要允许地方试错。",points:[0,2,1,0,0,0]},
    {label:"D",text:"先找反复发生的根因，再决定要不要立规。",points:[1,0,0,0,0,2]},
  ]},
  { id:6, figure:"张居正", era:"明代", scene:"考成整饬", situation:"官僚系统层层拖延，政令写得完整，却常在执行中落空，财政压力也不断累积。", power:"以考成法追踪责任和时限，用强执行力推动一条鞭法等改革。", cost:"效率明显提升，却制造高度紧张与政敌；他死后改革和名誉都遭到反攻。", prompt:"一个项目人人都说重要，却总在执行中落空，你会先做什么？", options:[
    {label:"A",text:"把责任、节点和验收写清，结果逐项追。",points:[2,0,1,0,0,0]},
    {label:"B",text:"先听执行者卡在哪里，别只靠加码。",points:[0,0,0,2,0,1]},
    {label:"C",text:"先做一段最小闭环，让团队看见可行。",points:[0,1,0,0,2,0]},
    {label:"D",text:"先判断是真做不到，还是有人不想做到。",points:[1,0,0,0,0,2]},
  ]},
  { id:7, figure:"王安石", era:"北宋", scene:"熙宁变法", situation:"国家财政、边防与基层生计同时承压，旧办法维持表面稳定，却解决不了积累的问题。", power:"以系统性新法重做财政与治理工具，相信制度可以主动改变现实。", cost:"改革推进过快、地方执行走样，理想与民间感受之间出现裂缝，党争也日益激烈。", prompt:"你确信旧方法已经失效，但新方案可能在执行中变形，你更接近哪种选择？", options:[
    {label:"A",text:"先小范围验证，能修再扩，不急着铺满。",points:[0,2,1,0,0,0]},
    {label:"B",text:"方向既然正确，就用足够力度推下去。",points:[2,0,0,0,1,0]},
    {label:"C",text:"先看谁会承担代价，再决定推进速度。",points:[0,0,0,2,0,1]},
    {label:"D",text:"盯住执行偏差，问题可能不在方案本身。",points:[1,0,0,0,0,2]},
  ]},
  { id:8, figure:"王阳明", era:"明代", scene:"龙场悟道", situation:"遭廷杖、贬谪，又身处险远之地，既有的仕途标准和外界认可几乎全部失效。", power:"把判断的准星转回内心，并用之后的知行实践验证所信，而非只停在思辨。", cost:"独立判断带来坚定，也可能让人长期独自承受，并被误解为过度坚持。", prompt:"当外界评价突然失效、没有人替你确认方向时，你靠什么重新站稳？", options:[
    {label:"A",text:"回到内心真正认可的事，再用行动验证。",points:[0,0,1,0,1,2]},
    {label:"B",text:"先恢复稳定节奏，答案可以慢一点出现。",points:[1,0,2,0,0,0]},
    {label:"C",text:"找可信的人谈透，不让自己困在单一视角。",points:[0,0,0,2,0,1]},
    {label:"D",text:"换个环境和做法，也许出口不在原路上。",points:[0,2,0,0,1,0]},
  ]},
  { id:9, figure:"李清照", era:"两宋", scene:"南渡存真", situation:"战乱迫使她南渡，家国、婚姻与大量收藏相继破碎，熟悉的生活无法复原。", power:"以敏锐感受、文字与金石整理保存经验，让失去之物仍能被看见。", cost:"看得越细，失去也越清楚；记忆成为作品，也可能成为反复触碰的伤口。", prompt:"生活发生不可逆的变化时，你更可能怎样安放那些失去？", options:[
    {label:"A",text:"把经历写下来，真实本身就值得留下。",points:[0,1,0,1,0,2]},
    {label:"B",text:"先照顾眼前的人，关系比完整记录重要。",points:[0,0,1,2,0,0]},
    {label:"C",text:"接受生活已变，尽快建立新的日常。",points:[0,1,2,0,0,0]},
    {label:"D",text:"找到还能做的事，用行动把自己拉回来。",points:[1,0,0,0,2,0]},
  ]},
  { id:10, figure:"李白", era:"盛唐", scene:"赐金放还", situation:"进入长安后，他得到短暂赏识，却未能获得理想中的政治位置，最终离开宫廷。", power:"以诗性、想象和自我表达把失意转化成不受官位限制的创造力。", cost:"自由保存了天性，也伴随仕途漂泊、现实不稳与理想反复落空。", prompt:"一个看似体面的机会要求你长期压住真实的自己，你会怎么选？", options:[
    {label:"A",text:"离开不适合的位置，身份不能耗尽自己。",points:[0,2,1,0,0,0]},
    {label:"B",text:"先留下，找到能表达自己的缝隙。",points:[1,1,1,0,0,0]},
    {label:"C",text:"看它还能换来什么，值不值得再忍一程。",points:[0,0,0,0,1,2]},
    {label:"D",text:"和关键的人谈清边界，争取改变合作方式。",points:[1,0,0,2,0,0]},
  ]},
  { id:11, figure:"花木兰", era:"北朝民歌", scene:"代父从军", situation:"军书征兵，父亲年老、弟弟年幼；传说中的木兰在家庭责任与个人安危之间作出选择。", power:"以行动、隐忍与长期适应承担家中无人能接的责任。", cost:"她必须离开原有身份多年，并独自承受战场风险与秘密被揭开的压力。", prompt:"一件事确实需要有人承担，但它会长期改变你的生活，你会先问自己什么？", options:[
    {label:"A",text:"这是不是只有我能接，还是我习惯了先扛。",points:[0,0,0,1,0,2]},
    {label:"B",text:"重要的人需要我，代价可以以后再算。",points:[0,0,1,2,0,0]},
    {label:"C",text:"先找替代方案，担当不等于只有一种做法。",points:[0,2,0,0,1,0]},
    {label:"D",text:"既然决定接，就先把风险和退路安排好。",points:[2,0,1,0,0,0]},
  ]},
  { id:12, figure:"王昭君", era:"西汉", scene:"出塞和亲", situation:"汉匈关系需要缓和，她离开熟悉的宫廷与故土，进入语言、生活和权力结构都不同的环境。", power:"以个人适应、关系连接与长期承诺，承接一场超出个人生活的政治安排。", cost:"和平叙事背后，是远离故土、身份被重写，以及个人选择空间受到限制。", prompt:"当集体需要与你的个人生活发生冲突时，你最在意哪条边界？", options:[
    {label:"A",text:"先确认这是我的选择，不只因为别人需要。",points:[0,1,0,0,1,1]},
    {label:"B",text:"如果能保护重要的人，我愿意承担变化。",points:[0,0,1,2,0,0]},
    {label:"C",text:"先把条件谈清，付出不能只靠默认。",points:[2,0,0,1,0,0]},
    {label:"D",text:"看长期影响，不能只被当下情绪推着走。",points:[0,0,1,0,0,2]},
  ]},
  { id:13, figure:"班超", era:"东汉", scene:"投笔从戎", situation:"他不愿长期困于抄写文书，选择前往陌生西域；前路未知，归期最终以数十年计算。", power:"依靠行动胆识、临场判断与跨文化交涉，在极少资源下打开新局。", cost:"选择带来功业，也意味着长期离家、持续危险，以及几乎无法回头的人生。", prompt:"一个机会可能彻底改变你，却要离开熟悉生活很久，什么最能让你出发？", options:[
    {label:"A",text:"眼前生活已经不再容得下我想做的事。",points:[0,1,0,0,2,0]},
    {label:"B",text:"我看见别人没走过的路，想亲自验证。",points:[0,2,0,0,0,1]},
    {label:"C",text:"先算清最坏结果，能承受才动身。",points:[1,0,1,0,0,1]},
    {label:"D",text:"和重要的人谈清彼此能承担什么。",points:[0,0,1,2,0,0]},
  ]},
  { id:14, figure:"张骞", era:"西汉", scene:"凿空西域", situation:"奉命出使后被匈奴扣留多年，逃出后仍继续寻找通往大月氏的道路。", power:"以韧性、好奇和外交判断在陌生世界中持续行动，并带回新的地理认知。", cost:"十余年漂泊与拘禁换来有限的直接成果，他付出的是时间、自由和与故土的分离。", prompt:"投入多年仍没有拿到原定结果时，你最难放下的是什么？", options:[
    {label:"A",text:"已经付出这么久，现在停下太不甘心。",points:[0,0,2,0,1,0]},
    {label:"B",text:"目标可以改，但一路得到的认知要带回来。",points:[0,2,0,0,0,1]},
    {label:"C",text:"先判断使命是否仍成立，不能只看沉没成本。",points:[0,0,0,0,1,2]},
    {label:"D",text:"想到还在等我的人，我会重新权衡。",points:[0,0,1,2,0,0]},
  ]},
  { id:15, figure:"苏轼", era:"北宋", scene:"黄州重启", situation:"乌台诗案后被贬黄州，政治抱负受挫，生活与身份都从中心跌到边缘。", power:"用创作、日常实践与豁达重新解释处境，在失势中建立仍可生活的世界。", cost:"自我转化没有消除现实打击；旷达背后仍有贫困、孤独与反复贬谪。", prompt:"经历一次彻底失败后，你更可能怎样重新开始？", options:[
    {label:"A",text:"先把生活过稳，恢复节奏再谈下一步。",points:[0,0,2,1,0,0]},
    {label:"B",text:"换一种表达和做法，让失意长出新东西。",points:[0,2,0,0,1,0]},
    {label:"C",text:"复盘到底输在哪里，下次不能再犯。",points:[1,0,0,0,0,2]},
    {label:"D",text:"找一个新目标，用真实行动走出低谷。",points:[1,0,0,0,2,0]},
  ]},
  { id:16, figure:"范仲淹", era:"北宋", scene:"庆历新政", situation:"冗官与积弊已显，他与同道尝试整顿吏治，却很快遭到既得利益反对。", power:"以公共责任、制度眼光与同道协作推动改革，相信先忧后乐不是空话。", cost:"新政短暂即败，他和支持者被排挤外放，个人理想要承受政治现实的反噬。", prompt:"一件对整体有益的事会让你个人吃亏，你靠什么决定值不值得做？", options:[
    {label:"A",text:"先看它是否真正改善了多数人的处境。",points:[0,0,0,2,0,1]},
    {label:"B",text:"使命够重要，我能接受一段时间不被理解。",points:[0,0,2,0,1,0]},
    {label:"C",text:"先确认同伴和退路，不能只靠个人热血。",points:[1,0,1,1,0,0]},
    {label:"D",text:"把目标缩小做成，先留下一个真实结果。",points:[0,1,0,0,2,0]},
  ]},
  { id:17, figure:"商鞅", era:"战国", scene:"秦国变法", situation:"秦国需要迅速富国强兵，旧贵族利益与旧习却构成巨大阻力。", power:"以连贯法令、奖惩和军功体系重塑社会运行方式，让规则真正能够执行。", cost:"改革增强国力，也带来严苛控制和社会压力；他本人最终死于自己参与建立的权力机器。", prompt:"规则确实能带来结果，但开始压过具体的人时，你会怎么处理？", options:[
    {label:"A",text:"规则必须稳定，不能因为个案随意改动。",points:[2,0,1,0,0,0]},
    {label:"B",text:"给例外留申诉口，秩序不能失去修正力。",points:[1,0,0,2,0,0]},
    {label:"C",text:"重新验证它还在解决问题，还是只剩服从。",points:[0,0,0,0,0,2]},
    {label:"D",text:"换一种机制，目标未必要靠同样的强度。",points:[0,2,0,0,1,0]},
  ]},
  { id:18, figure:"岳飞", era:"南宋", scene:"奉诏班师", situation:"北伐取得进展之时，朝廷连发诏令召回；军事目标、君命与个人判断发生剧烈冲突。", power:"依靠军纪、忠诚与长期意志维持一支能战之军，并把恢复故土视为使命。", cost:"服从没有换来安全，北伐中止，他本人也付出生命；使命与秩序的冲突无法被轻易化解。", prompt:"当上级命令与你确信正确的方向冲突时，你最不能接受什么？", options:[
    {label:"A",text:"规则被用来压住本来正确的事。",points:[1,0,0,0,1,1]},
    {label:"B",text:"跟着我付出的人因此失去结果。",points:[0,0,1,2,0,0]},
    {label:"C",text:"没有把真实风险说透，就仓促服从。",points:[0,0,0,0,0,2]},
    {label:"D",text:"自己只顾坚持，却没留下可继续的安排。",points:[2,0,1,0,0,0]},
  ]},
  { id:19, figure:"郑和", era:"明代", scene:"七下西洋", situation:"远航规模庞大、海域陌生，需要协调船队、物资、外交与沿途风险。", power:"以组织力、开放视野和跨文化沟通，把国家资源转化为前所未有的航海行动。", cost:"远航耗费巨大，也高度依赖政治支持；政策转向后，许多经验难以继续积累。", prompt:"你完成了一次很亮眼的探索，接下来最想先留下什么？", options:[
    {label:"A",text:"把流程和经验整理好，让后来者还能复用。",points:[2,0,1,0,0,0]},
    {label:"B",text:"趁窗口还在，马上去更远的地方。",points:[0,2,0,0,1,0]},
    {label:"C",text:"维护一路建立的关系，成果不只是航线。",points:[0,0,0,2,0,1]},
    {label:"D",text:"先看资源能否持续，别让壮举变成一次性消耗。",points:[1,0,1,0,0,2]},
  ]},
  { id:20, figure:"司马迁", era:"西汉", scene:"忍辱著史", situation:"因李陵之祸遭受宫刑，他在极大屈辱中选择活下去，继续完成《史记》。", power:"以长期意志、独立判断和写作，把个人苦难转化为对时代与人性的记录。", cost:"完成作品的代价是身体创伤、名誉压力与漫长孤独；坚持并没有让痛苦消失。", prompt:"如果多年后别人只能记住你的一种选择，你最不希望哪部分被忽略？", options:[
    {label:"A",text:"当时的处境有多难，不该只看最后结果。",points:[0,0,1,2,0,0]},
    {label:"B",text:"我看见了什么，才决定把这件事做完。",points:[0,1,0,0,0,2]},
    {label:"C",text:"为了完成它，我真实放弃过什么。",points:[0,0,2,1,0,0]},
    {label:"D",text:"我留下的不只是作品，还有一条新路。",points:[1,1,0,0,1,0]},
  ]},
];

const hiddenQuestions: Question[] = [
  { id:21, figure:"吕后", era:"西汉", scene:"临朝定局", situation:"汉初政权刚刚建立，高祖去世后，皇权、功臣集团与吕氏家族之间的平衡随时可能失控。", power:"以政治判断、家族网络和强硬决断控制朝局，维持新生政权继续运转。", cost:"她稳住了权力，也让防范与清洗成为常态，个人评价长期被残酷手段笼罩。", prompt:"当核心人物离场、所有人都在重新站队时，你会先守住什么？", options:[
    {label:"A",text:"先把决策权握稳，局面不能出现真空。",points:[2,0,1,0,0,0]},
    {label:"B",text:"先确认谁仍可信，关系比口头表态重要。",points:[0,0,0,2,0,1]},
    {label:"C",text:"迅速处理最大威胁，不能等它坐大。",points:[1,0,0,0,2,0]},
    {label:"D",text:"重新设计权力边界，不能只靠个人压住。",points:[1,1,0,0,0,1]},
  ]},
  { id:22, figure:"蔡文姬", era:"东汉末", scene:"归汉续史", situation:"战乱中流落匈奴多年，归汉后既要面对与旧生活割裂，也承担整理亡父遗稿的责任。", power:"凭借记忆、文字与适应力，把破碎经历重新组织，并保存即将散失的文化记忆。", cost:"回归故土意味着再次离开已经建立的家庭，任何选择都伴随无法弥补的失去。", prompt:"两个都真实属于你的世界无法同时保全时，你更可能怎样选择？", options:[
    {label:"A",text:"先看哪一份责任只有我能完成。",points:[1,0,1,0,0,1]},
    {label:"B",text:"不回避感情，重要的人不能只变成代价。",points:[0,0,1,2,0,0]},
    {label:"C",text:"把能保存的留下，接受人生无法完整。",points:[0,1,2,0,0,0]},
    {label:"D",text:"争取第三种安排，不急着接受二选一。",points:[0,2,0,0,1,0]},
  ]},
  { id:23, figure:"韩信", era:"西汉", scene:"背水列阵", situation:"井陉之战中，汉军兵力处于劣势，新募士卒又缺少稳定军心，常规布阵很难取胜。", power:"以反常布阵逼出求生意志，同时派奇兵夺营，用战术设计改变士气与胜负条件。", cost:"高风险策略一旦失效便无路可退，成功也强化了他依靠极端局势解决问题的方式。", prompt:"当团队松散、普通激励已经不起作用时，你会不会主动制造压力？", options:[
    {label:"A",text:"会，明确的生死线才能逼出真正投入。",points:[1,0,0,0,2,0]},
    {label:"B",text:"先拿一个小胜，士气不该只靠恐惧。",points:[0,1,1,1,0,0]},
    {label:"C",text:"先看问题出在能力还是意愿，再决定强度。",points:[0,0,0,0,0,2]},
    {label:"D",text:"把目标、分工和退路都说清，再统一行动。",points:[2,0,1,0,0,0]},
  ]},
  { id:24, figure:"张良", era:"西汉", scene:"功成身退", situation:"辅佐刘邦建立汉朝后，新的权力秩序开始清理不确定因素，昔日功劳未必等于未来安全。", power:"以长期判断和对权力边界的敏感，在关键时刻降低存在感，逐步离开权力中心。", cost:"抽身保全了自己，也意味着主动放下影响力，并与曾经投入的一切保持距离。", prompt:"一件大事成功后，你察觉环境已经开始变化，最可能怎样安排自己？", options:[
    {label:"A",text:"把经验交出去，尽早减少对我的依赖。",points:[1,0,1,1,0,0]},
    {label:"B",text:"趁影响力还在，把下一套秩序建完整。",points:[2,0,0,0,1,0]},
    {label:"C",text:"先观察风向，不让功劳遮住新的风险。",points:[0,0,1,0,0,2]},
    {label:"D",text:"转去做一件更自由、也更像自己的事。",points:[0,2,0,0,1,0]},
  ]},
  { id:25, figure:"屈原", era:"战国", scene:"放逐行吟", situation:"政治主张不被采纳，又因谗言被疏远放逐，他与楚国之间的认同却始终没有真正切断。", power:"以价值坚持、判断和诗歌表达保存理想，让个人处境成为对时代的追问。", cost:"不愿妥协带来长期孤立，理想与现实的断裂也把他推向极端痛苦。", prompt:"当你珍视的集体不断否定你，而你又无法真正放下它时，你最需要什么？", options:[
    {label:"A",text:"保留表达，至少不能让自己的判断被抹掉。",points:[0,1,0,0,0,2]},
    {label:"B",text:"找到仍理解我的人，不再独自证明一切。",points:[0,0,1,2,0,0]},
    {label:"C",text:"把理想换一种形式继续，不困在原位置。",points:[0,2,0,0,1,0]},
    {label:"D",text:"重新判断这份坚持是否还在保护我。",points:[0,0,1,0,0,2]},
  ]},
  { id:26, figure:"唐太宗", era:"唐代", scene:"纳谏用人", situation:"新王朝需要稳定，皇帝拥有最终权力，却也最容易只听见自己愿意听的话。", power:"容纳魏征等人的直谏，把反对意见变成修正决策和观察自身盲点的工具。", cost:"开放批评会削弱表面的权威感，也要求掌权者反复承受不舒服甚至难堪的提醒。", prompt:"一个下属当众指出你的判断有问题，你的第一反应更接近什么？", options:[
    {label:"A",text:"先把场面稳住，规则和位置不能被冲散。",points:[2,0,1,0,0,0]},
    {label:"B",text:"先听证据，难听不代表他说得不对。",points:[0,0,0,0,0,2]},
    {label:"C",text:"会在意表达方式，但也想理解他的压力。",points:[0,0,0,2,0,1]},
    {label:"D",text:"马上用一个小验证判断谁更接近事实。",points:[0,1,0,0,2,0]},
  ]},
];

export const questions: Question[] = [...baseQuestions, ...hiddenQuestions];
export const QUESTION_SET_SIZE = 20;

type Profile = {
  name:string; gender:"female"|"male"; era:string; role:string; tags:string[]; quote:string; target:Vector;
  core:string[]; strengths:string[]; cost:string; boundary:string; advice:string;
};

export const profiles: Profile[] = [
  {name:"王阳明",gender:"male",era:"明代",role:"知行者",tags:["知行合一","破迷见心","临局定性"],quote:"你不等待世界变简单，先让自己的心有一个落点。",target:[76,72,84,68,75,86],core:["信息越杂乱，你越需要回到内心认可的准星，再用行动确认它是否真实。你不轻易被喧哗左右，也很难在尚未想清时随便表态。","这种笃定能让你在复杂局面中站稳，也可能让别人误以为你过于坚持。你的成长不在于放弃原则，而在于允许新事实修正理解。"],strengths:["把困惑转化为可执行的一步","在压力中守住判断与节奏","不靠外界掌声确认价值"],cost:"容易把尚未想透的事情独自扛太久，也可能因追求内外一致而显得不够松弛。",boundary:"坚定不等于拒绝修正；真正的知行合一也包含对新事实的诚实。",advice:"把最重要的判断写成一句可验证的话，并在三天内用一个小行动验证它。"},
  {name:"诸葛亮",gender:"male",era:"蜀汉",role:"秩序设计者",tags:["谋定后动","长期主义","责任在肩"],quote:"你习惯先把所有变量摆上桌面，再决定哪一步值得落子。",target:[92,58,82,70,62,88],core:["你天然关注全局、资源与后果，常能在别人只看眼前时提前发现风险。责任感让你愿意替团队补上被忽略的部分。","优势的另一面，是你可能把所有可能性都背在自己身上。真正稳固的秩序，需要让别人也能承担。"],strengths:["复杂任务拆解与统筹","提前识别关键风险","在长期压力下维持标准"],cost:"容易过度负责，把协作变成独自托底；也会因为准备充分才行动而错过窗口。",boundary:"谨慎应服务于行动，不应成为推迟行动的理由。",advice:"选出一个只有你必须负责的部分，其余至少交给一个可信的人共同完成。"},
  {name:"李白",gender:"male",era:"盛唐",role:"自由创造者",tags:["天马行空","真性流动","破格而行"],quote:"当所有人沿着旧路前进，你更容易听见另一条路的召唤。",target:[42,96,58,72,81,68],core:["你对可能性极其敏感，擅长把看似不相干的经验连成新路。自由并非任性，而是你保持生命力的方式。","但灵感不能替代落地。若不为创造建立最小结构，许多珍贵想法会只停留在开端。"],strengths:["迅速发现新鲜路径","用表达感染与连接他人","在限制之外重写规则"],cost:"容易厌倦重复和收尾，也可能在现实阻力出现时突然抽离。",boundary:"自由需要承担选择的后果，创造也需要完成。",advice:"为最想做的事设一个七天可交付版本，不求完整，只求真正落地。"},
  {name:"曹操",gender:"male",era:"东汉末",role:"乱局行动者",tags:["识势决断","用人不疑","破局求生"],quote:"局势不会等人，你更相信在行动中修正答案。",target:[88,74,76,52,94,86],core:["你对机会和威胁的变化非常敏锐，倾向于迅速形成判断并调动资源。别人犹豫时，你往往已经开始试探下一步。","速度给你优势，也可能压缩关系中的解释空间。真正强大的执行，不只是赢下当下，还能留下愿意继续同行的人。"],strengths:["在不确定中迅速决断","看见人才并调动资源","承受争议仍推进目标"],cost:"容易把效率放在感受之前，也可能因为防御心而过早判断他人。",boundary:"果断不是忽略代价；真正的掌控包含对人心和后果的计算。",advice:"下一次重大决定前，额外问一个人：这个方案会让谁承担我尚未看见的代价？"},
  {name:"武则天",gender:"female",era:"唐代",role:"权局掌舵者",tags:["洞察权局","决断非凡","自我定义"],quote:"你不把别人给出的身份当作边界，更愿意亲手定义自己的位置。",target:[94,73,88,56,90,89],core:["你能敏锐识别规则背后的权力关系，也愿意在关键时刻承担决断。评价并不会轻易改变你的方向。","强大让你不易被动，却也可能让脆弱无处安放。成熟的掌控不是永远警惕，而是知道何时可以信任。"],strengths:["在复杂关系中识别真实筹码","不被既定身份限制","面对压力仍能作出决断"],cost:"容易把防御变成习惯，也可能让亲近的人难以确定你的真实感受。",boundary:"清醒不等于处处设防；权力感也不必以关系疏离为代价。",advice:"在一段重要关系中，说出一个不带策略的真实需要，观察对方如何回应。"},
  {name:"花木兰",gender:"female",era:"北朝传说",role:"担当践行者",tags:["临事担当","柔韧坚定","功成归真"],quote:"你很少高声宣告勇敢，真正需要时却会向前一步。",target:[72,60,92,82,88,66],core:["你对责任与关系都有很深的感受，遇到真正重要的事，会把顾虑变成行动。你的可靠常常不是表现出来的，而是一次次做出来的。","但长期承担会让你忽略自己的疲惫。勇敢不是永不需要照顾，而是能在承担与归还之间找到边界。"],strengths:["关键时刻承担责任","在压力下保持稳定行动","兼顾任务和他人处境"],cost:"容易先照顾所有人，最后才发现自己的需要一直被延后。",boundary:"担当不是无限承受；把责任还给应该负责的人，也是成熟。",advice:"列出一件并不真正属于你的责任，并在本周明确地把它归还出去。"},
  {name:"李清照",gender:"female",era:"两宋",role:"敏锐记录者",tags:["感受入微","清醒自持","以笔存真"],quote:"你看见别人略过的变化，也因此比别人更早感到风向。",target:[52,84,70,94,45,90],core:["你对语言、关系和氛围的细小变化非常敏感，能捕捉那些尚未被说出的部分。真实感受是你理解世界的重要入口。","敏锐也意味着更容易被环境消耗。你不需要让自己变得迟钝，而需要为感受建立出口和边界。"],strengths:["捕捉细微情绪和变化","把复杂感受表达清楚","在动荡中保存真实经验"],cost:"容易反复回看关系中的细节，把敏锐变成对自己的消耗。",boundary:"感受是真实的信息，但不一定是全部事实。",advice:"当情绪被触发时，分别写下“我感受到什么”和“我能确认的事实”，暂时不要混为一谈。"},
  {name:"冯太后",gender:"female",era:"北魏",role:"制度塑造者",tags:["深谋持重","秩序重建","以静制动"],quote:"你擅长把一时的胜负，转化成能够长久运行的规则。",target:[96,64,91,62,77,88],core:["你不满足于解决眼前的问题，更在意怎样减少同类问题再次发生。耐心、结构感与对长期后果的关注，让你适合处理复杂系统。","但制度感过强时，也可能让你忽略个体此刻的感受。规则真正有效，必须让人愿意在其中生活。"],strengths:["从混乱中建立可持续秩序","长期观察后稳健出手","把个人经验沉淀为规则"],cost:"容易把情绪视为噪音，也可能因追求稳妥而减少必要的试错。",boundary:"秩序应保护人，而不是让人只为秩序服务。",advice:"检视一条你正在坚持的规则：它解决的旧问题是否仍然存在？"},
];

export type TestPreference = "female" | "male" | "all";

const initialVolumeSwaps: Record<TestPreference, { baseIds: number[]; hiddenIds: number[] }> = {
  female: { baseIds:[2, 14], hiddenIds:[21, 22] },
  male: { baseIds:[4, 12], hiddenIds:[23, 24] },
  all: { baseIds:[7, 16], hiddenIds:[25, 26] },
};

function shuffled<T>(values: T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function replaceBaseQuestions(baseIds: number[], replacements: Question[]): Question[] {
  const replacementById = new Map(baseIds.map((id, index) => [id, replacements[index]]));
  return baseQuestions.map((question) => replacementById.get(question.id) ?? question);
}

export function selectQuestions(preference: TestPreference, retake = false, random: () => number = Math.random): Question[] {
  if (retake) {
    const baseIds = shuffled(baseQuestions.map(({ id }) => id), random).slice(0, hiddenQuestions.length);
    return replaceBaseQuestions(baseIds, shuffled(hiddenQuestions, random));
  }
  const volume = initialVolumeSwaps[preference];
  const replacements = volume.hiddenIds.map((id) => hiddenQuestions.find((question) => question.id === id));
  return replaceBaseQuestions(volume.baseIds, replacements.filter((question): question is Question => Boolean(question)));
}

export function publicQuestions(preference: TestPreference = "all", retake = false): PublicQuestion[] {
  return selectQuestions(preference, retake).map(({ id, figure, era, scene, situation, power, cost, prompt, options }) => ({
    id,
    figure,
    era,
    scene,
    situation,
    power,
    cost,
    prompt,
    options: options.map(({ label, text }) => ({ label, text })),
  }));
}

export function calculateResult(questionIds: number[], answers: number[], preference: TestPreference) {
  const selectedQuestions = questionIds
    .map((id) => questions.find((question) => question.id === id))
    .filter((question): question is Question => Boolean(question));
  if (selectedQuestions.length !== questionIds.length) throw new Error("题卷包含未知题目");
  const raw: Vector = [0,0,0,0,0,0];
  const maxima: Vector = [0,0,0,0,0,0];
  selectedQuestions.forEach((question, index) => {
    const selected = question.options[answers[index]];
    selected.points.forEach((value, dimension) => { raw[dimension] += value; });
    question.options.forEach((option) => option.points.forEach((value, dimension) => { maxima[dimension] += Math.max(0, value / question.options.length); }));
  });
  const values = raw.map((score, index) => Math.round(35 + Math.min(1, score / Math.max(1, maxima[index] * 1.55)) * 55)) as Vector;
  const candidates = profiles.filter((profile) => preference === "all" || profile.gender === preference);
  const profile = candidates.reduce((best, current) => {
    const distance = current.target.reduce((sum, target, index) => sum + Math.pow(target - values[index], 2), 0);
    return distance < best.distance ? { profile: current, distance } : best;
  }, { profile: candidates[0], distance: Number.POSITIVE_INFINITY }).profile;
  return { ...profile, values, dimensions, index: profiles.indexOf(profile) + 1, total: profiles.length };
}

/**
 * 私生模拟器 - 事件库（JS版本）
 * 从 events.json 复制而来，可直接通过 <script> 标签加载
 */

window.EVENT_LIBRARY = {
  
  coreEvents: [
    {
      id: 'flight_failed',
      name: '卡机票',
      description: '登机口外，VIP通道的门紧闭。广播响起——林屿森乘坐的航班已经开始登机。你站在人群里，看着那道门，心跳擂在耳膜上。',
      trigger: { condition: 'progress >= 5', weight: 15, cooldown: 3 },
      options: [
        {
          text: '买黄牛票硬闯',
          action: 'buy_ticket_black',
          effects: { money: -2000, stamina: -10, progress: 8 },
          successRate: 0.4,
          failEffects: { stealth: -30, sanity: -5 },
          risk: 'high'
        },
        {
          text: '放弃，另找机会',
          action: 'give_up_flight',
          effects: { stamina: -15, progress: -3, sanity: -5 },
          risk: 'low'
        },
        {
          text: '买经济舱跟着',
          action: 'buy_economy',
          effects: { money: -1500, stamina: -5, progress: 5, stealth: -10 },
          risk: 'medium'
        }
      ]
    },
    {
      id: 'vip_pass_empty',
      name: 'VIP通道走空',
      description: '苦等三小时，腿已经麻了。机场工作人员开始收拾引导牌——他早从另一个出口走了。窗外，车尾灯在夜色里拖成两道红线，消失了。',
      trigger: { condition: 'progress >= 10', weight: 20, cooldown: 2 },
      forced: true,
      options: [
        {
          text: '认栽，回酒店休息',
          action: 'rest_hotel',
          effects: { stamina: +20, money: -200, sanity: -10 },
          risk: 'low'
        },
        {
          text: '打探特殊通道位置',
          action: 'research_vip_route',
          effects: { money: -300, stealth: -5, progress: 3 },
          risk: 'medium'
        }
      ]
    },
    {
      id: 'gps_tracker',
      name: '装车底定位器',
      description: '地下停车场弥漫着机油味。保姆车熄着火，安静得像一头沉睡的巨兽。你蹲在车底，手里攥着GPS定位器，指关节泛白。',
      trigger: { condition: 'progress >= 20 && stealth >= 50', weight: 10, cooldown: 5 },
      options: [
        {
          text: '立刻安装',
          action: 'install_gps',
          effects: { money: -500, stealth: -40 },
          successRate: 0.55,
          successEffects: { progress: 25 },
          failEffects: { stealth: -50, sanity: -15 },
          risk: 'extreme'
        },
        {
          text: '先观察安保情况',
          action: 'observe_security',
          effects: { stamina: -10, stealth: -5 },
          successRate: 0.7,
          successEffects: { progress: 5 },
          failEffects: { progress: -5 },
          risk: 'high'
        }
      ]
    },
    {
      id: 'underground_bait',
      name: '地库蹲守分身术',
      description: '两辆一模一样的保姆车同时驶出地库。尾灯划破黑暗，往两个完全相反的方向散去。你只来得及看清一道车牌尾号——另一辆，已经消失在拐角。',
      trigger: { condition: 'progress >= 30', weight: 18, cooldown: 3 },
      options: [
        {
          text: '猛踩油门追另一辆',
          action: 'chase_wrong_car',
          effects: { money: -300, stamina: -20, stealth: -20, progress: -10, sanity: -15 },
          risk: 'extreme'
        },
        {
          text: '冷静分析路线',
          action: 'analyze_route',
          effects: { stamina: -10, sanity: -5 },
          successRate: 0.5,
          successEffects: { progress: 8 },
          failEffects: { progress: -5 },
          risk: 'medium'
        }
      ]
    },
    {
      id: 'phone_deleted',
      name: '近距离手机被删',
      description: '助理划过你手机屏幕，一张张照片缩进垃圾桶。"最后一次，明白吗？"林屿森从你身边经过，没有看你一眼。',
      trigger: { condition: 'progress >= 40', weight: 22, cooldown: 2 },
      options: [
        {
          text: '配合删照片，假装路人粉',
          action: 'pretend_innocent',
          effects: { stealth: -35, sanity: -10, progress: -15 },
          risk: 'medium'
        },
        {
          text: '反抗，保护手机',
          action: 'resist_deletion',
          effects: { stealth: -60, money: -2000, sanity: -20, progress: -20 },
          risk: 'extreme',
          riskEvent: 'police_involved'
        },
        {
          text: '跪地求饶装可怜',
          action: 'fake_surrender',
          effects: { sanity: -25, stealth: -10 },
          successRate: 0.6,
          successEffects: { progress: 5 },
          failEffects: { stealth: -40, progress: -10 },
          risk: 'high'
        }
      ]
    },
    {
      id: 'camera_wiped',
      name: 'Staff格式化相机',
      description: '快门声出卖了你。助理把存储卡拔出来塞进口袋。"滚。"两个字，没有多余的表情。',
      trigger: { condition: 'progress >= 25 && stealth <= 40', weight: 25, cooldown: 4 },
      forced: true,
      options: [
        {
          text: '跪求放过',
          action: 'beg_forgiveness',
          effects: { sanity: -30, money: -1000, stealth: -15, progress: -30 },
          risk: 'high'
        },
        {
          text: '硬刚，威胁报警',
          action: 'threaten_police',
          effects: { stealth: -50, sanity: -20, money: -3000, progress: -40 },
          risk: 'extreme',
          riskEvent: 'blacklist'
        }
      ]
    },
    {
      id: 'trash_treasure',
      name: '翻垃圾桶获门牌',
      description: '凌晨两点，酒店后巷。厨余垃圾的味道直冲鼻腔。你戴着手套的手在剩饭和包装盒之间翻找，指尖触到一张被撕碎的快递单——上面有房间号。',
      trigger: { condition: 'true', weight: 30, cooldown: 2 },
      options: [
        {
          text: '拼凑碎片获取地址',
          action: 'decrypt_trash',
          effects: { sanity: -15, stealth: -5 },
          successRate: 0.65,
          successEffects: { progress: 20, stealth: +10 },
          failEffects: { sanity: -10, progress: 5 },
          risk: 'medium'
        },
        {
          text: '太恶心了，放弃',
          action: 'abandon_trash',
          effects: { sanity: -5 },
          risk: 'low'
        }
      ]
    },
    {
      id: 'rent_building',
      name: '租对面楼的房子',
      description: '中介推开窗，灰尘飞扬。对面阳台上晾着一件衬衫——那是林屿森的房间。你深吸一口气，房产证上的名字不重要。',
      trigger: { condition: 'progress >= 35 && money >= 8000', weight: 8, cooldown: 10, oneTime: true },
      forced: true,
      options: [
        {
          text: '租下，月租 ¥4500',
          action: 'rent_apartment',
          effects: { money: -4500, stealth: +30, sanity: +15 },
          permanent: { rentedApartment: true, dailyProgress: 3, dailyCostReduction: 0.8 },
          risk: 'high'
        },
        {
          text: '太冒险了，再想想',
          action: 'defer_rent',
          effects: { sanity: -5 },
          risk: 'low'
        }
      ]
    }
  ],

  dailyEvents: [
    {
      id: 'idol_gossip',
      name: '刷到林屿森热搜',
      description: '热搜第一：#林屿森新剧路透#。评论区粉丝在尖叫。你缩在出租屋的床上，屏幕的光映在脸上。这个人，正在改变你的生活。',
      trigger: { condition: 'true', weight: 40 },
      effects: { sanity: -10, stealth: +5 },
      options: [
        { text: '跟着粉丝一起嗨', action: 'watch_drama', effects: { sanity: +5 }, risk: 'low' },
        { text: '冷静吃瓜', action: 'fan_war_ignore', effects: {}, risk: 'low' },
        { text: '下场控评', action: 'protect_idol', effects: { stamina: -15, sanity: +10 }, risk: 'medium' }
      ]
    },
    {
      id: 'fan_war',
      name: '粉圈骂战',
      description: '对家在超话阴阳怪气。"演技差、资源咖"——每一条都在扎你的心。你的手指悬在键盘上。骂，还是不骂？',
      trigger: { condition: 'true', weight: 35 },
      effects: { sanity: -15 },
      options: [
        { text: '下场对骂', action: 'fan_war_attack', effects: { sanity: -20, stamina: -10 }, risk: 'high' },
        { text: '冷静举报', action: 'fan_war_report', effects: { stamina: -5, stealth: -5 }, risk: 'low' },
        { text: '退出不看', action: 'fan_war_ignore2', effects: { sanity: +5 }, risk: 'low' }
      ]
    },
    {
      id: 'false_alarm',
      name: '假情报',
      description: '你花 ¥800 从情报贩子那买了林屿森今天的行程。酒店地址、房间号、甚至穿了什么颜色的衣服。赶到时——前台说这位客人一周前就退房了。',
      trigger: { condition: 'progress >= 15', weight: 30 },
      effects: { money: -800, sanity: -10 },
      options: [
        { text: '认栽', action: 'accept_loss', effects: { sanity: -5 }, risk: 'low' },
        { text: '找情报贩子算账', action: 'confront_informant', effects: { stealth: -15, sanity: -10 }, risk: 'high' }
      ]
    },
    {
      id: 'rest_day',
      name: '休整日',
      description: '连续多日奔波后，你决定休息一天。拉上窗帘，房间暗得像地下室。你躺在床上，盯着天花板。他现在在哪里？在做什么？',
      trigger: { condition: 'stamina <= 30', weight: 50 },
      options: [
        { text: '好好睡一觉', action: 'rest_properly', effects: { stamina: +30, sanity: +10, money: -100 }, risk: 'low' },
        { text: '看他的剧集打发时间', action: 'watch_show', effects: { sanity: +5 }, risk: 'low' },
        { text: '根本睡不着，满脑子都是他', action: 'cant_sleep', effects: { stamina: +5, sanity: -15 }, risk: 'medium' }
      ]
    },
    {
      id: 'hucker_ad',
      name: '黄牛推销',
      description: '微信弹出一条消息："林屿森下周行程单，¥500，要的来。"你点开看了看，比你花了 ¥2000 搞到的还详细。妈的。',
      trigger: { condition: 'progress >= 10', weight: 35 },
      effects: {},
      options: [
        { text: '买一份试试', action: 'buy_info', effects: { money: -500, progress: 3 }, risk: 'medium' },
        { text: '研究他们的情报源', action: 'research_info', effects: { stamina: -10, sanity: -5 }, risk: 'low' },
        { text: '无视，你已经过了相信黄牛的阶段', action: 'ignore_hucker', effects: {}, risk: 'low' }
      ]
    }
  ],

  randomEvents: [
    {
      id: 'idol_stared',
      name: '林屿森直视了你',
      description: '机场到达大厅，茫茫人海。他的目光扫过来——然后停住了。两米距离，你们对视了整整一秒。他皱了皱眉，转身上了保姆车，没有说一个字。',
      trigger: { condition: 'stealth <= 40', weight: 50 },
      forced: true,
      effects: { stealth: -15, sanity: -20, progress: 3 },
      options: [
        { text: '假装什么都没发生', action: 'pretend_noticed', effects: { sanity: -5 }, risk: 'low' },
        { text: '追上去喊他名字', action: 'rush_greet', effects: { stealth: -40, sanity: -15, progress: 10 }, risk: 'extreme', riskEvent: 'security_called' },
        { text: '默默目送他离开', action: 'watch_leave', effects: { sanity: -10 }, risk: 'low' }
      ]
    },
    {
      id: 'phone_smashed',
      name: '手机被砸',
      description: '你举着手机拍他上车。他的保镖两步冲过来，一把打掉你的手机，屏幕摔得粉碎。"说了多少次了？"保镖的声音不大，但每个字都像钉子。',
      trigger: { condition: 'progress >= 20 && stealth <= 50', weight: 55 },
      forced: true,
      effects: { stealth: -30, sanity: -20 },
      options: [
        { text: '捡起手机，默默离开', action: 'accept_smash', effects: { money: -1500, progress: -5 }, risk: 'medium' },
        { text: '理论，说自己只是粉丝', action: 'argue_back', effects: { stealth: -30, sanity: -15 }, risk: 'high', riskEvent: 'police_involved' },
        { text: '当场摔在地上大哭', action: 'fake_cry', effects: { sanity: -25, stealth: -10 }, risk: 'medium' }
      ]
    },
    {
      id: 'sasaeng_exclude',
      name: '被其他私生排挤',
      description: '登机口，几个熟面孔的私生饭聚在一起。她们看了你一眼，然后故意把登机牌晃了晃——那是同一班航班。她们知道你是谁，她们不喜欢你。',
      trigger: { condition: 'progress >= 25', weight: 45 },
      forced: true,
      effects: { sanity: -15, stealth: -10 },
      options: [
        { text: '主动示好，交换情报', action: 'sasaeng_friend', effects: { money: -300, progress: 5 }, risk: 'medium' },
        { text: '硬刚，不跟她们一起', action: 'sasaeng_alone', effects: { stealth: -5, sanity: -10 }, risk: 'low' },
        { text: '直接不登这班机了', action: 'give_up_flight2', effects: { stamina: -10, progress: -3 }, risk: 'low' },
        { text: '去向她们的管理员告状', action: 'sasaeng_report', effects: { stealth: -20, sanity: -10 }, risk: 'high' }
      ]
    },
    {
      id: 'dog_press',
      name: '被狗仔拍到',
      description: '长焦镜头在你身后轻轻一响。你回头——狗仔老周，你认识他，上个月他把林屿森在酒店的偷拍照卖了两万。他对你笑了笑，收起了相机。',
      trigger: { condition: 'stealth <= 35', weight: 50 },
      forced: true,
      effects: { stealth: -40, sanity: -20 },
      options: [
        { text: '付钱封口，五千', action: 'pay_silencer', effects: { money: -5000 }, risk: 'extreme' },
        { text: '谈判，三千，否则举报他', action: 'counter_blackmail', effects: { stealth: -20, sanity: -10 }, risk: 'high' },
        { text: '装作不认识走开', action: 'ignore_狗仔', effects: { stealth: -15 }, risk: 'medium' },
        { text: '直接抢他相机', action: 'grab_camera', effects: { stealth: -60, sanity: -15 }, risk: 'extreme', riskEvent: 'police_involved' }
      ]
    },
    {
      id: 'id_card_found',
      name: '身份证暴露',
      description: '安检的时候，你从口袋里掏身份证——掉出来一张写过字的名片。上面是你的笔迹："林屿森行程 3.15 北京"。安保低头看了一眼，然后叫来了同事。',
      trigger: { condition: 'progress >= 15 && stealth <= 45', weight: 40 },
      forced: true,
      effects: { stealth: -50, sanity: -25 },
      options: [
        { text: '说是帮朋友查的', action: 'fake_explain', effects: { stealth: -10, sanity: -10 }, risk: 'high' },
        { text: '认栽，删掉那张纸', action: 'accept_exposed', effects: { progress: -10 }, risk: 'medium' },
        { text: '迅速撕掉塞嘴里', action: 'eat_paper', effects: { sanity: -15 }, risk: 'medium' }
      ]
    },
    {
      id: 'fake_staff',
      name: '假扮工作人员',
      description: '你花两百块从网上买了套假工作证，印着"林屿森工作室"。穿上马甲混进活动现场，安保扫了你一眼——然后低头看了看你胸前的工牌。',
      trigger: { condition: 'progress >= 30', weight: 40 },
      options: [
        { text: '镇定，装作很忙的样子往里走', action: 'pretend_staff', effects: { stealth: -20, progress: 15 }, successRate: 0.45, failEffects: { stealth: -50, sanity: -20, progress: -5 }, risk: 'high' },
        { text: '主动和安保打招呼套近乎', action: 'staff_friendly', effects: { stealth: -10, money: -200, progress: 8 }, risk: 'medium' },
        { text: '算了，赶紧撤', action: 'staff_giveup', effects: { stealth: -15, sanity: -5 }, risk: 'low' }
      ]
    },
    {
      id: 'home_exposed',
      name: '住址被曝光',
      description: '粉圈群里突然转了一张截图——是你的社交媒体定位，显示你家的小区名字。下面有人评论："原来住这里啊。"你手抖着删掉了那条动态，但转发已经出去了。',
      trigger: { condition: 'daysElapsed >= 10', weight: 35 },
      forced: true,
      effects: { stealth: -60, sanity: -30 },
      options: [
        { text: '换住处，彻底消失几天', action: 'change_location', effects: { money: -3000, stealth: +20 }, risk: 'high' },
        { text: '装作没事，不回应', action: 'ignore_exposed', effects: { sanity: -20 }, risk: 'medium' },
        { text: '注销所有社交账号', action: 'delete_accounts', effects: { stealth: +10, sanity: -15 }, risk: 'medium' }
      ]
    },
    {
      id: 'stolen_identity',
      name: '身份被顶替',
      description: '另一个私生饭用你的照片和名字注册了社交账号，冒充你去和狗仔交易。等你发现的时候，那个账号已经在粉圈里传遍了——所有人都在说你是个骗子。',
      trigger: { condition: 'progress >= 40', weight: 30 },
      forced: true,
      effects: { stealth: -40, sanity: -20 },
      options: [
        { text: '发声明澄清，但没人信', action: 'declare_wrong', effects: { sanity: -15 }, risk: 'high' },
        { text: '找到那个人当面对质', action: 'confront_thief', effects: { stealth: -20, sanity: -15 }, risk: 'extreme' },
        { text: '不管了，专心追星', action: 'ignore_theft', effects: { sanity: -10 }, risk: 'low' }
      ]
    },
    {
      id: 'hotel_room_found',
      name: '查到房间号',
      description: '你在酒店大堂的前台系统里看到了林屿森的房间号——1802。你盯着那个数字，心跳加速。电梯就在十米外。',
      trigger: { condition: 'progress >= 50 && stealth >= 30', weight: 35 },
      forced: true,
      effects: { sanity: -15 },
      options: [
        { text: '直接上十八楼', action: 'go_to_room', effects: { stealth: -70, sanity: -20, progress: 20 }, risk: 'extreme', riskEvent: 'police_involved' },
        { text: '在附近开个房间蹲守', action: 'rent_nearby_room', effects: { money: -800, stealth: -10, progress: 8 }, risk: 'high' },
        { text: '算了，太冒险了', action: 'give_up_room', effects: { sanity: -10, progress: -3 }, risk: 'low' }
      ]
    },
    {
      id: 'car_chase',
      name: '保姆车竞速',
      description: '林屿森的保姆车突然发动了。你跳上租来的车，猛踩油门跟上。两车在夜色里飙到一百八，前方有测速摄像头。他的车突然减速，你冲过去了。',
      trigger: { condition: 'progress >= 35', weight: 40 },
      options: [
        { text: '继续追，跟到目的地', action: 'keep_chasing', effects: { money: -500, stamina: -20, stealth: -30, progress: 15 }, risk: 'extreme', riskEvent: 'police_involved' },
        { text: '减速，找个地方停下来', action: 'slow_down', effects: { stamina: -10, stealth: -10 }, risk: 'medium' },
        { text: '认了，被拍到超速就完了', action: 'give_up_chase', effects: { progress: 5, stealth: -5 }, risk: 'low' }
      ]
    },
    {
      id: 'fan_meet_crashed',
      name: '见面会闯入',
      description: '粉丝见面会的后台入口只有一个保安。你攥着假工作证排练了三天的借口：送工作人员的咖啡、给经纪人递资料、迷路了的新人——选哪个？',
      trigger: { condition: 'progress >= 20', weight: 45 },
      options: [
        { text: '装作送咖啡的混进去', action: 'pose_coffee', effects: { money: -50, stealth: -25, progress: 12 }, successRate: 0.5, failEffects: { stealth: -45, sanity: -10 }, risk: 'high' },
        { text: '亮假工作证硬闯', action: 'force_entry', effects: { stealth: -60, sanity: -15, progress: 8 }, risk: 'extreme', riskEvent: 'blacklist' },
        { text: '在门口等，看能不能偶遇', action: 'wait_door', effects: { stamina: -20, stealth: -10, progress: 3 }, risk: 'low' }
      ]
    },
    {
      id: 'family_call',
      name: '父母来电话',
      description: '手机屏幕亮起"妈"。今天是你离开家的第二十三天。他们以为你在北京实习，每晚视频通话你已经编了二十三套不同的借口。',
      trigger: { condition: 'daysElapsed >= 7', weight: 55 },
      forced: true,
      effects: { sanity: -10 },
      options: [
        { text: '接电话敷衍应付', action: 'fake_excuse2', effects: { sanity: -5, stealth: -5 }, risk: 'low' },
        { text: '发微信说在忙，待会回', action: 'delay_response', effects: { sanity: -10 }, risk: 'low' },
        { text: '直接挂掉', action: 'ignore_family2', effects: { sanity: -20 }, risk: 'medium' },
        { text: '坦白：妈，我想回家', action: 'confess_home', effects: { sanity: +10, money: -1000 }, risk: 'medium' }
      ]
    },
    {
      id: 'neighbor_exposed',
      name: '邻居发现了',
      description: '对门的阿姨敲了敲你的门。"小姑娘，我家孩子说你天天半夜不睡觉，举着手机对着对面楼拍……"她的眼神里有一种你读不懂的意味。',
      trigger: { condition: 'daysElapsed >= 14', weight: 35 },
      forced: true,
      effects: { stealth: -30, sanity: -15 },
      options: [
        { text: '说是实习公司在做调研', action: 'lie_neighbor', effects: { stealth: -10 }, risk: 'medium' },
        { text: '装傻，说不懂她在说什么', action: 'play_dumb', effects: { stealth: -5 }, risk: 'low' },
        { text: '第二天就搬家', action: 'move_away', effects: { money: -2000, stealth: +30 }, risk: 'high' }
      ]
    },
    {
      id: 'video_leaked',
      name: '你的跟踪视频被曝光',
      description: '有人在B站上传了一段视频：你蹲在林屿森酒店窗外的阳台上，被保安拽下来的画面。弹幕在刷"私生饭去死""变态"。播放量一小时破了十万。',
      trigger: { condition: 'stealth <= 20', weight: 45 },
      forced: true,
      effects: { stealth: -80, sanity: -40 },
      options: [
        { text: '找律师维权（花钱）', action: 'lawyer_up', effects: { money: -10000, sanity: -10 }, risk: 'high' },
        { text: '注销所有账号消失', action: 'disappear', effects: { stealth: +10, sanity: -30 }, risk: 'medium' },
        { text: '买水军控评（烧钱）', action: 'buy_water', effects: { money: -5000, stealth: -20 }, risk: 'extreme' }
      ]
    },
    {
      id: 'rival_seller',
      name: '情报被对家截胡',
      description: '你花八百块买的情报，刚刚到货。但几乎同时，粉圈里有人放出了更低的价格——三百。你意识到，你们用的是同一个情报源，而他已经把情报卖给了所有人。',
      trigger: { condition: 'progress >= 30', weight: 40 },
      forced: true,
      effects: { sanity: -15 },
      options: [
        { text: '找更贵的独家渠道', action: 'find_expensive', effects: { money: -2000, progress: 5 }, risk: 'high' },
        { text: '低价转卖情报止损', action: 'resell_cheap', effects: { money: +200, stealth: -15 }, risk: 'medium' },
        { text: '换个偶像追算了', action: 'give_up_idol', effects: { sanity: +10 }, risk: 'extreme' }
      ]
    }
  ],

  endgameEvents: [
    {
      id: 'final_photo',
      name: '绝密照片到手',
      description: '快门声在寂静中格外响亮。那张照片——足以毁掉一个人的那张——正躺在你的手机相册里。',
      trigger: { condition: 'progress >= 100' },
      forced: true,
      options: []
    }
  ],

  riskEvents: {
    police_involved: {
      name: '报警处理',
      effects: { money: -3000, sanity: -30, stealth: -80, progress: -50 }
    },
    blacklist: {
      name: '进入黑名单',
      effects: { stealth: -100, progress: -30 }
    },
    security_called: {
      name: '安保介入',
      effects: { stealth: -50, sanity: -20, progress: -15 }
    }
  }
};

/**
 * 私生模拟器 - 核心游戏引擎
 * 管理状态机、事件触发、数值计算
 */

(function() {
  'use strict';

  // =============================================
  // 游戏状态
  // =============================================
  
  const GameState = {
    // 元数据
    id: null,
    createdAt: null,
    celebrity: null,
    daysElapsed: 0,
    currentPhase: 'playing', // 'playing' | 'god_view' | 'endgame' | 'ended'
    
    // 核心属性
    attributes: {
      stamina: 100,
      money: 5000,
      stealth: 100,
      sanity: 100
    },
    
    // 追踪进度
    progress: 0,
    
    // 特殊状态
    special: {
      rentedApartment: false,
      hasGPSDevice: false,
      isBlacklisted: false,
      hasSecretPhoto: false
    },
    
    // 事件记录
    eventHistory: [],
    choiceHistory: [],
    
    // 终局选择
    finalChoice: null,
    
    // 当前事件
    currentEvent: null,
    currentOptions: [],
    
    // 结算
    isGameOver: false,
    gameOverReason: null,
    endingId: null,
    
    // 深渊模式（神之视角）
    godViewMode: false,
    daysInGodView: 0
  };

  // =============================================
  // 事件选择器
  // =============================================
  
  function selectNextEvent() {
    const allEvents = [
      ...window.EVENT_LIBRARY.coreEvents,
      ...window.EVENT_LIBRARY.dailyEvents,
      ...window.EVENT_LIBRARY.randomEvents
    ];
    
    // 过滤可触发的事件
    const available = allEvents.filter(e => {
      // 检查冷却
      if (e.trigger?.cooldown) {
        const recentEvents = GameState.eventHistory.slice(-e.trigger.cooldown);
        if (recentEvents.includes(e.id)) return false;
      }
      
      // 检查一次性
      if (e.trigger?.oneTime && GameState.eventHistory.includes(e.id)) return false;
      
      // 检查黑名单
      if (GameState.special.isBlacklisted && !e.id.includes('warning')) {
        return false;
      }
      
      // 检查条件
      if (e.trigger?.condition) {
        return evaluateCondition(e.trigger.condition);
      }
      
      return true;
    });
    
    if (available.length === 0) {
      return window.EVENT_LIBRARY.dailyEvents.find(e => e.id === 'rest_day') || null;
    }
    
    // 加权随机选择
    const totalWeight = available.reduce((sum, e) => sum + (e.trigger?.weight || 10), 0);
    let random = Math.random() * totalWeight;
    
    for (const event of available) {
      random -= (event.trigger?.weight || 10);
      if (random <= 0) return event;
    }
    
    return available[0];
  }

  // =============================================
  // 条件求值器（简单的字符串表达式解析）
  // =============================================
  
  function evaluateCondition(condition) {
    try {
      // 安全替换变量
      const ctx = {
        stamina: GameState.attributes.stamina,
        money: GameState.attributes.money,
        stealth: GameState.attributes.stealth,
        sanity: GameState.attributes.sanity,
        progress: GameState.progress,
        daysElapsed: GameState.daysElapsed
      };
      
      let expr = condition;
      for (const [key, val] of Object.entries(ctx)) {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), val);
      }
      
      // 安全求值（只允许数值比较）
      return Function('"use strict"; return (' + expr + ')')();
    } catch (e) {
      console.warn('条件求值失败:', condition, e);
      return false;
    }
  }

  // =============================================
  // 事件处理
  // =============================================
  
  function processEvent(event) {
    if (!event) return null;
    
    // 检查强制事件
    const isForced = event.forced || false;
    
    // 解析选项
    let options = (event.options || []).map(opt => ({
      id: opt.action,
      text: opt.text,
      effects: opt.effects || {},
      successRate: opt.successRate,
      successEffects: opt.successEffects,
      failEffects: opt.failEffects,
      permanent: opt.permanent,
      riskEvent: opt.riskEvent
    }));
    
    // 如果没有选项，添加默认"继续"
    if (options.length === 0) {
      options.push({
        id: 'continue',
        text: '继续',
        effects: { stamina: -5 }
      });
    }
    
    return {
      eventId: event.id,
      eventName: event.name,
      description: event.description,
      forced: isForced,
      effects: event.effects,
      options: options,
      narrative: event.description // 简化：直接用描述作为叙述文本
    };
  }

  // =============================================
  // 选项执行
  // =============================================
  
  function executeChoice(option, eventId) {
    const result = {
      narrative: '',
      changes: {},
      options: [],
      isGameOver: false,
      isFinal: false,
      endingType: null
    };
    
    // 记录事件
    GameState.eventHistory.push(eventId);
    GameState.choiceHistory.push(option.id);
    
    // 处理成功率
    if (option.successRate !== undefined) {
      const roll = Math.random();
      if (roll <= option.successRate) {
        // 成功
        Object.assign(GameState.attributes, option.successEffects || {});
        result.changes = { ...option.successEffects };
      } else {
        // 失败
        Object.assign(GameState.attributes, option.failEffects || {});
        result.changes = { ...option.failEffects };
      }
    } else {
      // 普通选项
      Object.assign(GameState.attributes, option.effects || {});
      result.changes = { ...option.effects };
    }
    
    // 进度处理
    if (option.effects?.progress) {
      GameState.progress = Math.max(0, Math.min(100, GameState.progress + option.effects.progress));
    }
    if (option.successEffects?.progress) {
      GameState.progress = Math.max(0, Math.min(100, GameState.progress + option.successEffects.progress));
    }
    
    // 永久效果
    if (option.permanent) {
      Object.assign(GameState.special, option.permanent);
      if (option.permanent.dailyProgress) {
        GameState.special.dailyProgressBonus = option.permanent.dailyProgress;
      }
    }
    
    // 风险事件
    if (option.riskEvent) {
      const riskEvent = window.EVENT_LIBRARY.riskEvents[option.riskEvent];
      if (riskEvent) {
        Object.assign(GameState.attributes, riskEvent.effects);
        if (riskEvent.immediateGameOver) {
          GameState.isGameOver = true;
          GameState.gameOverReason = riskEvent.name;
        }
      }
    }
    
    // 每日结算
    GameState.daysElapsed++;
    applyDailyDrain();
    
    // 检查深渊模式触发
    if (GameState.progress >= 100 && !GameState.godViewMode) {
      return triggerEndgame(result);
    }
    
    // 检查游戏结束
    checkGameOver(result);
    
    // 生成下一个事件
    if (!result.isGameOver) {
      const nextEvent = selectNextEvent();
      const processedEvent = processEvent(nextEvent);
      GameState.currentEvent = processedEvent;
      
      result.narrative = processedEvent ? processedEvent.description : '又一天过去了……';
      result.options = processedEvent ? processedEvent.options : [];
    }
    
    return result;
  }

  // =============================================
  // 每日结算
  // =============================================
  
  function applyDailyDrain() {
    const config = window.GAME_CONFIG.game;
    
    // 基础消耗
    GameState.attributes.stamina = Math.max(0, 
      GameState.attributes.stamina - config.dailyDrain.stamina);
    GameState.attributes.money = Math.max(0, 
      GameState.attributes.money - config.dailyDrain.money);
    GameState.attributes.sanity = Math.max(0, 
      GameState.attributes.sanity - config.dailyDrain.sanity);
    
    // 隐蔽度每日小幅随机波动
    const stealthDelta = Math.floor(Math.random() * 11) - 5; // -5 到 +5
    GameState.attributes.stealth = Math.max(0, Math.min(100, 
      GameState.attributes.stealth + stealthDelta));
    
    // 租房子减免消耗
    if (GameState.special.rentedApartment) {
      GameState.attributes.money -= Math.floor(config.dailyDrain.money * 0.8);
      // 每日进度加成
      GameState.progress = Math.min(100, GameState.progress + (GameState.special.dailyProgressBonus || 0));
    }
    
    // 深渊模式：理智上限衰减
    if (GameState.progress >= config.sanityDecayThreshold * 100) {
      config.maxAttributes.sanity = Math.max(20, config.maxAttributes.sanity - 2);
      GameState.attributes.sanity = Math.min(GameState.attributes.sanity, config.maxAttributes.sanity);
      GameState.godViewMode = true;
      GameState.daysInGodView++;
    }
  }

  // =============================================
  // 终局触发
  // =============================================
  
  function triggerEndgame(result) {
    GameState.currentPhase = 'endgame';
    
    const endgameEvent = window.EVENT_LIBRARY.endgameEvents[0];
    
    result.narrative = `快门声在寂静中格外响亮。
    
那张照片——足以毁掉一个人的那张——正躺在你的手机相册里。
    
偶像的车灯消失在夜色中。他/她永远不会知道，刚才发生了什么。
    
但你知道。
    
现在，你要做什么？`;
    
    result.options = [
      {
        id: 'expose',
        text: '发送/曝光',
        effects: {},
        description: '让全世界看到真相'
      },
      {
        id: 'sell',
        text: '卖掉照片',
        effects: {},
        description: '用它换一笔钱'
      },
      {
        id: 'keep',
        text: '保留，不发',
        effects: {},
        description: '你有底牌，但你选择不用'
      }
    ];
    
    result.isFinal = true;
    result.changes = { progress: 0, sanity: -30 };
    
    GameState.attributes.sanity -= 30;
    GameState.special.hasSecretPhoto = true;
    
    return result;
  }

  // =============================================
  // 游戏结束检查
  // =============================================
  
  function checkGameOver(result) {
    const attrs = GameState.attributes;
    
    // 归零检查
    if (attrs.stamina <= 0) {
      return endGame('collapsed', result);
    }
    if (attrs.money <= 0) {
      return endGame('bankrupt', result);
    }
    if (attrs.stealth <= 0) {
      return endGame('exposed', result);
    }
    if (attrs.sanity <= 0) {
      return endGame('insane', result);
    }
    
    // 超时检查（偶像退圈）
    if (GameState.daysElapsed >= 90 && GameState.progress < 50) {
      return endGame('idol_quit', result);
    }
    
    return null;
  }

  // =============================================
  // 结束游戏
  // =============================================
  
  function endGame(endingId, result) {
    GameState.isGameOver = true;
    GameState.endingId = endingId;
    GameState.currentPhase = 'ended';
    
    const ending = [
      ...(window.ENDINGS.badEndings || []),
      ...(window.ENDINGS.neutralEndings || []),
      ...(window.ENDINGS.goodEndings || [])
    ].find(e => e.id === endingId);
    
    if (ending) {
      let narrative = ending.narrative;
      // 替换动态变量
      narrative = narrative.replace(/\{days\}/g, GameState.daysElapsed);
      
      result.narrative = `【${ending.title}】

${narrative}

${ending.afterword || ''}`;
      
      result.endingType = endingId;
    } else {
      result.narrative = '游戏结束。';
    }
    
    result.isGameOver = true;
    result.options = [
      {
        id: 'restart',
        text: '重新开始',
        effects: {},
        description: '再来一局'
      }
    ];
    
    return result;
  }

  // =============================================
  // 终局选择处理
  // =============================================
  
  function executeFinalChoice(choiceId) {
    const result = {
      narrative: '',
      changes: {},
      options: [],
      isGameOver: true,
      isFinal: true,
      endingType: choiceId
    };
    
    GameState.finalChoice = choiceId;
    
    let ending;
    if (choiceId === 'expose') {
      ending = window.ENDINGS.finalEndings.find(e => e.id === 'destruction');
    } else if (choiceId === 'sell') {
      ending = window.ENDINGS.finalEndings.find(e => e.id === 'blackmail');
    } else if (choiceId === 'keep') {
      ending = window.ENDINGS.finalEndings.find(e => e.id === 'god_view');
      GameState.godViewMode = true;
      GameState.currentPhase = 'god_view';
    }
    
    if (ending) {
      result.narrative = `【${ending.title}】

${ending.narrative}

${ending.afterword || ''}`;
      result.endingType = ending.id;
    }
    
    result.options = [
      {
        id: 'restart',
        text: '重新开始',
        effects: {},
        description: '再来一局'
      }
    ];
    
    return result;
  }

  // =============================================
  // 游戏初始化
  // =============================================
  
  function initGame() {
    const config = window.GAME_CONFIG.game;
    const celebrity = window.getRandomCelebrity();
    
    // 重置状态
    Object.assign(GameState, {
      id: Date.now().toString(36),
      createdAt: new Date().toISOString(),
      celebrity: celebrity,
      daysElapsed: 0,
      currentPhase: 'playing',
      attributes: { ...config.initialAttributes },
      progress: config.initialProgress,
      special: {
        rentedApartment: false,
        hasGPSDevice: false,
        isBlacklisted: false,
        hasSecretPhoto: false
      },
      eventHistory: [],
      choiceHistory: [],
      finalChoice: null,
      isGameOver: false,
      gameOverReason: null,
      endingId: null,
      godViewMode: false,
      daysInGodView: 0
    });
    
    // 第一个事件
    const firstEvent = selectNextEvent();
    const processedEvent = processEvent(firstEvent);
    GameState.currentEvent = processedEvent;
    
    return {
      status: 'ready',
      celebrity: {
        name: celebrity.name,
        alias: celebrity.alias,
        type: celebrity.type,
        difficulty: celebrity.difficulty
      },
      attributes: GameState.attributes,
      progress: GameState.progress,
      event: processedEvent,
      daysElapsed: GameState.daysElapsed
    };
  }

  // =============================================
  // 获取当前状态（用于 UI 更新）
  // =============================================
  
  function getCurrentState() {
    return {
      attributes: { ...GameState.attributes },
      progress: GameState.progress,
      currentEvent: GameState.currentEvent,
      daysElapsed: GameState.daysElapsed,
      isGameOver: GameState.isGameOver,
      isFinal: GameState.currentPhase === 'endgame',
      godViewMode: GameState.godViewMode,
      special: { ...GameState.special }
    };
  }

  // =============================================
  // 导出 API
  // =============================================
  
  window.SasaengSimulator = {
    init: initGame,
    getState: getCurrentState,
    executeChoice: executeChoice,
    executeFinalChoice: executeFinalChoice,
    evaluateCondition: evaluateCondition
  };

})();

/**
 * 私生模拟器 - OpenClaw API 集成
 * 处理与大语言模型后端的通信
 */

(function() {
  'use strict';

  // =============================================
  // API 配置
  // =============================================
  
  const config = () => window.GAME_CONFIG.api;
  
  // =============================================
  // 状态历史（用于上下文管理）
  // =============================================
  
  const conversationHistory = [];

  // =============================================
  // 构建 System Prompt
  // =============================================
  
  function buildSystemPrompt(celebrity, gameState) {
    const difficultyLabel = {
      extreme: '炼狱',
      hard: '困难',
      medium: '普通',
      easy: '简单'
    };

    return `【私生模拟器 - 游戏引擎】

你是"私生模拟器"游戏的叙事引擎。玩家扮演一个极端狂热的私生饭，追踪偶像 ${celebrity.name}（${celebrity.alias}，${celebrity.type}）。

## 当前游戏状态
- 偶像：${celebrity.name} | 难度：${difficultyLabel[celebrity.difficulty]} | 追踪进度：${gameState.progress}%
- 体力：${gameState.attributes.stamina}/100
- 资金：¥${gameState.attributes.money}
- 隐蔽度：${gameState.attributes.stealth}/100
- 理智：${gameState.attributes.sanity}/100
- 已追踪天数：${gameState.daysElapsed}天

## 游戏阶段
${gameState.currentPhase === 'endgame' ? '【终局阶段】玩家已获得绝密照片，即将做出最终抉择' : '【正常游戏】资源管理与风险决策'}

${gameState.godViewMode ? '【深渊模式】玩家进入了"神之视角"状态，理智上限正在持续衰减' : ''}

## 叙事风格要求
- 语言：简体中文，第一人称视角
- 语气：压抑、紧张、黑色幽默
- 细节：注重感官描写（天气、声音、气味）
- 节奏：每个叙事块不超过100字，制造悬念
- 禁止：直接描写暴力/色情内容

## 数值规则（严格遵守）
- 玩家资金低于¥2000时：必须显示"经济危机"相关叙事
- 隐蔽度低于30时：必须触发安保发现风险
- 理智低于30时：必须触发心理崩溃相关叙事
- 追踪进度每+10%，叙述紧张感提升一个等级

## 输出格式（严格遵守，仅输出JSON）
{
  "narrative": "叙事文本，描述当前场景的细节（100-200字）",
  "mood": "当前氛围关键词（2-3个）",
  "changes": {
    "stamina": 数值变化（含正负符号，如 -10 或 +5）,
    "money": 数值变化,
    "stealth": 数值变化,
    "sanity": 数值变化,
    "progress": 数值变化
  },
  "options": [
    {
      "id": "选项ID（英文）",
      "text": "选项文字（玩家看到的选择）",
      "risk": "low/medium/high/extreme",
      "description": "风险提示"
    }
  ],
  "isGameOver": false,
  "isFinal": false,
  "endingType": null
}

## 核心事件参考
1. 机票失败 - 高资金消耗
2. VIP通道走空 - 纯负面事件
3. GPS追踪器 - 高风险高回报
4. 地库蹲守 - 进度倒退风险
5. 手机被删 - 隐蔽度大幅下降
6. 相机被格式化 - 毁灭性打击
7. 翻垃圾桶 - 理智换进度
8. 租对面楼 - 巨额资金换长期优势

请根据当前状态，选择最合适的下一个事件，生成符合叙事的JSON输出。`;
  }

  // =============================================
  // 构建用户消息
  // =============================================
  
  function buildUserMessage(action, currentState, eventDescription) {
    const actionLabels = {
      'buy_ticket_black': '买黄牛票硬闯',
      'give_up_flight': '放弃航班',
      'buy_economy': '买经济舱跟随',
      'rest_hotel': '回酒店休息',
      'install_gps': '安装GPS定位器',
      'chase_wrong_car': '追错车',
      'resist_deletion': '反抗保护手机',
      'pretend_innocent': '假装路人粉',
      'decrypt_trash': '翻垃圾桶解密',
      'rent_apartment': '租对面楼的房子',
      'accept_loss': '认栽',
      'confront_informant': '找情报贩子算账',
      'watch_drama': '吃瓜看戏',
      'fan_war_attack': '下场对骂',
      'rest_day': '休整一天',
      'continue': '继续行动'
    };

    return `玩家选择了：${actionLabels[action] || action}

当前状态：
- 体力：${currentState.attributes.stamina}/100
- 资金：¥${currentState.attributes.money}
- 隐蔽度：${currentState.attributes.stealth}/100
- 理智：${currentState.attributes.sanity}/100
- 进度：${currentState.progress}%

请生成这个选择的结果叙事和下一个可选事件。`;
  }

  // =============================================
  // 调用 OpenClaw API
  // =============================================
  
  async function callOpenClaw(messages, temperature = 0.8) {
    const cfg = config();
    
    try {
      const response = await fetch(`${cfg.baseUrl}${cfg.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cfg.apiKey}`
        },
        body: JSON.stringify({
          model: cfg.model,
          messages: messages,
          temperature: temperature,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 调用失败:', error);
      throw error;
    }
  }

  // =============================================
  // 解析 LLM 返回的 JSON
  // =============================================
  
  function parseLLMResponse(text) {
    try {
      // 尝试提取 JSON 块
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析 JSON');
    } catch (error) {
      console.warn('JSON 解析失败，尝试修复:', error);
      // 回退到本地处理
      return null;
    }
  }

  // =============================================
  // 主游戏循环（与 LLM 交互）
  // =============================================
  
  async function playWithLLM(action, gameState, celebrity) {
    const systemPrompt = buildSystemPrompt(celebrity, gameState);
    
    // 构建消息历史
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // 添加历史
    conversationHistory.forEach(msg => {
      messages.push(msg);
    });
    
    // 添加当前行动
    const userMessage = buildUserMessage(action, gameState, gameState.currentEvent?.description);
    messages.push({ role: 'user', content: userMessage });
    
    // 调用 API
    let response;
    try {
      response = await callOpenClaw(messages);
    } catch (error) {
      // API 失败时回退到本地引擎
      console.warn('LLM 不可用，回退到本地引擎');
      return null;
    }
    
    // 解析响应
    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      console.warn('API 返回内容为空');
      return null;
    }
    
    // 保存到历史
    conversationHistory.push({ role: 'user', content: userMessage });
    conversationHistory.push({ role: 'assistant', content: content });
    
    // 限制历史长度
    if (conversationHistory.length > 20) {
      conversationHistory.splice(0, 4);
    }
    
    return parseLLMResponse(content);
  }

  // =============================================
  // 模式选择：本地引擎 vs LLM 增强
  // =============================================
  
  async function processAction(action) {
    const gameState = window.SasaengSimulator.getState();
    
    // 优先尝试 LLM
    if (window.GAME_CONFIG.api.apiKey && window.GAME_CONFIG.api.apiKey !== 'YOUR_OPENCLAW_API_KEY') {
      try {
        const llmResult = await playWithLLM(action, gameState, GameState.celebrity);
        if (llmResult) {
          return llmResult;
        }
      } catch (e) {
        console.warn('LLM 模式失败:', e);
      }
    }
    
    // 回退到本地引擎
    return window.SasaengSimulator.executeChoice({ id: action }, gameState.currentEvent?.eventId);
  }

  // =============================================
  // 重置对话历史
  // =============================================
  
  function resetConversation() {
    conversationHistory.length = 0;
  }

  // =============================================
  // 导出 API
  // =============================================
  
  window.GameAPI = {
    processAction: processAction,
    resetConversation: resetConversation,
    buildSystemPrompt: buildSystemPrompt
  };

})();

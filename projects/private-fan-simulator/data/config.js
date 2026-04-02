/**
 * 私生模拟器 - 核心配置文件
 * 这里是你唯一需要手动修改的地方
 */

window.GAME_CONFIG = {
  // ==========================================
  // API 配置 - 替换为你自己的配置
  // ==========================================
  api: {
    // 方案 A: OpenClaw 本地网关（如果你在 Mac mini 上运行）
    baseUrl: 'http://localhost:18789',
    endpoint: '/api/chat',
    apiKey: 'YOUR_OPENCLAW_API_KEY', // 本地网关通常不需要 key，留空或填 sk-local
    
    // 方案 B: MiniMax API（如果你想直接调用）
    // baseUrl: 'https://api.minimax.chat',
    // endpoint: '/v1/text/chatcompletion_v2',
    // apiKey: 'YOUR_MINIMAX_API_KEY',
    
    // 方案 C: OpenAI 兼容接口
    // baseUrl: 'https://api.openai.com',
    // endpoint: '/v1/chat/completions',
    // apiKey: 'YOUR_OPENAI_API_KEY',
    
    // 模型选择
    model: 'MiniMax-M2.5-Highspeed',
  },

  // ==========================================
  // 游戏数值配置
  // ==========================================
  game: {
    // 初始属性
    initialAttributes: {
      stamina: 100,
      money: 5000,
      stealth: 100,
      sanity: 100
    },
    
    // 追踪进度（百分比）
    initialProgress: 0,
    
    // 每日基础消耗
    dailyDrain: {
      stamina: 5,
      money: 50,
      sanity: 3
    },
    
    // 属性上限
    maxAttributes: {
      stamina: 100,
      money: Infinity, // 钱没有上限，但会归零触发 Game Over
      stealth: 100,
      sanity: 100
    },
    
    // 属性下限（归零阈值）
    minAttributes: {
      stamina: 0,
      money: 0,
      stealth: 0,
      sanity: 0
    },
    
    // 理智衰减阶段（进度达到后，理智上限开始下降）
    sanityDecayThreshold: 0.70, // 70% 进度时开始
    
    // 游戏模式
    mode: 'normal', // 'normal' | 'god_view' | 'endgame'
    
    // 调试模式（显示更多日志）
    debug: false
  }
};

// 导出配置（Node.js 环境用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.GAME_CONFIG;
}

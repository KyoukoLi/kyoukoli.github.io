/**
 * 私生模拟器 - 偶像配置（ MVP 单偶像版）
 */

window.CELEBRITY_POOL = [
  {
    id: 'default',
    name: '林屿森',
    alias: '森森',
    gender: 'male',
    type: '顶流男演员',
    difficulty: 'hard',
    riskProfile: {
      security_level: '高',
      privacy_level: '高',
      staff_vigilance: '警觉',
      media_exposure: '极高'
    },
    profile: {
      age: 27,
      height: '185cm',
      base: '横店 / 北京',
      schedule: '剧组拍戏 + 代言活动 + 粉丝见面会',
      personality: '对私生饭极度反感，团队零容忍',
      note: '顶流中的顶流，安保严密，曾有私生饭被起诉的先例'
    },
    specialTrait: '他会主动记住私生饭的脸并通知团队'
  }
];

window.getRandomCelebrity = function() {
  return window.CELEBRITY_POOL[0];
};

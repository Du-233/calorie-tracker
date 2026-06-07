// ============================================
// 🌸 小食光 — 情绪化语句
// ============================================

const MOOD_MESSAGES = [
  { max: 0,   msg: "今天还没记录呢，快去吃点好吃的吧～🍳" },
  { max: 30,  msg: "今天吃得超克制！你是自律小仙女～✨" },
  { max: 60,  msg: "节奏刚刚好，继续保持这份优雅呀～🌸" },
  { max: 85,  msg: "差不多啦，晚上喝杯水就好，别再吃咯～🍵" },
  { max: 100, msg: "今天刚刚好达标！明天也要这么棒～💪" },
  { max: 120, msg: "稍微多吃了一点点，没关系，明天散散步就好～🚶‍♀️" },
  { max: 150, msg: "哎呀今天有点放飞啦～不过开心最重要！明天收一收哦～🍃" },
  { max: Infinity, msg: "今天吃得有点多呢…但每顿都拍得好好看！明天重新出发吧～🌈" },
];

function getMoodMessage(percentage) {
  if (percentage === 0) return MOOD_MESSAGES[0].msg;
  for (const m of MOOD_MESSAGES) {
    if (percentage <= m.max) return m.msg;
  }
  return MOOD_MESSAGES[MOOD_MESSAGES.length - 1].msg;
}

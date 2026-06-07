// ============================================
// 🌸 小食光 — 中国常见食物卡路里数据库
// 每100g卡路里 + 预设份量
// ============================================

const FOOD_DB = [
  // ── 🍚 主食类 ──
  { name: "白米饭", cal: 116, portions: [
    { label: "1碗", grams: 200 }, { label: "半碗", grams: 100 }, { label: "1小碗", grams: 150 }
  ]},
  { name: "糙米饭", cal: 123, portions: [
    { label: "1碗", grams: 200 }, { label: "半碗", grams: 100 }
  ]},
  { name: "白粥", cal: 46, portions: [
    { label: "1碗", grams: 300 }, { label: "1小碗", grams: 200 }
  ]},
  { name: "小米粥", cal: 46, portions: [
    { label: "1碗", grams: 300 }, { label: "1小碗", grams: 200 }
  ]},
  { name: "皮蛋瘦肉粥", cal: 55, portions: [
    { label: "1碗", grams: 350 }, { label: "1小碗", grams: 200 }
  ]},
  { name: "馒头", cal: 223, portions: [
    { label: "1个", grams: 100 }, { label: "半个", grams: 50 }
  ]},
  { name: "花卷", cal: 214, portions: [
    { label: "1个", grams: 80 }, { label: "2个", grams: 160 }
  ]},
  { name: "包子(猪肉)", cal: 227, portions: [
    { label: "1个", grams: 80 }, { label: "2个", grams: 160 }
  ]},
  { name: "小笼包", cal: 230, portions: [
    { label: "1笼(6个)", grams: 150 }, { label: "半笼(3个)", grams: 75 }
  ]},
  { name: "饺子(猪肉)", cal: 240, portions: [
    { label: "10个", grams: 200 }, { label: "15个", grams: 300 }, { label: "5个", grams: 100 }
  ]},
  { name: "馄饨", cal: 180, portions: [
    { label: "1碗(10个)", grams: 250 }, { label: "1小碗(6个)", grams: 150 }
  ]},
  { name: "面条(煮)", cal: 110, portions: [
    { label: "1大碗", grams: 400 }, { label: "1小碗", grams: 250 }
  ]},
  { name: "油条", cal: 388, portions: [
    { label: "1根", grams: 70 }, { label: "半根", grams: 35 }
  ]},
  { name: "烧饼", cal: 326, portions: [
    { label: "1个", grams: 80 }, { label: "半个", grams: 40 }
  ]},
  { name: "葱油饼", cal: 310, portions: [
    { label: "1张", grams: 100 }, { label: "半张", grams: 50 }
  ]},
  { name: "手抓饼", cal: 305, portions: [
    { label: "1张", grams: 120 }, { label: "半张", grams: 60 }
  ]},
  { name: "杂粮煎饼", cal: 250, portions: [
    { label: "1个", grams: 150 }, { label: "半个", grams: 75 }
  ]},
  { name: "肉夹馍", cal: 228, portions: [
    { label: "1个", grams: 150 }, { label: "半个", grams: 75 }
  ]},
  { name: "肠粉", cal: 110, portions: [
    { label: "1份", grams: 250 }, { label: "半份", grams: 125 }
  ]},
  { name: "凉皮", cal: 117, portions: [
    { label: "1份", grams: 300 }, { label: "半份", grams: 150 }
  ]},
  { name: "炒饭(蛋炒饭)", cal: 188, portions: [
    { label: "1盘", grams: 300 }, { label: "半盘", grams: 150 }
  ]},
  { name: "炒面", cal: 195, portions: [
    { label: "1盘", grams: 350 }, { label: "半盘", grams: 175 }
  ]},
  { name: "炒河粉", cal: 180, portions: [
    { label: "1盘", grams: 350 }, { label: "半盘", grams: 175 }
  ]},
  { name: "粽子", cal: 195, portions: [
    { label: "1个", grams: 120 }, { label: "半个", grams: 60 }
  ]},
  { name: "汤圆", cal: 231, portions: [
    { label: "5个", grams: 100 }, { label: "10个", grams: 200 }
  ]},
  { name: "年糕", cal: 154, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "吐司面包", cal: 278, portions: [
    { label: "1片", grams: 40 }, { label: "2片", grams: 80 }
  ]},
  { name: "全麦面包", cal: 246, portions: [
    { label: "1片", grams: 40 }, { label: "2片", grams: 80 }
  ]},
  { name: "牛角包", cal: 406, portions: [
    { label: "1个", grams: 60 }, { label: "2个", grams: 120 }
  ]},
  { name: "燕麦片(冲)", cal: 377, portions: [
    { label: "1碗(泡好)", grams: 250 }, { label: "1小碗", grams: 150 }
  ]},
  { name: "煮玉米", cal: 112, portions: [
    { label: "1根", grams: 200 }, { label: "半根", grams: 100 }
  ]},
  { name: "烤红薯", cal: 131, portions: [
    { label: "1个(中)", grams: 200 }, { label: "1个(小)", grams: 100 }
  ]},
  { name: "煮土豆", cal: 76, portions: [
    { label: "1个(中)", grams: 150 }, { label: "1个(大)", grams: 300 }
  ]},
  { name: "寿司", cal: 140, portions: [
    { label: "6个", grams: 150 }, { label: "10个", grams: 250 }
  ]},
  { name: "饭团", cal: 170, portions: [
    { label: "1个", grams: 120 }, { label: "2个", grams: 240 }
  ]},

  // ── 🥩 肉类 ──
  { name: "红烧肉", cal: 478, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "回锅肉", cal: 285, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "糖醋排骨", cal: 295, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "红烧排骨", cal: 280, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "红烧牛肉", cal: 190, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "宫保鸡丁", cal: 200, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "辣子鸡", cal: 250, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "烤鸭", cal: 336, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "叉烧", cal: 262, portions: [
    { label: "1份", grams: 120 }, { label: "半份", grams: 60 }
  ]},
  { name: "卤肉饭", cal: 220, portions: [
    { label: "1碗", grams: 350 }, { label: "半碗", grams: 175 }
  ]},
  { name: "梅菜扣肉", cal: 350, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "粉蒸肉", cal: 320, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "红烧狮子头", cal: 240, portions: [
    { label: "1个", grams: 120 }, { label: "2个", grams: 240 }
  ]},
  { name: "京酱肉丝", cal: 210, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "鱼香肉丝", cal: 180, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "木须肉", cal: 160, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "锅包肉", cal: 270, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "东坡肉", cal: 450, portions: [
    { label: "1块", grams: 100 }, { label: "2块", grams: 200 }
  ]},
  { name: "烤羊排", cal: 290, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "红烧牛腩", cal: 195, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "酱牛肉", cal: 246, portions: [
    { label: "1份", grams: 120 }, { label: "半份", grams: 60 }
  ]},
  { name: "白切鸡", cal: 200, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "口水鸡", cal: 230, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "黄焖鸡", cal: 190, portions: [
    { label: "1份", grams: 250 }, { label: "半份", grams: 125 }
  ]},
  { name: "可乐鸡翅", cal: 230, portions: [
    { label: "5个", grams: 150 }, { label: "3个", grams: 90 }
  ]},
  { name: "烤鸡腿", cal: 220, portions: [
    { label: "1个", grams: 150 }, { label: "2个", grams: 300 }
  ]},
  { name: "炸鸡腿", cal: 290, portions: [
    { label: "1个", grams: 130 }, { label: "2个", grams: 260 }
  ]},
  { name: "炸鸡排", cal: 280, portions: [
    { label: "1块", grams: 150 }, { label: "半块", grams: 75 }
  ]},
  { name: "炸鸡块", cal: 300, portions: [
    { label: "6块", grams: 150 }, { label: "10块", grams: 250 }
  ]},
  { name: "鸡胸肉(煮)", cal: 133, portions: [
    { label: "1块", grams: 150 }, { label: "半块", grams: 75 }
  ]},
  { name: "培根", cal: 541, portions: [
    { label: "2片", grams: 30 }, { label: "4片", grams: 60 }
  ]},
  { name: "火腿肠", cal: 212, portions: [
    { label: "1根", grams: 50 }, { label: "2根", grams: 100 }
  ]},
  { name: "香肠", cal: 400, portions: [
    { label: "1根", grams: 60 }, { label: "2根", grams: 120 }
  ]},
  { name: "午餐肉", cal: 230, portions: [
    { label: "2片", grams: 60 }, { label: "4片", grams: 120 }
  ]},

  // ── 🐟 海鲜类 ──
  { name: "清蒸鱼", cal: 120, portions: [
    { label: "1条(中)", grams: 300 }, { label: "半条", grams: 150 }
  ]},
  { name: "红烧鱼", cal: 160, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "酸菜鱼", cal: 110, portions: [
    { label: "1份", grams: 300 }, { label: "半份", grams: 150 }
  ]},
  { name: "水煮鱼", cal: 150, portions: [
    { label: "1份", grams: 300 }, { label: "半份", grams: 150 }
  ]},
  { name: "烤鱼", cal: 180, portions: [
    { label: "1份", grams: 350 }, { label: "半份", grams: 175 }
  ]},
  { name: "油焖大虾", cal: 120, portions: [
    { label: "1份(8只)", grams: 200 }, { label: "半份(4只)", grams: 100 }
  ]},
  { name: "白灼虾", cal: 99, portions: [
    { label: "1份(10只)", grams: 250 }, { label: "半份(5只)", grams: 125 }
  ]},
  { name: "蒜蓉扇贝", cal: 110, portions: [
    { label: "6个", grams: 180 }, { label: "3个", grams: 90 }
  ]},
  { name: "清蒸螃蟹", cal: 103, portions: [
    { label: "1只(中)", grams: 300 }, { label: "2只", grams: 600 }
  ]},
  { name: "三文鱼刺身", cal: 208, portions: [
    { label: "5片", grams: 60 }, { label: "10片", grams: 120 }
  ]},
  { name: "金枪鱼刺身", cal: 144, portions: [
    { label: "5片", grams: 60 }, { label: "10片", grams: 120 }
  ]},
  { name: "炒花甲", cal: 80, portions: [
    { label: "1份", grams: 300 }, { label: "半份", grams: 150 }
  ]},
  { name: "铁板鱿鱼", cal: 100, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "炸鱼排", cal: 230, portions: [
    { label: "1块", grams: 120 }, { label: "2块", grams: 240 }
  ]},

  // ── 🥬 蔬菜豆制品 ──
  { name: "番茄炒蛋", cal: 120, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "麻婆豆腐", cal: 130, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "家常豆腐", cal: 150, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "炒青菜", cal: 50, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "蒜蓉西兰花", cal: 55, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "炒豆芽", cal: 45, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "干煸四季豆", cal: 90, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "地三鲜", cal: 120, portions: [
    { label: "1份", grams: 220 }, { label: "半份", grams: 110 }
  ]},
  { name: "炒土豆丝", cal: 100, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "烧茄子", cal: 140, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "凉拌黄瓜", cal: 25, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},
  { name: "凉拌木耳", cal: 60, portions: [
    { label: "1份", grams: 120 }, { label: "半份", grams: 60 }
  ]},
  { name: "手撕包菜", cal: 70, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "蚝油生菜", cal: 35, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "蒸蛋羹", cal: 60, portions: [
    { label: "1碗", grams: 150 }, { label: "半碗", grams: 75 }
  ]},
  { name: "皮蛋豆腐", cal: 80, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "韭菜炒蛋", cal: 140, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "虾仁炒蛋", cal: 150, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "苦瓜炒蛋", cal: 100, portions: [
    { label: "1份", grams: 180 }, { label: "半份", grams: 90 }
  ]},
  { name: "蔬菜沙拉", cal: 40, portions: [
    { label: "1份", grams: 200 }, { label: "半份", grams: 100 }
  ]},
  { name: "土豆泥", cal: 105, portions: [
    { label: "1份", grams: 150 }, { label: "半份", grams: 75 }
  ]},

  // ── 🍜 汤面/粉类 ──
  { name: "红烧牛肉面", cal: 98, portions: [
    { label: "1大碗", grams: 500 }, { label: "1小碗", grams: 300 }
  ]},
  { name: "兰州拉面", cal: 110, portions: [
    { label: "1大碗", grams: 450 }, { label: "1小碗", grams: 280 }
  ]},
  { name: "炸酱面", cal: 160, portions: [
    { label: "1碗", grams: 350 }, { label: "半碗", grams: 175 }
  ]},
  { name: "担担面", cal: 140, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "热干面", cal: 150, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "重庆小面", cal: 130, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "酸辣粉", cal: 120, portions: [
    { label: "1碗", grams: 350 }, { label: "半碗", grams: 175 }
  ]},
  { name: "螺蛳粉", cal: 130, portions: [
    { label: "1碗", grams: 380 }, { label: "半碗", grams: 190 }
  ]},
  { name: "麻辣烫", cal: 80, portions: [
    { label: "1碗", grams: 400 }, { label: "半碗", grams: 200 }
  ]},
  { name: "过桥米线", cal: 100, portions: [
    { label: "1碗", grams: 400 }, { label: "半碗", grams: 200 }
  ]},
  { name: "方便面(泡)", cal: 470, portions: [
    { label: "1包", grams: 100 }, { label: "半包", grams: 50 }
  ]},
  { name: "意面(肉酱)", cal: 150, portions: [
    { label: "1盘", grams: 300 }, { label: "半盘", grams: 150 }
  ]},
  { name: "乌冬面", cal: 100, portions: [
    { label: "1碗", grams: 350 }, { label: "半碗", grams: 175 }
  ]},

  // ── 🍳 蛋类/早餐 ──
  { name: "煮鸡蛋", cal: 151, portions: [
    { label: "1个", grams: 55 }, { label: "2个", grams: 110 }
  ]},
  { name: "煎鸡蛋", cal: 210, portions: [
    { label: "1个", grams: 55 }, { label: "2个", grams: 110 }
  ]},
  { name: "炒鸡蛋", cal: 180, portions: [
    { label: "2个", grams: 110 }, { label: "1个", grams: 55 }
  ]},
  { name: "茶叶蛋", cal: 150, portions: [
    { label: "1个", grams: 55 }, { label: "2个", grams: 110 }
  ]},
  { name: "荷包蛋", cal: 200, portions: [
    { label: "1个", grams: 55 }, { label: "2个", grams: 110 }
  ]},
  { name: "豆浆", cal: 31, portions: [
    { label: "1杯", grams: 300 }, { label: "1大杯", grams: 500 }
  ]},
  { name: "豆腐脑(甜)", cal: 40, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "豆腐脑(咸)", cal: 50, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "牛奶(全脂)", cal: 65, portions: [
    { label: "1杯", grams: 250 }, { label: "1盒", grams: 200 }
  ]},
  { name: "牛奶(脱脂)", cal: 35, portions: [
    { label: "1杯", grams: 250 }, { label: "1盒", grams: 200 }
  ]},
  { name: "酸奶(原味)", cal: 72, portions: [
    { label: "1杯", grams: 200 }, { label: "1小盒", grams: 100 }
  ]},
  { name: "酸奶(果味)", cal: 95, portions: [
    { label: "1杯", grams: 200 }, { label: "1小盒", grams: 100 }
  ]},
  { name: "奶酪片", cal: 320, portions: [
    { label: "1片", grams: 20 }, { label: "2片", grams: 40 }
  ]},

  // ── 🍰 甜点零食 ──
  { name: "蛋糕(奶油)", cal: 350, portions: [
    { label: "1块", grams: 80 }, { label: "2块", grams: 160 }
  ]},
  { name: "蛋糕(芝士)", cal: 340, portions: [
    { label: "1块", grams: 100 }, { label: "半块", grams: 50 }
  ]},
  { name: "巧克力蛋糕", cal: 400, portions: [
    { label: "1块", grams: 80 }, { label: "半块", grams: 40 }
  ]},
  { name: "提拉米苏", cal: 310, portions: [
    { label: "1块", grams: 100 }, { label: "半块", grams: 50 }
  ]},
  { name: "布丁", cal: 130, portions: [
    { label: "1个", grams: 100 }, { label: "2个", grams: 200 }
  ]},
  { name: "曲奇饼干", cal: 500, portions: [
    { label: "3片", grams: 30 }, { label: "6片", grams: 60 }
  ]},
  { name: "奥利奥", cal: 480, portions: [
    { label: "3片", grams: 30 }, { label: "1包", grams: 100 }
  ]},
  { name: "薯片", cal: 540, portions: [
    { label: "1小包", grams: 40 }, { label: "1大包", grams: 100 }
  ]},
  { name: "爆米花", cal: 380, portions: [
    { label: "1桶(小)", grams: 80 }, { label: "1桶(大)", grams: 200 }
  ]},
  { name: "巧克力", cal: 550, portions: [
    { label: "1小块", grams: 15 }, { label: "1板", grams: 100 }
  ]},
  { name: "冰淇淋", cal: 200, portions: [
    { label: "1球", grams: 60 }, { label: "2球", grams: 120 }
  ]},
  { name: "冰淇淋(甜筒)", cal: 230, portions: [
    { label: "1个", grams: 100 }, { label: "2个", grams: 200 }
  ]},
  { name: "奶茶(珍珠)", cal: 80, portions: [
    { label: "1杯(中)", grams: 500 }, { label: "1杯(大)", grams: 700 }
  ]},
  { name: "奶茶(奶盖)", cal: 100, portions: [
    { label: "1杯(中)", grams: 500 }, { label: "1杯(大)", grams: 700 }
  ]},
  { name: "果茶", cal: 55, portions: [
    { label: "1杯(中)", grams: 500 }, { label: "1杯(大)", grams: 700 }
  ]},
  { name: "奶昔", cal: 120, portions: [
    { label: "1杯(中)", grams: 400 }, { label: "1杯(大)", grams: 600 }
  ]},
  { name: "甜甜圈", cal: 400, portions: [
    { label: "1个", grams: 60 }, { label: "2个", grams: 120 }
  ]},
  { name: "蛋挞", cal: 300, portions: [
    { label: "1个", grams: 60 }, { label: "2个", grams: 120 }
  ]},
  { name: "华夫饼", cal: 310, portions: [
    { label: "1块", grams: 80 }, { label: "2块", grams: 160 }
  ]},
  { name: "马卡龙", cal: 380, portions: [
    { label: "3个", grams: 45 }, { label: "6个", grams: 90 }
  ]},
  { name: "月饼", cal: 420, portions: [
    { label: "1个", grams: 100 }, { label: "半个", grams: 50 }
  ]},
  { name: "蛋黄酥", cal: 400, portions: [
    { label: "1个", grams: 60 }, { label: "2个", grams: 120 }
  ]},
  { name: "凤梨酥", cal: 420, portions: [
    { label: "1个", grams: 40 }, { label: "3个", grams: 120 }
  ]},
  { name: "绿豆糕", cal: 350, portions: [
    { label: "1块", grams: 40 }, { label: "3块", grams: 120 }
  ]},
  { name: "坚果(混合)", cal: 600, portions: [
    { label: "1小把", grams: 25 }, { label: "1大把", grams: 50 }
  ]},
  { name: "核桃", cal: 650, portions: [
    { label: "3个", grams: 20 }, { label: "6个", grams: 40 }
  ]},
  { name: "杏仁", cal: 580, portions: [
    { label: "1小把", grams: 25 }, { label: "1大把", grams: 50 }
  ]},
  { name: "牛肉干", cal: 310, portions: [
    { label: "1小包", grams: 50 }, { label: "1大包", grams: 100 }
  ]},
  { name: "猪肉脯", cal: 350, portions: [
    { label: "1片", grams: 30 }, { label: "3片", grams: 90 }
  ]},

  // ── 🍎 水果 ──
  { name: "苹果", cal: 53, portions: [
    { label: "1个(中)", grams: 200 }, { label: "半个", grams: 100 }
  ]},
  { name: "香蕉", cal: 93, portions: [
    { label: "1根(中)", grams: 120 }, { label: "2根", grams: 240 }
  ]},
  { name: "葡萄", cal: 70, portions: [
    { label: "1串", grams: 200 }, { label: "半串", grams: 100 }
  ]},
  { name: "西瓜", cal: 31, portions: [
    { label: "1块", grams: 300 }, { label: "2块", grams: 600 }
  ]},
  { name: "草莓", cal: 32, portions: [
    { label: "10颗", grams: 200 }, { label: "5颗", grams: 100 }
  ]},
  { name: "芒果", cal: 65, portions: [
    { label: "1个(中)", grams: 250 }, { label: "半个", grams: 125 }
  ]},
  { name: "橙子", cal: 48, portions: [
    { label: "1个(中)", grams: 200 }, { label: "2个", grams: 400 }
  ]},
  { name: "猕猴桃", cal: 61, portions: [
    { label: "1个", grams: 80 }, { label: "2个", grams: 160 }
  ]},
  { name: "梨", cal: 51, portions: [
    { label: "1个(中)", grams: 250 }, { label: "半个", grams: 125 }
  ]},
  { name: "桃子", cal: 48, portions: [
    { label: "1个(中)", grams: 200 }, { label: "半个", grams: 100 }
  ]},
  { name: "樱桃", cal: 46, portions: [
    { label: "1碗", grams: 150 }, { label: "半碗", grams: 75 }
  ]},
  { name: "蓝莓", cal: 57, portions: [
    { label: "1盒", grams: 125 }, { label: "半盒", grams: 60 }
  ]},
  { name: "火龙果", cal: 55, portions: [
    { label: "半个", grams: 200 }, { label: "1个", grams: 400 }
  ]},
  { name: "柚子", cal: 42, portions: [
    { label: "2瓣", grams: 150 }, { label: "4瓣", grams: 300 }
  ]},
  { name: "菠萝", cal: 44, portions: [
    { label: "1碗", grams: 150 }, { label: "半碗", grams: 75 }
  ]},
  { name: "哈密瓜", cal: 34, portions: [
    { label: "1碗", grams: 200 }, { label: "半碗", grams: 100 }
  ]},
  { name: "榴莲", cal: 147, portions: [
    { label: "2瓣", grams: 100 }, { label: "4瓣", grams: 200 }
  ]},
  { name: "牛油果", cal: 171, portions: [
    { label: "半个", grams: 70 }, { label: "1个", grams: 140 }
  ]},
  { name: "荔枝", cal: 70, portions: [
    { label: "10颗", grams: 200 }, { label: "5颗", grams: 100 }
  ]},
  { name: "龙眼", cal: 71, portions: [
    { label: "10颗", grams: 150 }, { label: "20颗", grams: 300 }
  ]},

  // ── 🥤 饮料 ──
  { name: "可乐", cal: 42, portions: [
    { label: "1罐", grams: 330 }, { label: "1瓶", grams: 500 }
  ]},
  { name: "雪碧", cal: 42, portions: [
    { label: "1罐", grams: 330 }, { label: "1瓶", grams: 500 }
  ]},
  { name: "橙汁", cal: 45, portions: [
    { label: "1杯", grams: 250 }, { label: "1瓶", grams: 500 }
  ]},
  { name: "苹果汁", cal: 46, portions: [
    { label: "1杯", grams: 250 }, { label: "1瓶", grams: 500 }
  ]},
  { name: "椰子水", cal: 19, portions: [
    { label: "1个", grams: 300 }, { label: "1瓶", grams: 500 }
  ]},
  { name: "拿铁咖啡", cal: 42, portions: [
    { label: "1杯(中)", grams: 350 }, { label: "1杯(大)", grams: 500 }
  ]},
  { name: "美式咖啡", cal: 10, portions: [
    { label: "1杯(中)", grams: 350 }, { label: "1杯(大)", grams: 500 }
  ]},
  { name: "卡布奇诺", cal: 35, portions: [
    { label: "1杯(中)", grams: 350 }, { label: "1杯(大)", grams: 500 }
  ]},
  { name: "摩卡咖啡", cal: 65, portions: [
    { label: "1杯(中)", grams: 350 }, { label: "1杯(大)", grams: 500 }
  ]},
  { name: "星冰乐", cal: 85, portions: [
    { label: "1杯(中)", grams: 400 }, { label: "1杯(大)", grams: 550 }
  ]},
  { name: "柠檬水", cal: 10, portions: [
    { label: "1杯", grams: 350 }, { label: "1大杯", grams: 600 }
  ]},
  { name: "蜂蜜水", cal: 30, portions: [
    { label: "1杯", grams: 300 }, { label: "1大杯", grams: 500 }
  ]},
  { name: "运动饮料", cal: 26, portions: [
    { label: "1瓶", grams: 500 }, { label: "半瓶", grams: 250 }
  ]},

  // ── 🍲 火锅/烧烤 ──
  { name: "火锅(麻辣锅底)", cal: 120, portions: [
    { label: "1人份", grams: 600 }, { label: "半人份", grams: 300 }
  ]},
  { name: "肥牛卷", cal: 250, portions: [
    { label: "1盘", grams: 150 }, { label: "半盘", grams: 75 }
  ]},
  { name: "羊肉卷", cal: 220, portions: [
    { label: "1盘", grams: 150 }, { label: "半盘", grams: 75 }
  ]},
  { name: "毛肚", cal: 110, portions: [
    { label: "1盘", grams: 120 }, { label: "半盘", grams: 60 }
  ]},
  { name: "虾滑", cal: 90, portions: [
    { label: "1份", grams: 120 }, { label: "半份", grams: 60 }
  ]},
  { name: "牛肉丸", cal: 180, portions: [
    { label: "5个", grams: 100 }, { label: "10个", grams: 200 }
  ]},
  { name: "鱼丸", cal: 100, portions: [
    { label: "5个", grams: 100 }, { label: "10个", grams: 200 }
  ]},
  { name: "羊肉串", cal: 220, portions: [
    { label: "5串", grams: 100 }, { label: "10串", grams: 200 }
  ]},
  { name: "烤鸡翅", cal: 240, portions: [
    { label: "3个", grams: 120 }, { label: "6个", grams: 240 }
  ]},
  { name: "烤韭菜", cal: 50, portions: [
    { label: "1份", grams: 100 }, { label: "2份", grams: 200 }
  ]},
  { name: "烤金针菇", cal: 40, portions: [
    { label: "1份", grams: 120 }, { label: "2份", grams: 240 }
  ]},
  { name: "烤茄子", cal: 60, portions: [
    { label: "1个", grams: 200 }, { label: "半个", grams: 100 }
  ]},

  // ── 🍱 日韩料理 ──
  { name: "石锅拌饭", cal: 160, portions: [
    { label: "1份", grams: 400 }, { label: "半份", grams: 200 }
  ]},
  { name: "韩式炸鸡", cal: 280, portions: [
    { label: "半只", grams: 200 }, { label: "1份(小)", grams: 100 }
  ]},
  { name: "泡菜汤", cal: 50, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "大酱汤", cal: 55, portions: [
    { label: "1碗", grams: 300 }, { label: "半碗", grams: 150 }
  ]},
  { name: "日式拉面", cal: 120, portions: [
    { label: "1碗", grams: 400 }, { label: "半碗", grams: 200 }
  ]},
  { name: "天妇罗", cal: 230, portions: [
    { label: "1份", grams: 120 }, { label: "半份", grams: 60 }
  ]},
  { name: "章鱼小丸子", cal: 160, portions: [
    { label: "6个", grams: 120 }, { label: "3个", grams: 60 }
  ]},
];

// 搜索食物
function searchFood(query) {
  if (!query || query.trim() === '') return [];
  const q = query.trim().toLowerCase();
  return FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 15);
}

// 按名称精确查找
function findFood(name) {
  return FOOD_DB.find(f => f.name === name);
}

// 计算卡路里
function calcCalories(foodName, grams) {
  const food = findFood(foodName);
  if (!food) return 0;
  return Math.round(food.cal * grams / 100);
}

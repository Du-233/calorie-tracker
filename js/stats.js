// ============================================
// 🌸 小食光 — 统计图表
// ============================================

let chartWeekInstance = null;
let chartMonthInstance = null;
let chartMealInstance = null;

const CHART_COLORS = {
  mint: '#A8E6CF',
  pink: '#FF9A9E',
  orange: '#FFB347',
  lavender: '#D5C6E0',
  pinkLight: '#FFE0E2',
  mintLight: '#D4F5E6',
};

// ── 本周柱状图 ──

function renderWeekChart() {
  const ctx = document.getElementById('chartWeek');
  if (!ctx) return;

  const days = [];
  const values = [];
  const goalLine = [];
  const goal = getSettings().goal;
  const today = new Date();

  // 获取本周一
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const ds = formatDate(d);
    const summary = getDaySummary(ds);
    const weekDays = ['一','二','三','四','五','六','日'];
    days.push(weekDays[i]);
    values.push(summary.totalCalories);
    goalLine.push(goal);
  }

  if (chartWeekInstance) chartWeekInstance.destroy();

  chartWeekInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: '摄入 (kcal)',
          data: values,
          backgroundColor: values.map(v => v > goal ? CHART_COLORS.pink : CHART_COLORS.mint),
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: '目标',
          data: goalLine,
          type: 'line',
          borderColor: CHART_COLORS.orange,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 11 } } },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#F5F0EB' }, ticks: { font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    },
  });
}

// ── 本月折线图 ──

function renderMonthChart() {
  const ctx = document.getElementById('chartMonth');
  if (!ctx) return;

  const goal = getSettings().goal;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  const labels = [];
  const values = [];
  const goalLine = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const summary = getDaySummary(ds);
    labels.push(`${d}日`);
    values.push(summary.totalCalories > 0 ? summary.totalCalories : null);
    goalLine.push(goal);
  }

  if (chartMonthInstance) chartMonthInstance.destroy();

  chartMonthInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '摄入 (kcal)',
          data: values,
          borderColor: CHART_COLORS.pink,
          backgroundColor: CHART_COLORS.pinkLight,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: CHART_COLORS.pink,
          spanGaps: false,
        },
        {
          label: '目标',
          data: goalLine,
          borderColor: CHART_COLORS.orange,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 11 } } },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#F5F0EB' }, ticks: { font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { maxTicksLimit: 15, font: { size: 9 } } },
      },
    },
  });
}

// ── 餐次占比饼图 ──

function renderMealChart() {
  const ctx = document.getElementById('chartMeal');
  if (!ctx) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const logs = getLogsByMonth(year, month);

  const mealTotals = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
  for (const log of logs) {
    if (mealTotals[log.meal] !== undefined) {
      mealTotals[log.meal] += log.calories;
    }
  }

  const labels = ['早餐', '午餐', '晚餐', '加餐'];
  const data = [mealTotals.breakfast, mealTotals.lunch, mealTotals.dinner, mealTotals.snack];
  const colors = [CHART_COLORS.orange, CHART_COLORS.pink, CHART_COLORS.lavender, CHART_COLORS.mint];

  if (chartMealInstance) chartMealInstance.destroy();

  const total = data.reduce((a,b) => a+b, 0);
  if (total === 0) {
    // 无数据时显示空饼图
    chartMealInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['暂无数据'], datasets: [{ data: [1], backgroundColor: ['#F0EBE5'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
    });
    return;
  }

  chartMealInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: 'white',
        hoverBorderColor: 'white',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, font: { size: 10 }, usePointStyle: true, pointStyleWidth: 8 } },
      },
    },
  });
}

// ── Top 5 食物 ──

function renderTopFoods() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const logs = getLogsByMonth(year, month);

  const counts = {};
  for (const log of logs) {
    counts[log.foodName] = (counts[log.foodName] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const el = document.getElementById('topFoods');
  if (!el) return;

  if (sorted.length === 0) {
    el.innerHTML = '<li style="color:#B8A899;text-align:center;padding:20px 0;">这个月还没记录呢～</li>';
    return;
  }

  const emojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  el.innerHTML = sorted.map(([name, count], i) => `
    <li>
      <span><span class="food-rank">${emojis[i]}</span> ${name}</span>
      <span class="food-count">${count} 次</span>
    </li>
  `).join('');
}

// ── 本月概览 ──

function renderMonthOverview() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const logs = getLogsByMonth(year, month);
  const goal = getSettings().goal;

  // 按天汇总
  const dayMap = {};
  for (const log of logs) {
    if (!dayMap[log.date]) dayMap[log.date] = 0;
    dayMap[log.date] += log.calories;
  }

  const days = Object.keys(dayMap);
  const totalCal = Object.values(dayMap).reduce((a,b) => a+b, 0);
  const daysRecorded = days.length;
  const daysOver = days.filter(d => dayMap[d] > goal).length;
  const avgCal = daysRecorded > 0 ? Math.round(totalCal / daysRecorded) : 0;
  const daysInMonth = new Date(year, month, 0).getDate();
  const recordRate = Math.round(daysRecorded / Math.min(daysInMonth, new Date().getDate()) * 100);

  const el = document.getElementById('monthOverview');
  if (!el) return;

  el.innerHTML = `
    <div class="month-stat">
      <div class="month-stat-value">${daysRecorded}</div>
      <div class="month-stat-label">记录天数</div>
    </div>
    <div class="month-stat">
      <div class="month-stat-value">${avgCal}</div>
      <div class="month-stat-label">日均 kcal</div>
    </div>
    <div class="month-stat">
      <div class="month-stat-value">${daysOver}</div>
      <div class="month-stat-label">超标天数</div>
    </div>
    <div class="month-stat">
      <div class="month-stat-value">${recordRate}%</div>
      <div class="month-stat-label">记录率</div>
    </div>
  `;
}

// ── 渲染统计页全部 ──

function renderStatsPage() {
  renderWeekChart();
  renderMonthChart();
  renderMealChart();
  renderTopFoods();
  renderMonthOverview();
}

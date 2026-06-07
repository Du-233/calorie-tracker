// ============================================
// 🌸 小食光 — 本地存储管理
// ============================================

const STORAGE_KEY_LOGS = 'xsg_food_logs';
const STORAGE_KEY_SETTINGS = 'xsg_settings';
const STORAGE_KEY_SYNC_META = 'xsg_sync_meta';

// ── 默认设置 ──
const DEFAULT_SETTINGS = {
  goal: 2000,
  ghUser: '',
  ghRepo: '',
  ghToken: '',
  keepPhotosDays: 30,
};

// ── 食物记录 CRUD ──

function getLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    // localStorage 满了
    showToast('存储空间不足，请清理旧照片或导出数据');
  }
}

function getLogsByDate(dateStr) {
  return getLogs().filter(l => l.date === dateStr);
}

function getLogsByDateAndMeal(dateStr, meal) {
  return getLogs().filter(l => l.date === dateStr && l.meal === meal);
}

function getLogsByMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getLogs().filter(l => l.date.startsWith(prefix));
}

function getLogById(id) {
  return getLogs().find(l => l.id === id);
}

function addLog(log) {
  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);
}

function updateLog(id, updates) {
  const logs = getLogs();
  const idx = logs.findIndex(l => l.id === id);
  if (idx !== -1) {
    logs[idx] = { ...logs[idx], ...updates };
    saveLogs(logs);
    return true;
  }
  return false;
}

function deleteLog(id) {
  const logs = getLogs();
  const filtered = logs.filter(l => l.id !== id);
  if (filtered.length !== logs.length) {
    saveLogs(filtered);
    return true;
  }
  return false;
}

// ── 生成每日汇总 ──

function getDaySummary(dateStr) {
  const logs = getLogsByDate(dateStr);
  const meals = { breakfast: { subtotal: 0, count: 0 }, lunch: { subtotal: 0, count: 0 }, dinner: { subtotal: 0, count: 0 }, snack: { subtotal: 0, count: 0 } };
  let totalCalories = 0;

  for (const log of logs) {
    if (meals[log.meal]) {
      meals[log.meal].subtotal += log.calories;
      meals[log.meal].count += 1;
    }
    totalCalories += log.calories;
  }

  return {
    date: dateStr,
    totalCalories,
    itemCount: logs.length,
    meals,
    goal: getSettings().goal,
    percentage: Math.round(totalCalories / getSettings().goal * 100),
    goalMet: totalCalories <= getSettings().goal,
  };
}

// ── 获取所有有记录的日期 ──

function getRecordedDates() {
  const logs = getLogs();
  const dateMap = {};
  for (const log of logs) {
    if (!dateMap[log.date]) {
      dateMap[log.date] = { totalCalories: 0, goal: getSettings().goal };
    }
    dateMap[log.date].totalCalories += log.calories;
  }
  return dateMap;
}

// ── 设置管理 ──

function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    showToast('保存设置失败');
  }
}

function updateSettings(updates) {
  const settings = getSettings();
  const merged = { ...settings, ...updates };
  saveSettings(merged);
  return merged;
}

// ── 同步元数据 ──

function getSyncMeta() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_META);
    return raw ? JSON.parse(raw) : { lastSync: null, lastBackupSHA: null };
  } catch (e) {
    return { lastSync: null, lastBackupSHA: null };
  }
}

function saveSyncMeta(meta) {
  localStorage.setItem(STORAGE_KEY_SYNC_META, JSON.stringify(meta));
}

// ── 数据导出/导入 ──

function exportData() {
  return {
    logs: getLogs(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
}

function importData(data) {
  if (data.logs && Array.isArray(data.logs)) {
    const existing = getLogs();
    const existingIds = new Set(existing.map(l => l.id));
    const newLogs = data.logs.filter(l => !existingIds.has(l.id));
    saveLogs([...existing, ...newLogs]);
  }
  if (data.settings) {
    saveSettings({ ...getSettings(), ...data.settings });
  }
}

// ── 清除所有数据 ──

function clearAllData() {
  localStorage.removeItem(STORAGE_KEY_LOGS);
  localStorage.removeItem(STORAGE_KEY_SETTINGS);
  localStorage.removeItem(STORAGE_KEY_SYNC_META);
}

// ── 生成 UUID ──

function generateId() {
  return 'xsg_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

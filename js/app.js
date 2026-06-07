// ============================================
// 🌸 小食光 — 主应用逻辑
// ============================================

// ── 全局状态 ──
let currentPage = 'today';
let currentTab = 'today';
let addMealTarget = 'lunch';       // 当前要添加到的餐次
let addPhotoData = null;           // 拍照/选图的 base64
let addSelectedFood = null;        // 搜索选中的食物
let addSelectedPortion = null;     // 选中的份量
let editTargetId = null;           // 正在编辑的记录 ID
let deleteTargetId = null;         // 待删除的记录 ID
let calendarYear, calendarMonth;   // 日历当前年月

// ── 初始化 ──

function initApp() {
  // 设置今天日期
  document.getElementById('headerDate').textContent = formatDateFull(new Date());

  // 从设置加载目标值
  const settings = getSettings();
  document.getElementById('goalValue').textContent = settings.goal;

  // 日历默认当月
  const now = new Date();
  calendarYear = now.getFullYear();
  calendarMonth = now.getMonth() + 1;

  // 渲染今日页
  renderTodayPage();

  // 绑定事件
  bindEvents();

  // 注册 Service Worker
  registerSW();

  // 预加载设置页表单
  loadSettingsForm();
}

// ── 日期工具 ──

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateFull(d) {
  const weekDays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${weekDays[d.getDay()]}`;
}

function getToday() {
  return formatDate(new Date());
}

function getNowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ── Toast ──

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

// ── 页面导航 ──

function switchTab(tab) {
  currentTab = tab;

  // 更新底部导航
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${tab}"]`).classList.add('active');

  // 切换页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${tab}`);
  if (pageEl) pageEl.classList.add('active');

  // 切换时渲染
  if (tab === 'today') renderTodayPage();
  if (tab === 'stats') renderStatsPage();
  if (tab === 'calendar') renderCalendarPage();
  if (tab === 'settings') loadSettingsForm();

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── 渲染今日页 ──

function renderTodayPage() {
  const today = getToday();
  const summary = getDaySummary(today);
  const settings = getSettings();

  // 更新目标值（可能被修改过）
  document.getElementById('goalValue').textContent = settings.goal;

  // 进度条
  const pct = Math.min(summary.percentage, 100);
  const bar = document.getElementById('progressBar');
  bar.style.width = `${Math.min(pct, 100)}%`;
  bar.classList.remove('warning', 'danger');
  if (summary.percentage > 100 && summary.percentage <= 120) bar.classList.add('warning');
  if (summary.percentage > 120) bar.classList.add('danger');

  // 汇总数字
  document.getElementById('consumedKcal').textContent = summary.totalCalories;
  const remaining = Math.max(0, settings.goal - summary.totalCalories);
  document.getElementById('remainingKcal').textContent = remaining;

  // 情绪语句
  document.getElementById('moodMsg').textContent = getMoodMessage(summary.percentage);

  // 四个餐次
  ['breakfast', 'lunch', 'dinner', 'snack'].forEach(meal => {
    const logs = getLogsByDateAndMeal(today, meal);
    const itemsEl = document.getElementById(`items-${meal}`);
    const emptyEl = document.getElementById(`empty-${meal}`);
    const subtotalEl = document.getElementById(`subtotal-${meal}`);

    const subtotal = logs.reduce((s, l) => s + l.calories, 0);
    subtotalEl.textContent = `${subtotal} kcal`;

    if (logs.length === 0) {
      itemsEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
    } else {
      emptyEl.classList.add('hidden');
      itemsEl.innerHTML = logs.map(log => `
        <div class="food-item" data-id="${log.id}" id="item-${log.id}">
          ${log.photo
            ? `<img class="food-item-photo" src="${log.photo}" alt="食物照片">`
            : `<div class="food-item-photo-placeholder">🍽️</div>`
          }
          <div class="food-item-info">
            <div class="food-item-name">${escHtml(log.foodName)} · ${escHtml(log.portion || '')}</div>
            ${log.description ? `<div class="food-item-desc">${escHtml(log.description)}</div>` : ''}
          </div>
          <div class="food-item-calories">${log.calories} kcal</div>
          <div class="food-item-actions">
            <button class="food-item-action edit" data-edit="${log.id}">✎</button>
            <button class="food-item-action delete" data-delete="${log.id}">🗑</button>
          </div>
        </div>
      `).join('');

      // 绑定左滑事件（iOS 上做简单点击编辑/删除）
      itemsEl.querySelectorAll('.food-item').forEach(el => {
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchmove', handleTouchMove, { passive: true });
        el.addEventListener('touchend', handleTouchEnd);
      });
    }
  });

  // 底部汇总
  const daySummaryEl = document.getElementById('daySummary');
  daySummaryEl.innerHTML = `今天吃了 <strong>${summary.itemCount}</strong> 样 · 共 <strong>${summary.totalCalories}</strong> kcal`;
}

// ── 左滑手势（简化版）──

let touchStartX = 0;
let touchCurrentX = 0;
let touchItemEl = null;

function handleTouchStart(e) {
  // 重置所有已滑出的项
  document.querySelectorAll('.food-item.swiped').forEach(el => {
    if (el !== touchItemEl) el.classList.remove('swiped');
  });
  touchItemEl = e.currentTarget;
  touchStartX = e.touches[0].clientX;
  touchCurrentX = touchStartX;
}

function handleTouchMove(e) {
  touchCurrentX = e.touches[0].clientX;
  const diff = touchStartX - touchCurrentX;
  if (diff > 30) {
    touchItemEl.classList.add('swiped');
  } else if (diff < -30) {
    touchItemEl.classList.remove('swiped');
  }
}

function handleTouchEnd(e) {
  const diff = touchStartX - touchCurrentX;
  if (Math.abs(diff) < 10) {
    // 点击行为：不滑出
    touchItemEl.classList.remove('swiped');
  }
}

// ── 事件绑定 ──

function bindEvents() {
  // 底部导航
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page) switchTab(page);
    });
  });

  // 添加食物按钮
  document.querySelectorAll('.btn-add-meal').forEach(btn => {
    btn.addEventListener('click', () => {
      addMealTarget = btn.dataset.meal;
      openAddModal();
    });
  });

  // 编辑/删除（事件委托）
  document.addEventListener('click', (e) => {
    // 编辑按钮
    if (e.target.closest('[data-edit]')) {
      const id = e.target.closest('[data-edit]').dataset.edit;
      openEditModal(id);
      return;
    }
    // 删除按钮
    if (e.target.closest('[data-delete]')) {
      const id = e.target.closest('[data-delete]').dataset.delete;
      deleteTargetId = id;
      openConfirmModal('确认删除', '确定要删除这条记录吗？删除后不可恢复哦～', () => {
        deleteLog(id);
        renderTodayPage();
        showToast('已删除～');
      });
      return;
    }
  });

  // 录入弹窗 — 拍照
  document.getElementById('btnCamera').addEventListener('click', () => {
    document.getElementById('inputCamera').click();
  });
  document.getElementById('inputCamera').addEventListener('change', handlePhotoSelect);

  // 录入弹窗 — 相册
  document.getElementById('btnGallery').addEventListener('click', () => {
    document.getElementById('inputGallery').click();
  });
  document.getElementById('inputGallery').addEventListener('change', handlePhotoSelect);

  // 跳过拍照
  document.getElementById('btnSkipPhoto').addEventListener('click', () => {
    addPhotoData = null;
    goToStep('stepInfo');
  });

  // 移除照片
  document.getElementById('btnRemovePhoto').addEventListener('click', () => {
    addPhotoData = null;
    document.getElementById('photoPreview').src = '';
    document.getElementById('photoPreviewWrap').style.display = 'none';
    document.getElementById('inputCamera').value = '';
    document.getElementById('inputGallery').value = '';
  });

  // 食物搜索
  const inputFood = document.getElementById('inputFood');
  inputFood.addEventListener('input', () => {
    const results = searchFood(inputFood.value);
    renderSearchResults(results, 'searchResults', (food) => {
      addSelectedFood = food;
      inputFood.value = food.name;
      document.getElementById('searchResults').classList.remove('active');
      goToStep('stepPortion');
    });
  });
  inputFood.addEventListener('focus', () => {
    const results = searchFood(inputFood.value);
    if (results.length > 0) renderSearchResults(results, 'searchResults', (food) => {
      addSelectedFood = food;
      inputFood.value = food.name;
      document.getElementById('searchResults').classList.remove('active');
      goToStep('stepPortion');
    });
  });

  // 点击外部关闭搜索建议
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input') && !e.target.closest('.search-results')) {
      document.getElementById('searchResults').classList.remove('active');
      document.getElementById('editSearchResults').classList.remove('active');
    }
  });

  // 下一步按钮
  document.getElementById('btnNext').addEventListener('click', handleNextStep);

  // 确认按钮
  document.getElementById('btnConfirm').addEventListener('click', handleConfirmAdd);

  // 取消按钮（所有弹窗）
  document.querySelectorAll('.modal-cancel').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // 弹窗背景点击关闭
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // 份量选择（在 stepPortion 渲染时绑定）
  document.getElementById('inputGrams').addEventListener('input', updateCaloriePreview);

  // 编辑弹窗
  document.getElementById('btnEditSave').addEventListener('click', handleEditSave);
  const editFood = document.getElementById('editFood');
  editFood.addEventListener('input', () => {
    const results = searchFood(editFood.value);
    renderSearchResults(results, 'editSearchResults', (food) => {
      editFood.value = food.name;
      document.getElementById('editSearchResults').classList.remove('active');
      // 自动填卡路里（按默认份量）
      const defaultPortion = food.portions[0];
      if (defaultPortion) {
        document.getElementById('editCalories').value = calcCalories(food.name, defaultPortion.grams);
      }
    });
  });

  // 设置页
  document.getElementById('btnBackup').addEventListener('click', handleBackup);
  document.getElementById('btnRestore').addEventListener('click', handleRestore);
  document.getElementById('btnExport').addEventListener('click', handleExport);
  document.getElementById('btnClear').addEventListener('click', () => {
    openConfirmModal('⚠️ 清除所有数据', '这个操作不可恢复！确定要清除所有饮食记录和设置吗？', () => {
      clearAllData();
      loadSettingsForm();
      renderTodayPage();
      showToast('所有数据已清除');
    });
  });
  document.getElementById('settingGoal').addEventListener('change', () => {
    const goal = parseInt(document.getElementById('settingGoal').value) || 2000;
    updateSettings({ goal });
    document.getElementById('goalValue').textContent = goal;
    renderTodayPage();
    showToast('目标已更新～');
  });

  // 日历
  document.getElementById('btnPrevMonth').addEventListener('click', () => {
    calendarMonth--;
    if (calendarMonth < 1) { calendarMonth = 12; calendarYear--; }
    renderCalendarPage();
  });
  document.getElementById('btnNextMonth').addEventListener('click', () => {
    calendarMonth++;
    if (calendarMonth > 12) { calendarMonth = 1; calendarYear++; }
    renderCalendarPage();
  });

  // 确认对话框
  document.getElementById('btnConfirmYes').addEventListener('click', () => {
    closeAllModals();
    if (window._confirmCallback) {
      window._confirmCallback();
      window._confirmCallback = null;
    }
  });
}

// ── 录入弹窗流程 ──

function openAddModal() {
  // 重置状态
  addPhotoData = null;
  addSelectedFood = null;
  addSelectedPortion = null;
  document.getElementById('photoPreview').src = '';
  document.getElementById('photoPreviewWrap').style.display = 'none';
  document.getElementById('inputDesc').value = '';
  document.getElementById('inputFood').value = '';
  document.getElementById('inputGrams').value = '';
  document.getElementById('searchResults').classList.remove('active');
  document.getElementById('caloriePreview').textContent = '';

  // 显示餐次名称
  const mealNames = { breakfast: '早餐 🌅', lunch: '午餐 ☀️', dinner: '晚餐 🌙', snack: '加餐 🍪' };
  document.getElementById('addToMealName').textContent = mealNames[addMealTarget] || '';

  // 重置步骤
  goToStep('stepPhoto');

  // 按钮状态
  document.getElementById('btnNext').style.display = '';
  document.getElementById('btnNext').disabled = true;
  document.getElementById('btnConfirm').style.display = 'none';

  // 打开弹窗
  document.getElementById('modalOverlay').classList.add('active');
}

function goToStep(stepId) {
  document.querySelectorAll('#modalAdd .modal-step').forEach(s => s.classList.remove('active'));
  const stepEl = document.getElementById(stepId);
  if (stepEl) stepEl.classList.add('active');

  // 更新按钮状态
  const nextBtn = document.getElementById('btnNext');
  const confirmBtn = document.getElementById('btnConfirm');

  if (stepId === 'stepPhoto') {
    nextBtn.style.display = '';
    nextBtn.disabled = true;
    confirmBtn.style.display = 'none';
  } else if (stepId === 'stepInfo') {
    nextBtn.style.display = '';
    nextBtn.disabled = false;
    nextBtn.textContent = '下一步';
    confirmBtn.style.display = 'none';
  } else if (stepId === 'stepPortion') {
    nextBtn.style.display = 'none';
    confirmBtn.style.display = '';
    confirmBtn.disabled = false;
    renderPortionOptions();
    updateCaloriePreview();
  }
}

function handleNextStep() {
  const currentStep = document.querySelector('#modalAdd .modal-step.active');
  if (!currentStep) return;

  if (currentStep.id === 'stepPhoto') {
    // 照片步骤允许跳过
    goToStep('stepInfo');
  } else if (currentStep.id === 'stepInfo') {
    // 需要选中食物
    const foodName = document.getElementById('inputFood').value.trim();
    if (!foodName) {
      showToast('请先搜索并选择一个食物哦～');
      return;
    }
    const food = findFood(foodName);
    if (food) {
      addSelectedFood = food;
      goToStep('stepPortion');
    } else {
      showToast('未找到该食物，请从下拉列表中选择～');
    }
  }
}

function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  // 压缩图片
  compressImage(file, (dataUrl) => {
    addPhotoData = dataUrl;
    document.getElementById('photoPreview').src = dataUrl;
    document.getElementById('photoPreviewWrap').style.display = 'block';
    document.getElementById('btnNext').disabled = false;
    goToStep('stepInfo');
  });
}

function compressImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const maxW = 300;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── 搜索建议渲染 ──

function renderSearchResults(results, containerId, onSelect) {
  const el = document.getElementById(containerId);
  if (!results.length) {
    el.classList.remove('active');
    return;
  }
  el.innerHTML = results.map(f => `
    <div class="search-result-item" data-food="${escHtml(f.name)}">
      ${f.name} <span style="color:#B8A899;font-size:0.75rem;">${f.cal} kcal/100g</span>
    </div>
  `).join('');
  el.classList.add('active');

  el.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.dataset.food;
      const food = findFood(name);
      if (food && onSelect) onSelect(food);
    });
    item.addEventListener('touchend', (e) => {
      e.preventDefault();
      const name = item.dataset.food;
      const food = findFood(name);
      if (food && onSelect) onSelect(food);
    });
  });
}

// ── 份量选择 ──

function renderPortionOptions() {
  if (!addSelectedFood) return;
  const el = document.getElementById('portionOptions');
  const food = addSelectedFood;

  document.getElementById('selectedFoodName').textContent = food.name;

  el.innerHTML = food.portions.map((p, i) => `
    <button class="portion-option" data-idx="${i}">
      ${p.label}
      <span class="grams">${p.grams}g · ${calcCalories(food.name, p.grams)} kcal</span>
    </button>
  `).join('');

  // 绑定点击
  el.querySelectorAll('.portion-option').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.portion-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      addSelectedPortion = food.portions[parseInt(btn.dataset.idx)];
      document.getElementById('inputGrams').value = addSelectedPortion.grams;
      updateCaloriePreview();
    });
  });

  // 默认选中第一个
  const firstBtn = el.querySelector('.portion-option');
  if (firstBtn) {
    firstBtn.classList.add('selected');
    addSelectedPortion = food.portions[0];
    document.getElementById('inputGrams').value = addSelectedPortion.grams;
  }
}

function updateCaloriePreview() {
  if (!addSelectedFood) return;
  const grams = parseInt(document.getElementById('inputGrams').value) || 0;
  if (grams > 0) {
    addSelectedPortion = null; // 自定义克数
    document.querySelectorAll('.portion-option').forEach(b => b.classList.remove('selected'));
  }
  const effectiveGrams = grams > 0 ? grams : (addSelectedPortion ? addSelectedPortion.grams : 0);
  const calories = calcCalories(addSelectedFood.name, effectiveGrams);
  document.getElementById('caloriePreview').textContent = `${calories} kcal`;
}

// ── 确认添加 ──

function handleConfirmAdd() {
  if (!addSelectedFood) {
    showToast('请先搜索并选择食物～');
    return;
  }

  const gramsInput = document.getElementById('inputGrams').value;
  const grams = parseInt(gramsInput) > 0 ? parseInt(gramsInput) : (addSelectedPortion ? addSelectedPortion.grams : 100);
  const portionLabel = addSelectedPortion ? addSelectedPortion.label : `${grams}g`;
  const calories = calcCalories(addSelectedFood.name, grams);

  if (calories <= 0) {
    showToast('卡路里计算出错，请检查份量～');
    return;
  }

  const log = {
    id: generateId(),
    date: getToday(),
    meal: addMealTarget,
    time: getNowTime(),
    photo: addPhotoData || null,
    description: document.getElementById('inputDesc').value.trim(),
    foodName: addSelectedFood.name,
    portion: portionLabel,
    grams: grams,
    calories: calories,
  };

  addLog(log);
  closeAllModals();
  renderTodayPage();
  showToast('记录成功！✅');
}

// ── 编辑弹窗 ──

function openEditModal(id) {
  const log = getLogById(id);
  if (!log) return;
  editTargetId = id;

  document.getElementById('editDesc').value = log.description || '';
  document.getElementById('editFood').value = log.foodName;
  document.getElementById('editCalories').value = log.calories;

  if (log.photo) {
    document.getElementById('editPhotoPreview').src = log.photo;
    document.getElementById('editPhotoPreviewWrap').style.display = 'block';
  } else {
    document.getElementById('editPhotoPreviewWrap').style.display = 'none';
  }

  document.getElementById('editSearchResults').classList.remove('active');
  document.getElementById('modalEditOverlay').classList.add('active');
}

function handleEditSave() {
  if (!editTargetId) return;

  const foodName = document.getElementById('editFood').value.trim();
  const calories = parseInt(document.getElementById('editCalories').value) || 0;

  if (!foodName) { showToast('请输入食物名称～'); return; }
  if (calories <= 0) { showToast('卡路里要大于0哦～'); return; }

  updateLog(editTargetId, {
    foodName,
    description: document.getElementById('editDesc').value.trim(),
    calories,
    portion: '',
    grams: 0,
  });

  closeAllModals();
  renderTodayPage();
  showToast('已更新～✏️');
}

// ── 确认对话框 ──

function openConfirmModal(title, text, callback) {
  document.getElementById('modalConfirm').querySelector('.modal-title').textContent = title;
  document.getElementById('modalConfirm').querySelector('.confirm-text').textContent = text;
  window._confirmCallback = callback;
  document.getElementById('modalConfirmOverlay').classList.add('active');
}

// ── 关闭所有弹窗 ──

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(o => o.classList.remove('active'));
  editTargetId = null;
  deleteTargetId = null;
}

// ── 日历页 ──

function renderCalendarPage() {
  const el = document.getElementById('calendarGrid');
  const monthEl = document.getElementById('calendarMonth');
  const detailEl = document.getElementById('calendarDetail');

  monthEl.textContent = `${calendarYear}年 ${calendarMonth}月`;

  const recordedDates = getRecordedDates();
  const today = getToday();
  const goal = getSettings().goal;

  // 日历头
  const dayHeaders = ['日','一','二','三','四','五','六'];
  let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

  // 当月第一天是周几
  const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
  // 当月天数
  const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  // 填充前置空白
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day other-month"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${calendarYear}-${String(calendarMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = ds === today;
    const record = recordedDates[ds];
    let cls = 'calendar-day';
    if (isToday) cls += ' today';
    if (record) {
      cls += ' has-data';
      if (record.totalCalories > goal) cls += ' over-goal';
    }

    html += `<div class="${cls}" data-date="${ds}">${d}</div>`;
  }

  el.innerHTML = html;
  detailEl.innerHTML = '';

  // 日期点击事件
  el.querySelectorAll('.calendar-day.has-data, .calendar-day.today').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      el.querySelectorAll('.calendar-day.selected').forEach(d => d.classList.remove('selected'));
      dayEl.classList.add('selected');
      showDayDetail(dayEl.dataset.date);
    });
  });
}

function showDayDetail(dateStr) {
  const detailEl = document.getElementById('calendarDetail');
  const summary = getDaySummary(dateStr);
  const settings = getSettings();

  const mealNames = { breakfast: '🌅 早餐', lunch: '☀️ 午餐', dinner: '🌙 晚餐', snack: '🍪 加餐' };

  let html = `<div style="margin-bottom:12px;font-weight:700;">📅 ${dateStr} · 共 ${summary.totalCalories} kcal`;
  if (summary.percentage > 100) {
    html += ` <span style="color:#FF9A9E;">(超标 ${summary.percentage - 100}%)</span>`;
  } else {
    html += ` <span style="color:#A8E6CF;">(达标 ✓)</span>`;
  }
  html += '</div>';

  ['breakfast', 'lunch', 'dinner', 'snack'].forEach(meal => {
    const logs = getLogsByDateAndMeal(dateStr, meal);
    if (logs.length === 0) return;
    const subtotal = logs.reduce((s, l) => s + l.calories, 0);
    html += `<div style="margin-bottom:8px;font-weight:600;color:#8B7355;">${mealNames[meal]} · ${subtotal} kcal</div>`;
    logs.forEach(l => {
      html += `<div style="padding:6px 0 6px 12px;border-left:3px solid #FFE0E2;margin-bottom:4px;font-size:0.85rem;">
        ${l.foodName} · ${l.portion || ''} · <strong>${l.calories} kcal</strong>
        ${l.description ? `<br><span style="color:#B8A899;font-size:0.78rem;">${escHtml(l.description)}</span>` : ''}
      </div>`;
    });
  });

  detailEl.innerHTML = html;
}

// ── 设置页 ──

function loadSettingsForm() {
  const s = getSettings();
  document.getElementById('settingGoal').value = s.goal;
  document.getElementById('settingGhUser').value = s.ghUser || '';
  document.getElementById('settingGhRepo').value = s.ghRepo || '';
  document.getElementById('settingGhToken').value = s.ghToken || '';
}

// ── GitHub 操作 ──

async function handleBackup() {
  // 先保存设置
  saveSettingsFromForm();
  const btn = document.getElementById('btnBackup');
  btn.disabled = true;
  btn.textContent = '备份中…';
  const statusEl = document.getElementById('syncStatus');
  statusEl.textContent = '';
  statusEl.className = 'sync-status';

  const result = await githubBackup();
  btn.disabled = false;
  btn.textContent = '📤 备份到 GitHub';

  if (result.success) {
    statusEl.textContent = '✅ 备份成功！';
    statusEl.className = 'sync-status success';
  } else {
    statusEl.textContent = '❌ ' + result.error;
    statusEl.className = 'sync-status error';
  }
}

async function handleRestore() {
  saveSettingsFromForm();
  const btn = document.getElementById('btnRestore');
  btn.disabled = true;
  btn.textContent = '恢复中…';
  const statusEl = document.getElementById('syncStatus');
  statusEl.textContent = '';
  statusEl.className = 'sync-status';

  const result = await githubRestore();
  btn.disabled = false;
  btn.textContent = '📥 从 GitHub 恢复';

  if (result.success) {
    statusEl.textContent = '✅ 恢复成功！';
    statusEl.className = 'sync-status success';
    renderTodayPage();
  } else {
    statusEl.textContent = '❌ ' + result.error;
    statusEl.className = 'sync-status error';
  }
}

function saveSettingsFromForm() {
  const goal = parseInt(document.getElementById('settingGoal').value) || 2000;
  const ghUser = document.getElementById('settingGhUser').value.trim();
  const ghRepo = document.getElementById('settingGhRepo').value.trim();
  const ghToken = document.getElementById('settingGhToken').value.trim();
  updateSettings({ goal, ghUser, ghRepo, ghToken });
  document.getElementById('goalValue').textContent = goal;
}

function handleExport() {
  const data = exportData();
  // 导出不含照片的版本
  const lightData = {
    logs: data.logs.map(l => { const { photo, ...rest } = l; return { ...rest, hasPhoto: !!photo }; }),
    settings: data.settings,
    exportedAt: data.exportedAt,
  };
  const json = JSON.stringify(lightData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `小食光_备份_${getToday()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('数据已导出～📥');
}

// ── HTML 转义 ──

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Service Worker ──

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW registered'))
      .catch(() => console.log('SW registration failed'));
  }
}

// ── 启动 ──

document.addEventListener('DOMContentLoaded', initApp);

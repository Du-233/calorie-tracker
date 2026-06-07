// ============================================
// 🌸 小食光 — GitHub 数据同步
// ============================================

async function githubBackup() {
  const settings = getSettings();
  if (!settings.ghUser || !settings.ghRepo || !settings.ghToken) {
    showToast('请先在设置里配置 GitHub 信息～');
    return { success: false, error: '未配置' };
  }

  const data = exportData();
  // 照片 base64 数据很大，同步时去掉
  const lightData = {
    logs: data.logs.map(l => {
      const { photo, ...rest } = l;
      return { ...rest, hasPhoto: !!photo };
    }),
    settings: data.settings,
    exportedAt: data.exportedAt,
  };

  const now = new Date();
  const fileName = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.json`;
  const content = JSON.stringify(lightData, null, 2);
  const contentBase64 = btoa(unescape(encodeURIComponent(content)));

  const apiUrl = `https://api.github.com/repos/${settings.ghUser}/${settings.ghRepo}/contents/data/${fileName}`;

  try {
    // 先检查文件是否已存在
    let sha = null;
    try {
      const getResp = await fetch(apiUrl, {
        headers: { 'Authorization': `token ${settings.ghToken}`, 'Accept': 'application/vnd.github.v3+json' }
      });
      if (getResp.ok) {
        const getData = await getResp.json();
        sha = getData.sha;
      }
    } catch (e) {}

    const body = {
      message: `📝 更新饮食数据 ${fileName}`,
      content: contentBase64,
    };
    if (sha) body.sha = sha;

    const resp = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${settings.ghToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (resp.ok) {
      const result = await resp.json();
      saveSyncMeta({ lastSync: now.toISOString(), lastBackupSHA: result.content?.sha });
      return { success: true };
    } else if (resp.status === 401) {
      return { success: false, error: 'Token 无效或已过期' };
    } else if (resp.status === 404) {
      return { success: false, error: '仓库不存在，请先创建' };
    } else {
      const errData = await resp.json().catch(() => ({}));
      return { success: false, error: errData.message || `请求失败 (${resp.status})` };
    }
  } catch (e) {
    return { success: false, error: '网络连接失败，请检查网络' };
  }
}

async function githubRestore() {
  const settings = getSettings();
  if (!settings.ghUser || !settings.ghRepo || !settings.ghToken) {
    showToast('请先在设置里配置 GitHub 信息～');
    return { success: false, error: '未配置' };
  }

  const now = new Date();
  const fileName = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.json`;
  const apiUrl = `https://api.github.com/repos/${settings.ghUser}/${settings.ghRepo}/contents/data/${fileName}`;

  try {
    const resp = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${settings.ghToken}`, 'Accept': 'application/vnd.github.v3+json' }
    });

    if (resp.ok) {
      const data = await resp.json();
      const content = JSON.parse(decodeURIComponent(escape(atob(data.content))));
      importData(content);
      saveSyncMeta({ lastSync: now.toISOString(), lastBackupSHA: data.sha });
      return { success: true };
    } else if (resp.status === 404) {
      return { success: false, error: '云端还没有备份数据' };
    } else {
      return { success: false, error: '获取数据失败，请检查配置' };
    }
  } catch (e) {
    return { success: false, error: '网络连接失败' };
  }
}

// 列出仓库（验证 token）
async function githubVerifyToken() {
  const settings = getSettings();
  if (!settings.ghToken) return { success: false, error: '请先填写 Token' };

  try {
    const resp = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${settings.ghToken}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (resp.ok) {
      const user = await resp.json();
      return { success: true, user: user.login };
    }
    return { success: false, error: 'Token 无效' };
  } catch (e) {
    return { success: false, error: '网络连接失败' };
  }
}

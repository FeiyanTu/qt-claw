const { ipcRenderer } = require('electron')

// 在 WeKnora SPA 加载之前，把 token 和 user 写入 localStorage
// WeKnora 的 auth store 会检查 localStorage 中的 weknora_token 和 weknora_user 来自动登录
;(async () => {
  try {
    const result = await ipcRenderer.invoke('kb:getToken')
    if (result && result.token) {
      localStorage.setItem('weknora_token', result.token)
      if (result.refresh_token) {
        localStorage.setItem('weknora_refresh_token', result.refresh_token)
      }
      // WeKnora 的 isLoggedIn 要求 token 和 user 都存在
      if (result.user) {
        localStorage.setItem('weknora_user', JSON.stringify(result.user))
      }
      localStorage.setItem('weknora_lite_mode', 'true')
    }
  } catch (e) {
    // ignore
  }
})()

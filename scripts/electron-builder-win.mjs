#!/usr/bin/env node
/**
 * 使用带时间戳的输出目录运行 electron-builder --win
 * 输出到 release-yyyyMMddhhmm，每次构建独立目录，避免占用冲突
 */
import { spawnSync, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

const now = new Date()
const ts = now.getFullYear().toString() +
  (now.getMonth() + 1).toString().padStart(2, '0') +
  now.getDate().toString().padStart(2, '0') +
  now.getHours().toString().padStart(2, '0') +
  now.getMinutes().toString().padStart(2, '0')
const outputDir = `release-${ts}`

const buildConfig = { ...pkg.build, directories: { ...pkg.build.directories, output: outputDir } }
const configPath = path.join(root, '.electron-builder-tmp.json')
fs.writeFileSync(configPath, JSON.stringify(buildConfig), 'utf-8')

try {
  // 禁用代码签名（公司环境无签名证书，且避免 winCodeSign 缓存创建符号链接）
  // 使用 npmmirror 镜像加速 GitHub 二进制文件下载
  const env = {
    ...process.env,
    CSC_IDENTITY_AUTO_DISCOVERY: 'false',
    CSC_LINK: '',
    CSC_KEY_PASSWORD: '',
    WIN_CSC_LINK: '',
    WIN_CSC_KEY_PASSWORD: '',
    ELECTRON_BUILDER_BINARIES_MIRROR: 'https://npmmirror.com/mirrors/electron-builder-binaries/',
  }

  // ====== 第 1 步：正常构建（生成 win-unpacked + NSIS 安装包）=======
  console.log('[electron-builder-win] 第 1 步：构建应用...')
  const r = spawnSync('electron-builder', ['--win', '--config', configPath], {
    stdio: 'inherit',
    cwd: root,
    shell: process.platform === 'win32',
    env,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
  console.log('[electron-builder-win] 输出目录:', outputDir)

  // ====== 第 2 步：给 win-unpacked 中 QT-Claw.exe 注入图标 =======
  // 注意：必须用 path.resolve() 生成 Windows 反斜杠路径，rcedit 不认 Unix 正斜杠路径
  const exePath = path.resolve(root, outputDir, 'win-unpacked', 'QT-Claw.exe')
  const iconPath = path.resolve(root, 'build', 'icon.ico')
  const rceditBin = path.resolve(root, 'build', 'rcedit-x64.exe')
  if (fs.existsSync(rceditBin) && fs.existsSync(exePath) && fs.existsSync(iconPath)) {
    try {
      execFileSync(rceditBin, [exePath, '--set-icon', iconPath], { stdio: 'inherit' })
      console.log('[electron-builder-win] win-unpacked exe 图标注入成功')
    } catch (e) {
      console.warn('[electron-builder-win] win-unpacked exe 图标注入失败:', e.message)
    }
  }

  // ====== 第 3 步：从已注入图标的 win-unpacked 重新打包 NSIS 安装包 =======
  // electron-builder 的 --prepackaged 标志支持从已有目录构建安装包
  const unpackedDir = path.resolve(root, outputDir, 'win-unpacked')
  console.log('[electron-builder-win] 第 3 步：重新打包安装包（从已注入图标的 win-unpacked）...')
  const r2 = spawnSync('electron-builder', [
    '--win', 'nsis:x64',
    '--prepackaged', unpackedDir,
    '--config', configPath,
  ], {
    stdio: 'inherit',
    cwd: root,
    shell: process.platform === 'win32',
    env,
  })
  if (r2.status !== 0) {
    console.warn('[electron-builder-win] 安装包重新打包失败:', r2.status)
    // 不退出，至少 win-unpacked 是可用的
  } else {
    console.log('[electron-builder-win] 安装包重新打包成功')
  }
} finally {
  try { fs.unlinkSync(configPath) } catch { /* 忽略 */ }
}

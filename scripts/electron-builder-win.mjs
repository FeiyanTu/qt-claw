#!/usr/bin/env node
/**
 * 使用带时间戳的输出目录运行 electron-builder --win
 * 输出到 release-yyyyMMddhhmm，每次构建独立目录，避免占用冲突
 */
import { spawnSync } from 'node:child_process'
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
  const r = spawnSync('electron-builder', ['--win', '--config', configPath], {
    stdio: 'inherit',
    cwd: root,
    shell: process.platform === 'win32',
    env,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
  console.log('[electron-builder-win] 输出目录:', outputDir)
} finally {
  try { fs.unlinkSync(configPath) } catch { /* 忽略 */ }
}

#!/usr/bin/env node
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { createLumaAdminProject } from './scaffold.js'

/***********************参数解析*********************/
function resolveTargetDir(argv: string[]): string {
  return resolve(process.cwd(), argv[2] ?? 'luma-admin')
}

/***********************命令执行*********************/
async function main(): Promise<void> {
  const targetDir = resolveTargetDir(process.argv)
  const result = await createLumaAdminProject({
    name: basename(targetDir),
    targetDir,
  })

  console.log(`已创建 Luma Admin 项目：${result.targetDir}`)
  console.log('下一步：')
  console.log(`  cd ${result.targetDir}`)
  console.log('  pnpm install')
  console.log('  pnpm dev')
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`创建失败：${message}`)
  process.exit(1)
})

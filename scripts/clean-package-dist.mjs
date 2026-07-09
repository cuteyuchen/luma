import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

/***********************发布产物清理*********************/
const distDir = process.argv[2]

if (!distDir) {
  throw new Error('缺少 dist 目录参数')
}

rmSync(resolve(process.cwd(), distDir, 'tsconfig.tsbuildinfo'), {
  force: true,
})

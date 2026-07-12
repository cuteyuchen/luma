import type { ChildProcess } from 'node:child_process'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url))
const serverEntry = fileURLToPath(new URL('../../luma-mock-api/.output/server/index.mjs', import.meta.url))
const statusUrl = 'http://127.0.0.1:5321/api/status'

async function isReady(): Promise<boolean> {
  try {
    return (await fetch(statusUrl)).ok
  }
  catch {
    return false
  }
}

export default async function setup() {
  if (await isReady())
    return

  let server: ChildProcess | undefined = spawn(process.execPath, [serverEntry], {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      MOCK_LOGIN_RATE_LIMIT: '10000',
      MOCK_RATE_LIMIT: '10000',
      PORT: '5321',
    },
    stdio: 'ignore',
  })

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (await isReady())
      break
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (!await isReady()) {
    server.kill()
    throw new Error('Luma Mock API 测试服务启动失败')
  }

  return () => {
    server?.kill()
    server = undefined
  }
}

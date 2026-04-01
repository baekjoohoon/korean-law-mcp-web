import { beforeAll, afterAll } from 'vitest'
import { spawn, ChildProcess } from 'child_process'

let devProcess: ChildProcess

beforeAll(async () => {
  // Start wrangler pages dev server
  const isWindows = process.platform === 'win32'
  const command = isWindows ? 'npx.cmd' : 'npx'

  devProcess = spawn(command, ['wrangler', 'pages', 'dev', 'dist', '--port=8788'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    shell: isWindows,
  })

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000))
}, 15000)

afterAll(() => {
  if (devProcess) {
    devProcess.kill()
  }
})

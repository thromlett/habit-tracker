import { NextResponse, type NextRequest } from 'next/server'
import { exec } from 'child_process'

/** Run a shell command and always resolve with stdout+stderr */
function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve) => {
    exec(
      cmd,
      { cwd: process.cwd() },
      (err, stdout, stderr) => {
        // even if Jest exits non-zero, we still resolve so we can show the output
        resolve(stdout + stderr)
      }
    )
  })
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const file = url.searchParams.get('file')  // e.g. "testPass.test.js"
  // disable colors so you don’t get ANSI escape codes in your browser
  const baseCmd = 'npx jest --no-color'
  const cmd     = file ? `${baseCmd} ${file}` : baseCmd

  const output = await runCommand(cmd)
  return NextResponse.json({ success: true, output })
}

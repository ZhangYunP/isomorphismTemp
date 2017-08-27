import { spawn } from 'child_process'

function executeChildProcess(exeobj) {
  return new Promise((resolve, reject) => {
    let childProcessData = ''
    const childProcess = spawn(exeobj.cmd, exeobj.args, exeobj.opts)
    childProcess.on('exit', (code) => {
      if (code !== 0) {
        resolve(new Error('error happened in executing childProcess'))
      }
      resolve(childProcessData)
    })
    childProcess.stdout.on('data', (chunk) => {
      childProcessData += chunk.toString()
    })
    childProcess.stdout.on('end', () => {
      childProcess.kill()
    })
    childProcess.stdin.end()
  })
}

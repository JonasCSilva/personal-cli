import { spawn } from 'node:child_process'

const child = spawn('7z', [
  'u',
  'OneDrive',
  'C:\\Users\\OUTSI\\OneDrive\\*',
  '-tzip',
  '-bsp1',
  '-uq0',
  '-x!desktop.ini',
  '-x!Cofre Pessoal.lnk',
  '-x!.849C9593-D756-4E56-8D6E-42412F2A707B',
])

child.stdout.setEncoding('utf8')
child.stdout.on('data', function (data) {
  console.log('stdout: ' + data)
})

child.stderr.setEncoding('utf8')
child.stderr.on('data', function (data) {
  console.log('stderr: ' + data)
})

child.on('close', function (code) {
  console.log('closing code: ' + code)
})

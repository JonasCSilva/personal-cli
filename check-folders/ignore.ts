import { join } from 'https://deno.land/std@0.182.0/path/mod.ts'

export const ignorePaths: string[] = [
  '.config',
  '.deno',
  '.vscode',
  'AppData',
  'scoop',
  'repositories',
  'NTUSER.DAT',
  'ntuser.dat.LOG1',
  'ntuser.dat.LOG2',
  'ntuser.ini',
  'NTUSER.DAT{53b39e88-18c4-11ea-a811-000d3aa4692b}.TM.blf',
  'NTUSER.DAT{53b39e88-18c4-11ea-a811-000d3aa4692b}.TMContainer00000000000000000001.regtrans-ms',
  'NTUSER.DAT{53b39e88-18c4-11ea-a811-000d3aa4692b}.TMContainer00000000000000000002.regtrans-ms',
  '.emulator_console_auth_token',
  '.nuget',
  '.android',
  '.expo',
  '.gradle',
  '.gitconfig',
  'OneDrive',
  join('Desktop', 'OneDrive.zip'),
  join('Documents', 'BioWare'),
  join('Documents', 'flutter'),
  join('Documents', 'PowerShell'),
  join('Documents', 'Rockstar Games'),
  join('Documents', 'Visual Studio 2022'),
]

export const ignoreFiles: string[] = ['desktop.ini']

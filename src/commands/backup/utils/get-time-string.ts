import { format } from 'https://deno.land/std@0.181.0/datetime/mod.ts'

export const timeString = format(new Date(), 'yyyy.MM.dd-HH.mm.ss')

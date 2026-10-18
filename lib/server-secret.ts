import { readFileSync } from 'node:fs'

/** Read a server secret from a mounted file, or from a runtime environment variable. */
export function serverSecret(name: string): string | undefined {
  const file = process.env[`${name}_FILE`]
  if (file) return readFileSync(file, 'utf8').trim()
  return process.env[name]
}

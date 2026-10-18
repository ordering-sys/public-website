export function tableQs(table?: string | null, token?: string | null): string {
  if (!table || !token) return ''
  return `?table=${encodeURIComponent(table)}&token=${encodeURIComponent(token)}`
}

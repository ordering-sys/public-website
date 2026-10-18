import { createClient } from '@supabase/supabase-js'
import { serverSecret } from '@/lib/server-secret'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serverSecret('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

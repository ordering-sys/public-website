'use server'

import { checkTableAccess } from '@/lib/table-access'
import type { LocationFix } from '@/lib/location'

export async function verifyTableLocation(number: string, token: string, location: LocationFix) {
  try {
    await checkTableAccess(number, token, location)
    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unable to verify location.' }
  }
}

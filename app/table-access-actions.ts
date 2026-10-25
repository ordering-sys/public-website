'use server'

import { checkTableAccess } from '@/lib/table-access'
import type { LocationFix } from '@/lib/location'
import { serverSecret } from '@/lib/server-secret'

export async function verifyTableLocation(number: string, token: string, location: LocationFix) {
  try {
    await checkTableAccess(number, token, location)
    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unable to verify location.' }
  }
}

export async function getGuestWifi(number: string, token: string, location: LocationFix) {
  try {
    await checkTableAccess(number, token, location)
    const ssid = serverSecret('GUEST_WIFI_SSID')?.trim()
    const password = serverSecret('GUEST_WIFI_PASSWORD')?.trim()
    if (!ssid || !password) return { success: false, ssid: '', password: '' }
    return { success: true, ssid, password }
  } catch {
    return { success: false, ssid: '', password: '' }
  }
}

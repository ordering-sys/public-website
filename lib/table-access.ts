import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { distanceMeters, validCoordinates, type LocationFix } from './location'

export async function checkTableAccess(number: string, token: string, location?: LocationFix) {
  if (!number || !token) throw new Error('Scan a valid table QR code. / សូមស្កេន QR កូដតុ។')
  const { data: table, error } = await createAdminClient().from('tables')
    .select('id, number, active, latitude, longitude, radius_meters')
    .eq('number', number).eq('token', token).eq('active', true).maybeSingle()
  if (error || !table) throw new Error('This QR code is unavailable. Please ask a staff member. / សូមទាក់ទងបុគ្គលិក។')
  if (table.latitude === null || table.longitude === null || !validCoordinates(table.latitude, table.longitude) ||
      !Number.isFinite(table.radius_meters) || table.radius_meters < 10 || table.radius_meters > 1000) {
    throw new Error('The table location has not been configured. Please ask a staff member. / សូមទាក់ទងបុគ្គលិក។')
  }
  if (!location || !validCoordinates(location.latitude, location.longitude) ||
      !Number.isFinite(location.accuracy) || location.accuracy < 0) {
    throw new Error('Please verify your location. / សូមផ្ទៀងផ្ទាត់ទីតាំងរបស់អ្នក។')
  }
  if (location.accuracy > table.radius_meters) {
    throw new Error('GPS accuracy is too low. Move near a window and try again. / សូមព្យាយាមម្ដងទៀត។')
  }
  if (distanceMeters(table.latitude, table.longitude, location.latitude, location.longitude) > table.radius_meters) {
    throw new Error(`You must be within ${table.radius_meters} meters of the table location to order. / សូមកុម្ម៉ង់នៅក្នុងហាង។`)
  }
  return table
}

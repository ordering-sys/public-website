export type LocationFix = { latitude: number; longitude: number; accuracy: number }

export function validCoordinates(latitude: number, longitude: number) {
  return Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
}

export function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const a = Math.sin(radians(lat2 - lat1) / 2) ** 2 +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(radians(lon2 - lon1) / 2) ** 2
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))
}

export function getLocation(): Promise<LocationFix> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation || !window.isSecureContext) {
      reject(new Error('Location requires HTTPS and a browser with location support.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy }),
      (error) => reject(new Error(error.code === 1
        ? 'Allow location access in your browser settings, then try again.'
        : 'Unable to get your location. Enable GPS, move near a window and try again.')),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    )
  })
}

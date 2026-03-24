// Haversine formula — calculates real distance between 2 GPS points
export const calculateETA = (deliveryLat, deliveryLon, customerLat, customerLon) => {
  const R = 6371 // Earth radius in km
  
  const dLat = ((customerLat - deliveryLat) * Math.PI) / 180
  const dLon = ((customerLon - deliveryLon) * Math.PI) / 180
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((deliveryLat * Math.PI) / 180) *
    Math.cos((customerLat * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = R * c // distance in km
  
  const avgSpeedKmh = 20 // average delivery bike speed in city
  const etaMinutes = Math.round((distanceKm / avgSpeedKmh) * 60)
  
  return {
    distanceKm: distanceKm.toFixed(1),
    etaMinutes: etaMinutes < 1 ? 1 : etaMinutes // minimum 1 min
  }
}
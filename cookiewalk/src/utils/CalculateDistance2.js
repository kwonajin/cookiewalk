export const calculateDistance2 = (coord1, coord2) => {
  const toRad = (x) => (x * Math.PI / 180);
  const R = 6371;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLng = toRad(coord2.longitude - coord1.longitude);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
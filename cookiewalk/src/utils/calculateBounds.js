export function calculateBounds(paths) {
  if (!paths || paths.length === 0) return null;
  let south = paths[0].latitude, north = paths[0].latitude;
  let west = paths[0].longitude, east = paths[0].longitude;

  paths.forEach(path => {
    if (path.latitude < south) south = path.latitude;
    if (path.latitude > north) north = path.latitude;
    if (path.longitude < west) west = path.longitude;
    if (path.longitude > east) east = path.longitude;
  });

  return { south, west, north, east };
}
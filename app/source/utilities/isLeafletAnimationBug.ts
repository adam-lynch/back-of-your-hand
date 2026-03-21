/*
  Leaflet has animation bugs (https://github.com/Leaflet/Leaflet/issues/3249) where
  intermediate zoom frames produce invalid coordinates. These are harmless. The map
  self-corrects on the next resize or render frame.
*/
export default function isLeafletAnimationBug(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.message.includes("Invalid LatLng object: (NaN, NaN)")) return true;
  if (
    error instanceof TypeError &&
    error.stack !== undefined &&
    error.stack.includes("_updateCircle") &&
    error.stack.includes("_updatePath")
  )
    return true;
  return false;
}

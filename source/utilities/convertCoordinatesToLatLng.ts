import type { Coordinates, LatLng } from "./types";

export default ([lat, lng]: Coordinates): LatLng => ({ lat, lng });

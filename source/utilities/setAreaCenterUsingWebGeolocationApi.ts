import { areaCenter } from "../store";
import getLatLngFromWebGeolocationApi from "./getLatLngFromWebGeolocationApi";

export default async () => {
  const newCenter = await getLatLngFromWebGeolocationApi();
  // TODO: what if the area center is the same? Zoom out and in?
  areaCenter.update(() => newCenter);
};

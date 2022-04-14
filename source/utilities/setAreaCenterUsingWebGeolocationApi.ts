import { areaCenter } from "../store";
import getLatLngFromWebGeolocationApi from "./getLatLngFromWebGeolocationApi";

export default async () => {
  const newCenter = await getLatLngFromWebGeolocationApi();
  areaCenter.update(() => newCenter);
};

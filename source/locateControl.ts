import leaflet from "leaflet";
import { geolocationRequesterStatus } from "./store";
import getViewportWidth from "./utilities/getViewportWidth";
import setAreaCenterUsingWebGeolocationApi from "./utilities/setAreaCenterUsingWebGeolocationApi";
import trackEvent from "./utilities/trackEvent";

let control: leaflet.Control | null = null;
let container: HTMLElement;

const onClick = async () => {
  const permission = await navigator.permissions.query({
    name: "geolocation",
  });

  if (permission.state === "granted") {
    trackEvent({
      name: "locate--already-granted",
      title:
        "Locate button clicked (web geolocation persmission state: granted)",
    });
    await setAreaCenterUsingWebGeolocationApi();
    return;
  }

  if (permission.state === "prompt") {
    trackEvent({
      name: "locate--pre-prompt",
      title:
        "Locate button clicked (web geolocation persmission state: prompt)",
    });
    geolocationRequesterStatus.update(() => "pre-prompt");
    return;
  }

  if (permission.state === "denied") {
    trackEvent({
      name: "locate--denied",
      title:
        "Locate button clicked (web geolocation persmission state: denied)",
    });
    geolocationRequesterStatus.update(() => "denied");
    return;
  }
};

export const add = (map: leaflet.Map) => {
  if (control) {
    return;
  }

  if (!("Locate" in leaflet.Control)) {
    // @ts-ignore
    leaflet.Control.Locate = leaflet.Control.extend({
      version: "1.0.1",
      options: { position: "topright" },
      container: null,
      onAdd() {
        container = leaflet.DomUtil.create("div");
        container.className =
          "leaflet-bar leaflet-control leaflet-locate-control";
        container.id = "locate-control";
        container.title = "Move area center to your current location";
        container.innerHTML = `<button>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 297 297" xml:space="preserve"><path d="M148.5,0C66.653,0,0.067,66.616,0.067,148.499C0.067,230.383,66.653,297,148.5,297s148.433-66.617,148.433-148.501 C296.933,66.616,230.347,0,148.5,0z M158.597,276.411v-61.274c0-5.575-4.521-10.097-10.097-10.097s-10.097,4.521-10.097,10.097 v61.274c-62.68-4.908-112.845-55.102-117.747-117.814h61.207c5.575,0,10.097-4.521,10.097-10.097s-4.522-10.097-10.097-10.097 H20.656C25.558,75.69,75.723,25.497,138.403,20.589v61.274c0,5.575,4.521,10.097,10.097,10.097s10.097-4.521,10.097-10.097V20.589 c62.681,4.908,112.846,55.102,117.747,117.814h-61.207c-5.575,0-10.097,4.521-10.097,10.097s4.521,10.097,10.097,10.097h61.207 C271.441,221.31,221.276,271.503,158.597,276.411z"/><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
          <span>${getViewportWidth() > 800 ? "Find me" : ""}</span>
        </button>`;

        leaflet.DomEvent.disableClickPropagation(container);
        leaflet.DomEvent.on(container, "contextmenu", (ev) => {
          leaflet.DomEvent.stopPropagation(ev);
        });
        leaflet.DomEvent.disableScrollPropagation(container);

        leaflet.DomEvent.on(container, "click", onClick, container);

        return container;
      },

      onRemove() {
        leaflet.DomEvent.off(container, "click", onClick, container);
      },
    });
  }

  // @ts-ignore
  control = new leaflet.Control.Locate();
  map.addControl(control);
};

export const remove = (map: leaflet.Map) => {
  if (!control) {
    return;
  }

  map.removeControl(control);
  control = null;
};

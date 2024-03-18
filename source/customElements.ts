export class HTMLSharpImage extends HTMLElement {
  static observedAttributes = ["alt", "src"];

  _img = document.createElement("img");

  constructor() {
    super();

    this._forwardEvents();
  }

  get alt(): HTMLImageElement["alt"] {
    return this.getAttribute("alt");
  }

  set alt(value: HTMLImageElement["alt"]) {
    this.setAttribute("alt", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (["alt", "src"].includes(name)) {
      this._img.setAttribute(name, newValue);
    }
  }

  get complete() {
    return this._img.complete;
  }

  connectedCallback() {
    if (this.src) {
      this._img.src = this.src;
    }
    this.appendChild(this._img);

    // const sharpenDiv = document.createElement("div");
    // sharpenDiv.classList.add("sharpen");
    // this.appendChild(sharpenDiv);
  }

  get src(): HTMLImageElement["src"] {
    return this.getAttribute("src");
  }

  set src(value: HTMLImageElement["src"]) {
    this.setAttribute("src", value);
    this.style.setProperty(
      "--sharp-img-css-background-image",
      this.src ? `url("${this.src}")` : "none"
    );
  }

  _forwardEvents() {
    const eventsToForward = ["load", "error"];
    eventsToForward.forEach((eventType) => {
      this._img.addEventListener(eventType, (event) => {
        event.stopImmediatePropagation();
        // Clone the event to re-dispatch it. Note that this doesn't clone the event's path.
        // @ts-ignore
        const clonedEvent = new event.constructor(event.type, event);
        this.dispatchEvent(clonedEvent);
      });
    });
  }
}

export function defineCustomElements() {
  customElements.define("sharp-img", HTMLSharpImage);
}

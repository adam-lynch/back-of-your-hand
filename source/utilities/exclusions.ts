const exclusions: {
  highways?: string[]; // default: all
  name: string | RegExp; // must be lowercase
}[] = [
  { name: "alley" },
  { name: "drive thru" },
  { name: "escalator" },
  { name: "treppe tiefgarage" }, // Stairs to the underground parking garage
  { name: "tunnel entrance street" },
  { name: "zugang steig" }, // entranceway / access climb
  {
    highways: ["service"],
    name: /^[0-9]+$/,
  },
  {
    highways: ["service"],
    name: /not in use/,
  },
];

export default exclusions;

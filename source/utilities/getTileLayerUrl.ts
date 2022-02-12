export default (name: "streets" | "no-streets") => {
  let result;
  // @ts-ignore
  if (isProduction) {
    if (name === "streets") {
      result = `/tiles/${name}-{s}`;
    } else {
      result = `/tiles/${name}`;
    }
  } else if (name === "streets") {
    result = "https://{s}.tile.openstreetmap.org";
  } else {
    result = "https://maps.wikimedia.org/osm";
  }
  result += "/{z}/{x}/{y}.png";
  return result;
};

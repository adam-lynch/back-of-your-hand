export async function onRequestGet({ request }) {
  const parsedUrl = new URL(request.url);
  const originalPathname = parsedUrl.pathname;

  parsedUrl.host = "api.mapbox.com";
  parsedUrl.pathname = parsedUrl.pathname.replace(`/mapbox`, "");
  parsedUrl.port = 80;
  parsedUrl.protocol = "https:";
  console.log(`Proxying ${originalPathname} to ${parsedUrl}...`);
  return fetch(
    new Request(parsedUrl.toString(), {
      headers: request.headers,
    })
  );
}

export async function onRequestGet({ request }) {
  const parsedUrl = new URL(request.url);
  const originalPathname = parsedUrl.pathname;

  const pathnameSegments = parsedUrl.pathname.split("/").filter(Boolean);

  parsedUrl.host = `${pathnameSegments[1]}.basemaps.cartocdn.com`;
  parsedUrl.pathname = `/${pathnameSegments.slice(2).join("/")}`;
  parsedUrl.port = 80;
  parsedUrl.protocol = "https:";
  console.log(`Proxying ${originalPathname} to ${parsedUrl}...`);
  return fetch(
    new Request(parsedUrl.toString(), {
      headers: request.headers,
    })
  );
}

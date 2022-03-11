export async function onRequestGet({ request }) {
  const parsedUrl = new URL(request.url);
  parsedUrl.pathname = "/geo-lookup-done";
  if (request.cf.latitude && request.cf.longitude) {
    parsedUrl.pathname +=
      "/" + [request.cf.latitude, request.cf.longitude].join(",");
  }
  console.log(`Redirecting / to ${parsedUrl}...`);
  return Response.redirect(parsedUrl.toString(), 302);
}

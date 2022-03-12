export async function onRequestGet({ request }) {
  const parsedUrl = new URL(request.url);
  parsedUrl.pathname = "/geo-lookup-done";
  if (request.cf.latitude && request.cf.longitude) {
    /*
      It incorrectly resolves to Dublin sporadically.
      So I'd rather it just always go to Cork instead of Dublin. Corcaigh Abú!
    */
    if (
      request.cf.city?.toLowerCase() === "dublin" ||
      (request.cf.latitude.toString().startsWith("53.3") &&
        request.cf.longitude.toString().startsWith("-6.2"))
    ) {
      parsedUrl.pathname += "51.89863,-8.47039";
    } else {
      parsedUrl.pathname +=
        "/" + [request.cf.latitude, request.cf.longitude].join(",");
    }
  }
  console.log(`Redirecting / to ${parsedUrl}...`);
  return Response.redirect(parsedUrl.toString(), 302);
}

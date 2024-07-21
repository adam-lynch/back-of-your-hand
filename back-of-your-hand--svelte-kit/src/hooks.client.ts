// export async function handle({ event, resolve }) {
//   const url = new URL(event.url);

//   // Handle specific paths
//   if (url.pathname.startsWith("/game")) {
//     return new Response("OK");
//   }

//   // For other routes, continue resolving
//   return resolve(request);
// }

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // const url = new URL(event.url);

  // Handle specific paths
  if (event.url.pathname.startsWith("game")) {
    return new Response("OK");
  }

  return resolve(event);
}

const CANONICAL_HOST = "ipskzi.com";
const WWW_HOST = `www.${CANONICAL_HOST}`;

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const host = (request.headers.get("host") || url.host).toLowerCase();

  if (host === WWW_HOST) {
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }

  return next();
}

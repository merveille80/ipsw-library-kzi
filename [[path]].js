const IPSW_API_BASE = "https://api.ipsw.me/v4";
const CACHE_SECONDS = 300;

export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "GET") {
    return jsonResponse(
      { error: "Method not allowed. Only GET is supported." },
      405
    );
  }

  const incoming = new URL(request.url);
  const routePath = incoming.pathname.replace(/^\/api\/?/, "");

  if (!routePath) {
    return jsonResponse(
      {
        name: "IPSW Library Kzi API Proxy",
        upstream: IPSW_API_BASE,
        endpoints: ["/api/devices", "/api/device/{identifier}?type=ipsw|ota"],
      },
      200
    );
  }

  if (!isAllowedRoute(routePath)) {
    return jsonResponse({ error: "Unsupported API route." }, 404);
  }

  const upstreamUrl = new URL(`${IPSW_API_BASE}/${routePath}`);
  upstreamUrl.search = incoming.search;

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "ipsw-library-kzi-proxy/1.0",
    },
    cf: {
      cacheEverything: true,
      cacheTtl: CACHE_SECONDS,
    },
  });

  const responseHeaders = new Headers();
  responseHeaders.set(
    "content-type",
    upstreamResponse.headers.get("content-type") ||
      "application/json; charset=utf-8"
  );
  responseHeaders.set(
    "cache-control",
    `public, s-maxage=${CACHE_SECONDS}, max-age=${CACHE_SECONDS}`
  );
  responseHeaders.set("x-proxy-by", "ipsw-library-kzi");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

function isAllowedRoute(path) {
  return path === "devices" || path.startsWith("device/");
}

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

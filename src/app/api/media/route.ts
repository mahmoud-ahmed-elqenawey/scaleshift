const origin = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev";

async function serve(request: Request) {
  const file = new URL(request.url).searchParams.get("file");
  if (!file || !file.startsWith("/") || file.startsWith("//") || !file.endsWith(".mp4")) {
    return new Response("Invalid media path", { status: 400 });
  }
  const url = new URL(file, origin);
  if (url.origin !== origin) return new Response(null, { status: 400 });

  const headers = new Headers();
  for (const name of ["range", "if-range", "if-none-match", "if-modified-since"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      cache: "no-store",
      redirect: "error",
      signal: request.signal,
    });
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    // Preserve byte-range streaming; never buffer complete reels in server memory.
    responseHeaders.set("Cache-Control", upstream.ok || upstream.status === 304
      ? "public, max-age=86400, must-revalidate"
      : "no-store");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return new Response("Media unavailable", { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}

export const GET = serve;
export const HEAD = serve;

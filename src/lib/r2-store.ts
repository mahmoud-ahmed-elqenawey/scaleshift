import { AwsClient } from "aws4fetch";

export type ObjectStore = {
  // Whole-body values only: R2's S3 API rejects chunked (streamed) uploads with 411 MissingContentLength.
  put(key: string, body: ArrayBuffer | string, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
};

// The bucket lives in another Cloudflare account than the Worker, so it is reached over R2's S3 API with an API token
// (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET) instead of a bucket binding.
export function r2Store(env: Record<string, string | undefined>): ObjectStore | undefined {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) return undefined;
  const client = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });
  const url = (key: string) => `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const send = async (init: RequestInit & { method: string }, key: string) => {
    const response = await client.fetch(url(key), init);
    if (!response.ok) throw new Error(`R2 ${init.method} ${key} failed: ${response.status} ${(await response.text()).slice(0, 200)}`);
  };
  return {
    // Content-Length is set by hand: Next's patched fetch re-wraps the request and R2 then sees a chunked body (411).
    put: (key, body, contentType) => {
      const length = typeof body === "string" ? new TextEncoder().encode(body).byteLength : body.byteLength;
      return send({ method: "PUT", body, headers: { "Content-Type": contentType, "Content-Length": String(length) } }, key);
    },
    delete: (key) => send({ method: "DELETE" }, key),
  };
}

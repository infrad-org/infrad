import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const assetManifest = JSON.parse(manifestJSON);

export async function handleStaticAssets(request, env, ctx) {
  return await getAssetFromKV(
    {
      request,
      waitUntil(promise) {
        return ctx.waitUntil(promise);
      },
    },
    {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: assetManifest,
    }
  );
}

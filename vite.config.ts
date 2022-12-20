import vue from "@vitejs/plugin-vue";
import ssr from "vite-plugin-ssr/plugin";
import type { UserConfig } from "vite";
import Unocss from "unocss/vite";
import presetWind from "@unocss/preset-wind";
import telefunc from "telefunc/vite";

export default {
  ssr: {
    noExternal: ["@neondatabase/serverless"],
  },
  publicDir: "src/public",
  plugins: [
    Unocss({
      presets: [presetWind()],
      theme: {
        colors: {
          darkOrange: "#d45500",
        },
      },
      transformers: [],
    }),
    ssr(),
    vue(),
    telefunc(),
  ],
  resolve: {
    // Only needed for this example
    // TODO: check if still needed
    preserveSymlinks: true,
  },
  // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks vite-plugin-ssr's CI
  optimizeDeps: {},
} as UserConfig;

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPLIBRE_STYLE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAWG_API_KEY: string;
  // add any other VITE_ vars you're using
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STEAM_API_KEY: string;
  readonly STEAM_USER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

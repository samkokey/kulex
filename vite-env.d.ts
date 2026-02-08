interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_VIDEO_ID: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

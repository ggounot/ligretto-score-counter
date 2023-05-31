interface ImportMetaEnv {
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_PLAUSIBLE_SCRIPT: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_PROJECT: string;
  readonly PACKAGE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

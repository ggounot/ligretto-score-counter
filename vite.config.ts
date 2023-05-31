import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const env = loadEnv("mock", process.cwd(), "");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      includeManifestIcons: false,
      includeAssets: [
        "icons/favicon-16x16.png",
        "icons/favicon-32x32.png",
        "logo.webp",
      ],
      manifest: {
        name: "Ligretto Score Counter",
        short_name: "Ligretto Score",
        description: "Easily calculate the score of your Ligretto games!",
        categories: ["games", "utilities"],
        icons: [
          {
            src: "icons/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/384-maskable.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
          {
            src: "icons/1024-maskable.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshots/player-input-light.webp",
            sizes: "1080x2400",
            type: "image/webp",
            platform: "narrow",
            label: "Player Input - light mode",
          },
          {
            src: "screenshots/score-input-light.webp",
            sizes: "1080x2400",
            type: "image/webp",
            platform: "narrow",
            label: "Score Input - light mode",
          },
          {
            src: "screenshots/score-table-light.webp",
            sizes: "1080x2400",
            type: "image/webp",
            platform: "narrow",
            label: "Score Table - light mode",
          },
          {
            src: "screenshots/player-input-dark.webp",
            sizes: "1080x2400",
            type: "image/webp",
            platform: "narrow",
            label: "Player Input - dark mode",
          },
          {
            src: "screenshots/score-input-dark.webp",
            sizes: "1080x2400",
            type: "image/webp",
            platform: "narrow",
            label: "Score Input - dark mode",
          },
          {
            src: "screenshots/score-table-dark.webp",
            sizes: "1080x2400",
            type: "image/webp",
            platform: "narrow",
            label: "Score Table - dark mode",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#570df8",
        background_color: "#FFFFFF",
      },
    }),
    sentryVitePlugin({
      org: env.SENTRY_ORG,
      project: env.VITE_SENTRY_PROJECT,
      authToken: env.SENTRY_AUTH_TOKEN,
      release: {
        name: `${env.VITE_SENTRY_PROJECT}@${env.npm_package_version}`,
      },
    }),
  ],
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(env.npm_package_version),
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "nuxt-gtag",
    "@nuxthub/core",
  ],

  fonts: {
    families: [
      {
        name: "Barlow",
        provider: "google",
        weights: [400, 500, 600, 700],
      },
      {
        name: "Chicle",
        provider: "google",
        weights: [400],
      },
    ],
  },

  gtag: {
    // id: 'G-CE1PRNLK0N'
  },
});
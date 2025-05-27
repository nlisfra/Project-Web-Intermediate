module.exports = {
  globDirectory: "public/",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,jpeg,svg,ico,json}"
  ],
  swDest: "public/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\/stories/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, 
        },
      },
    },
    {
      urlPattern: /^https:\/\/([a-z0-9]+)\.tile\.openstreetmap\.org\//,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "map-tiles",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, 
        },
      },
    },
  ],
};
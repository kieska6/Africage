export default [
  {
    ignores: [
      "**/.git",
      "**/.DS_Store",
      "**/node_modules",
      "**/dist",
      "**/dist-ssr",
      "**/.svelte-kit",
      "**/.vercel",
      "**/vite.config.*",
      "**/vite.config.d.ts",
      "**/.env",
      "**/.env.*",
      "**/package-lock.json",
      "**/pnpm-lock.yaml",
      "**/yarn.lock",
      "**/turbo.lock"
    ]
  },
  {
    languageOptions: {
      globals: {
        __vite_browser_extension_manifest: "readonly"
      }
    }
  }
];
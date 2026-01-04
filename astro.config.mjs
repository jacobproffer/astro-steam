import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://whatisjacobplaying.com/",
  output: 'server',
  adapter: netlify(),
  integrations: [sitemap()],
  image: {
    domains: ["cdn.cloudflare.steamstatic.com", "avatars.steamstatic.com", "avatars.akamai.steamstatic.com"],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
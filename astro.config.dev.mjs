import { defineConfig, svgoOptimizer } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

// Dev config with Netlify adapter but minimal emulation
// Use this for local development and testing
export default defineConfig({
    site: "https://whatisjacobplaying.com/",
    output: 'server', // Match production behavior
    adapter: netlify({
        edgeMiddleware: false, // Disable edge middleware emulation
        imageCDN: false, // Disable image CDN emulation
    }),
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/404')
        })
    ],
    image: {
        domains: ["cdn.cloudflare.steamstatic.com", "avatars.steamstatic.com", "avatars.akamai.steamstatic.com"],
    },
    vite: {
        plugins: [tailwindcss()],
    },
    experimental: {
        svgOptimizer: svgoOptimizer({
            multipass: true,
            plugins: [
                'preset-default',
                'removeXMLNS',
            ]
        })
    }
});
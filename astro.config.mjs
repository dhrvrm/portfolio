import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

export default defineConfig({
	integrations: [
		tailwind(),
		mdx(),
		react(),
		sitemap(),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
	],
	markdown: {
		shikiConfig: {
			theme: 'dracula',
			wrap: true,
		},
	},
	site: 'https://dhruvverma.dev',
});

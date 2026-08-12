import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';

export default defineConfig({
	integrations: [
		mdx(),
		react(),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
	],
	// v7 default compressHTML:'jsx' strips whitespace between inline
	// elements (spark/mark spans, kicker separators); keep classic behavior.
	compressHTML: true,
	markdown: {
		shikiConfig: {
			theme: 'dracula',
			wrap: true,
		},
	},
	site: 'https://dhruvverma.dev',
});

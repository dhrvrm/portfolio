// Tailwind 3 via PostCSS — replaces the deprecated @astrojs/tailwind
// integration, which never supported Astro 6+.
export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};

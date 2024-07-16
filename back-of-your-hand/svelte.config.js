import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			assets: 'build/dist',
			fallback: 'app.html',
			pages: 'build/dist',
			precompress: true,
			strict: true
		})
	}
};

export default config;

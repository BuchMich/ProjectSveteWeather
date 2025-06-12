import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	base: process.env.NODE_ENV === 'production' ? '/WeatherProjv3/' : '/',
	build: {
		outDir: 'build',
		assetsDir: '_app',
		emptyOutDir: true,
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	}
});

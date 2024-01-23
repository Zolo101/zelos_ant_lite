import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	build: {
		target: "esnext"
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".glsl": "text",
				".wgsl": "text",
			},
		}
	}
};

export default config;

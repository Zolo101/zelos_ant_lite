import { sveltekit } from '@sveltejs/kit/vite';
import path from "path";

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
	},
	resolve: {
		alias: [
			{
				find: /hashcanvas/,
				replacement: path.resolve(__dirname, "node_modules", "hashcanvas"),
			},
		],
	},
};

export default config;

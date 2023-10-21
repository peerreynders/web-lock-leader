import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
	input: './src/entry.js',
	output: {
		file: './public/main.js',
		format: 'iife',
	},
	plugins: [nodeResolve(), commonjs(), terser()],
};

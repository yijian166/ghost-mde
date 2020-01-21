import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import rollup_start_dev from './rollup_start_dev';
import postcss from 'rollup-plugin-postcss'
// import { scss, coffeescript, pug } from 'svelte-preprocess'
import autoPreprocess, {less} from 'svelte-preprocess';
import dev from 'rollup-plugin-dev'
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import path from 'path';
// import babel from 'rollup-plugin-babel';
import babel from "@babel/core"

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: {
				...autoPreprocess(),
				// script: ({ content }) => {
				// 	return babel.transform(content, {});
				// }
			},
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file  better for performance
			css: css => {
				css.write('public/main.css');
			}
		}),

		// babel({
		// 	exclude: 'node_modules/**',
		// 	runtimeHelpers: true,
		// 	extensions: [ ".js", ".mjs", ".html"]   
    // }),

		postcss({
			// modules: true,
			plugins: [],
			extract: true,
			extensions: ['.css', '.less']
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration 
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// In dev mode, call `npm run start:dev` once
		// the bundle has been generated
		!production && rollup_start_dev,

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// !production && dev({ 
		// 	port: 5000,
		// 	proxy: { '/ghost/*': [
		// 		'https://hicc.me/ghost/', 
		// 		{ https: true }
		// 		] 
		// 	} ,
		// 	dirs: ['dist', 'lib','public'] 
		// }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		replace({ __buildEnvIsProduction__: !!production }),

		alias({
			entries: {
				'@api': path.resolve(__dirname,  './src/services/ghostAdminApi.js'),
				'@store': path.resolve(__dirname,  './src/services/store.js'),
				'@icon': path.resolve(__dirname,  './src/fontawesome-free-5.11.2-web/'),
				'@request': path.resolve(__dirname,  './src/services/request.js'),
				'@config': path.resolve(__dirname,  './src/services/config.js'),
				'@db': path.resolve(__dirname,  './src/services/db.js'),
			}
		}),

		
	],
	watch: {
		clearScreen: false
	}
};

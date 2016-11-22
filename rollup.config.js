import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
	entry: 'js/main.js',
	dest: 'js/holmes.js',
	format: 'umd',
	moduleName: 'holmes',
	plugins: [
		babel(),
		uglify()
	]
};

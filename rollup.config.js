import babel from 'rollup-plugin-babel';

export default {
  entry: 'js/main.js',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'babili'],
      plugins: ['transform-flow-strip-types']
    })
  ],
  targets: [
    {dest: 'js/holmes.js', format: 'umd', moduleName: 'holmes'},
    {dest: 'js/holmes.es.js', format: 'es'}
  ]
};

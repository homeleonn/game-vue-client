module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://fightworld.loc',
        ws: true,
        changeOrigin: true
        }
    }
  },

  // publicPath: '/prod/',

  // configureWebpack: {
  //   entry: __dirname + '/src/app.js',
  //   title: 'FightWorld',
  // },

  pages: {
    index: {
	    entry: __dirname + '/src/app.js',
	    title: 'FightWorld',
    }
  },

  // outputDir: __dirname + '/public/js/'
}

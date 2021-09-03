module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '^/api': {
        // target: 'http://fightworld.loc',
        target: 'http://fw.lobbet.com',
        ws: true,
        changeOrigin: true
        }
    }
  },

  configureWebpack: {
    entry: __dirname + '/src/app.js'
  },
  
  // outputDir: __dirname + '/public/js/'
}
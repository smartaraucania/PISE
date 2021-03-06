const webpack = require('webpack');
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: isProd ? "/vue-argon-dashboard/" : "",
  configureWebpack: {
    // Set up all the aliases we use in our app.
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  devServer: {
    disableHostCheck: true
  },
  pwa: {
    name: 'PISE WEB',
    themeColor: '#172b4d',
    msTileColor: '#172b4d',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#172b4d'
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  }
};

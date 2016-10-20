const webpack = require('webpack')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')

const config = Object.assign({}, base, {
  plugins: base.plugins.concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'client-vendor-bundle.js'
    })
  ])
})

if (process.env.NODE_ENV === 'production') {
  //使用压缩工具
  const ExtractTextPlugin = require('extract-text-webpack-plugin')

  //增加css依赖的loaders
  vueConfig.loaders = {
    stylus: ExtractTextPlugin.extract({
      loader: "css-loader!stylus-loader",
      fallbackLoader: "vue-style-loader" // <- this is a dep of vue-loader
    })
  }

  config.plugins.push(
    new ExtractTextPlugin('styles.css'),
    // 压缩所有的css为style.css
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    //压缩所有的js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = config

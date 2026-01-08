var path = require('path')
var webpack = require('webpack')
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: false,
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: false,
                  modules: {
                    localIdentName: '[local]_[hash:base64:5]'
                  }
                }
              },
              'sass-loader'
            ]
          },
          {
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: false
                }
              },
              'sass-loader'
            ]
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 100000,
              name: "[name].[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  // resolve: {
  //   alias: {
  //     'vue$': 'vue/dist/vue.esm.js'
  //   }
  // },
  performance: {
    hints: false
  },
  devtool: 'cheap-module-inline-source-map'
}

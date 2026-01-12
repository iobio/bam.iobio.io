var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
var inProduction = process.env.NODE_ENV === 'production';
const localBackend = process.env.BUILD_ENV_LOCAL_BACKEND === 'true';
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: {
    app: [
      './client/app/routes.js',
    ]
  },
  output: {
    path: __dirname + '/client/dist/',
    publicPath: 'dist/',
    filename: 'build.js'
  },
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
        test: /\.(css|less)$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
          options: {
            esModule: false
          }
        }]
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
      },
      {
        test: /\.bed$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      BUILD_ENV_LOCAL_BACKEND: localBackend ? 'true' : 'false',
    }),
  ],
  // resolve: {
  //   alias: {
  //     'vue$': 'vue/dist/vue.esm.js'
  //   }
  // },
  performance: {
    hints: false
  },
  devtool: 'inline-cheap-module-source-map'
}

if (inProduction) {
  module.exports.devtool = 'source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}

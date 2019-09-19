const { optimize,DefinePlugin } = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")
 
const smp = new SpeedMeasurePlugin();

const outputDirectory = 'dist'

module.exports = smp.wrap({
  entry: [
      'babel-polyfill',
       './Client/index.js'
    ],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[hash].[ext]",
            outputPath: 'img/',
            publicPath:'img/',
          },
        },
      },
    ]
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    // publicPath: path.join(__dirname, outputDirectory),
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
      // favicon: './public/favicon.ico'
    }),
    new optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new CopyWebpackPlugin([
      {from: './assets/**/*', force: true},
    ]),
  ]
});
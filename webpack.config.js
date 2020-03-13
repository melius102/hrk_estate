const path = require('path');

module.exports = {
  // entry default > 'src/index.js',
  entry: {
    index: './src/public/js/index.js'
  },
  // output default > 'dist/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist/public/js"), // absolute path
    publicPath: '/assets' // relative to server root
  },
  target: 'web',
  mode: 'none',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      }, {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }, {
        test: /\.scss$/i,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}
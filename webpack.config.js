const path = require('path');

module.exports = {
  entry: './src/public/js/index.js',
  output: {
    path: path.resolve(__dirname, "dist/public/js"),
    filename: 'main.js'
  },
  target: 'web',
  mode: 'none',
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
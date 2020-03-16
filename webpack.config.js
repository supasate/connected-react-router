var config = {
  entry: './src/index',
  mode: 'production',
  module: {
    rules: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
  output: {
    library: 'ConnectedReactRouter',
    libraryTarget: 'umd'
  }
}

if (process.env.NODE_ENV === 'production') {
  config.optimization = {
    minimize: true
  }
}

module.exports = config

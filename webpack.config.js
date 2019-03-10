var config = {
  entry: './src/index',
  mode: 'production',
  module: {
    rules: [
      { test: /\.js$/, use: [ 'babel-loader' ], exclude: /node_modules/ }
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

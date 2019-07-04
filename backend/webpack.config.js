const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  entry: ['webpack/hot/poll?100','./src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
        whitelist: ['webpack/hot/poll?100'],
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])],
  output: {
    path: path.join(__dirname, 'dest'),
    filename: 'server.js',
  },
};

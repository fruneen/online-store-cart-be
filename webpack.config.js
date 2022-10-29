/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (options) {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    externals: [nodeExternals()],
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin(),
      ],
    },
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
  };
};

const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallbacks for Node.js core modules
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser")
  });
  config.resolve.fallback = fallback;

  // Add plugins
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]);

  // Add module rules for .js files
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false
      }
    }
  ];

  return config;
}

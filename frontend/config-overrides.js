const BundleTracker = require('webpack-bundle-tracker');

module.exports = function override(config, env) {
  const isProduction = env === 'production';
  
  // 本番環境用のパスを設定
  const publicPath = isProduction ? '/' : 'http://localhost:3000/';
  
  // output設定の更新
  config.output = {
    ...config.output,
    publicPath: publicPath,
    // 本番環境ではファイル名にハッシュを含める
    filename: isProduction ? 'js/[name].[contenthash:8].js' : 'static/js/bundle.js',
    chunkFilename: isProduction ? 'js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js'
  };

  // Add BundleTracker plugin
  config.plugins.push(
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json',
      publicPath: publicPath
    })
  );

  return config;
};
const BundleTracker = require('webpack-bundle-tracker');
const path = require('path');

module.exports = function override(config, env) {
  // 本番環境用のパスを設定
  const publicPath = env === 'production' ? '/' : '/';
  // output設定の更新
  config.output = {
    ...config.output,
    publicPath: publicPath,
    // 本番環境ではファイル名にハッシュを含める
    filename: env === 'production' ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
    chunkFilename: env === 'production' ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js'
  };

  // Add BundleTracker plugin
  config.plugins.push(
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json',
      publicPath: process.env.NODE_ENV === 'production' 
        ? '/'  // 本番環境用のパス（/static/を削除）
        : 'http://localhost:3000/'  // 開発環境用のパス
    })
  );

  return config;
};
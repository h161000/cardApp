module.exports = function override(config, env) {
  // 本番環境用のパスを設定
  const publicPath = env === 'production' ? '/static/' : 'http://localhost:3000/';
  
  // output設定の更新
  config.output = {
    ...config.output,
    publicPath: publicPath
  };

  return config;
}; 
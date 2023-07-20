const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  devServer: {
    proxy: {
      '/v1': {
        target: 'https://api.openai-proxy.com',
        changeOrigin: true,
        pathRewrite: {
          '^/v1': '/v1',
        },
      },
    },
  },
};

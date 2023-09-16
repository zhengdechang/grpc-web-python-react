const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
  target: process.env.GRPC_TARGET_URL,
  changeOrigin: true,
  ws: true, // 如果要代理 websockets，配置这个参数
  secure: false, // 如果是 http 接口，将 secure 设置为 false
});

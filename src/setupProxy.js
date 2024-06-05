const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Specify the path you want to proxy
    createProxyMiddleware({
      target: 'https://pharmacy-1xjk.onrender.com', // Specify the backend server URL
      changeOrigin: true,
    })
  );
};

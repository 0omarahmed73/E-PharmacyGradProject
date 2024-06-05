const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Define an array of proxy configurations
  const proxies = [
    {
      path: '/auth/login',
      target: 'https://backend1.example.com',
      changeOrigin: true,
    },
    {
      path: '/pharmacy',
      target: 'https://backend2.example.com',
      changeOrigin: true,
    },
    // Add more proxy configurations as needed
  ];

  // Iterate over the proxy configurations and set up proxies
  proxies.forEach(({ path, target, changeOrigin }) => {
    app.use(
      path,
      createProxyMiddleware({
        target,
        changeOrigin,
      })
    );
  });
};

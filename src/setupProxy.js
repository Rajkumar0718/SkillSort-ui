const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/api1',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8801',
      changeOrigin: true,
    })
  );
  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8802',
      changeOrigin: true,
    })
  );
  app.use(
    '/api3',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8803',
      changeOrigin: true,
    })
  );
  app.use(
    '/api4',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8804',
      changeOrigin: true,
    })
  );
  app.use(
    '/api5',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8805',
      changeOrigin: true,
    })
  );

  app.use(
    '/api6',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8806',
      changeOrigin: true,
    })
  );

  app.use(
    '/api7',
    createProxyMiddleware({
      target: 'http://192.168.1.36:8807',
      changeOrigin: true,
    })
  );
}

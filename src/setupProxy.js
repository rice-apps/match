const { createProxyMiddleware }= require('http-proxy-middleware')
 
module.exports = function(app) {
    app.use(createProxyMiddleware('/auth/whoami', { target: 'http://localhost:3030/' }))
    app.use(createProxyMiddleware('/auth/login', { target: 'http://localhost:3030/' }))
    app.use(createProxyMiddleware('/auth/logout', { target: 'http://localhost:3030/' }))
    app.use(createProxyMiddleware('/auth/query', { target: 'http://localhost:3030/' }))
    app.use(createProxyMiddleware('/contacts', { target: 'http://localhost:3030/' }))
}
'use strict'
const port = process.env.port || process.env.npm_config_port || 8080 // 端口
module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: port,
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            ['/user']: {
                target: process.env.BASE_URL,
                changeOrigin: true,
                pathRewrite: {
                    ['^' +'/user']: ''
                }
            }
        },
        disableHostCheck: true
    }
}
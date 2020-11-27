'use strict'
const port = process.env.port || process.env.npm_config_port || 8080 // 端口

module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: port,
        proxy: {
            ['/user']: {
                // target: process.env.BASE_URL,
                target: process.env.VUE_APP_BASE_URL,
                changeOrigin: true,
                pathRewrite: {
                    ['^' +'/user']: ''
                }
            }
        },
        disableHostCheck: true
    }
}
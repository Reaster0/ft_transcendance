const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
	},
	devServer: {
		proxy: {
			'/api' : {
				target: 'http://localhost:3000',
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			},
  		},
		headers: {
		"Access-Control-Allow-Origin": "http://localhost:3000",
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
		"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		},
	}
})

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  
  pluginOptions: {
	  vuetify: {
		  // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
	},
	devServer: {
		allowedHosts: 'all',
		// proxy: {
		// 	'/api' : {
		// 		target: 'http://:3000',
		// 		// target: 'http://localhost:3000',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			"^/api": ""
		// 		}
		// 	},
		// },
	}
})

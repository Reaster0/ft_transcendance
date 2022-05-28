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
				//target: 'http://82.65.87.54:3000',
				target: 'http://localhost:3000',
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			},
  		}
	}
})

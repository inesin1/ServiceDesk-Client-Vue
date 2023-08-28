const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: ['wave-ui'],
  css: {
    loaderOptions: {
      // `additionalData` was called `prependData` prior sass-loader 9.
      sass: { additionalData: '@import "@/scss/_variables.scss";' }
    }
  }
}

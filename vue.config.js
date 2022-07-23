const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // chainWebpack: (config) => {
  //   const svgRule = config.module.rule('svg')
  //   svgRule.uses.clear()
  //
  //   svgRule
  //     .use('vue-loader')
  //     .loader('vue-loader')
  //     .end()
  //     .use('vue-svg-loader')
  //     .loader('vue-svg-loader')
  // },
  transpileDependencies: true,
  pluginOptions: {
    svgSprite: {
      dir: 'src/assets/icons',
      test: /\.(svg)(\?.*)?$/,
      loaderOptions: {
        extract: true,
        spriteFilename: 'img/icons.[hash:8].svg',
      },
      pluginOptions: {
        plainSprite: true,
      },
    },
  },

  chainWebpack: (config) => {
    config.module.rule('svg-sprite').use('svgo-loader').loader('svgo-loader')
  },
})

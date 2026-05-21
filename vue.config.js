const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('copy').tap(args => {
      const options = args[0]
      if (options && options.patterns && options.patterns.length) {
        options.patterns.forEach(pattern => {
          if (pattern.globOptions && pattern.globOptions.ignore) {
            pattern.globOptions.ignore = [
              '**/index.html',
              '**/.DS_Store'
            ]
          }
        })
      }
      return args
    })
  }
})

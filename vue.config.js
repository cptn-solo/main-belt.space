const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  pwa: {
    name: "zero.alpha.belt",
    themeColor: "#9013FE"
  },
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(gitRevisionPlugin.version()),
          COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
          BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
        },
      }),
    ],
  },
};

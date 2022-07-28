const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      fallback: { path: require.resolve("path-browserify") },
    },
    externals: {
      electron: 'require("electron")',
    },
  },
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      builderOptions: {
        nsis: {
          installerIcon: "./public/logo.ico",
          shortcutName: "Chat",
          allowToChangeInstallationDirectory: true,
          oneClick: false,
          installerHeaderIcon: "./public/logo.ico", //安装logo
        },
        electronDownload: {
          mirror: "https://npm.taobao.org/mirrors/electron/", //镜像设置
        },
        win: {
          icon: "./public/logo.ico", //打包windows版本的logo
          target: [
            {
              target: "nsis", //使用nsis打成安装包，"portable"打包成免安装版
              arch: [
                "ia32", //32位
                "x64", //64位
              ],
            },
          ],
        },
        productName: "Chat", //应用的名称
        extraFiles: [
          {
            from: "./download.exe",
            to: "./download.exe",
          },
          {
            from: "./upload.exe",
            to: "./upload.exe",
          },
          {
            from: "./config.conf",
            to: "./config.conf",
          },
        ],
      },
    },
  },
});

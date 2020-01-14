const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
  configureWebpack: config => {
    config.devtool = "cheap-source-map";
    config.externals = {
      // cdn 版本的element-ui、vue、vue-router设置的全局变量分别是ELEMENT、Vue、VueRouter、axios、VueI18n
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT",
      // i18n: 'VueI18n',
      echarts: "echarts"
    };
  },

  chainWebpack: config => {
    //修改文件引入自定义路径
    config.resolve.alias
      .set("@", resolve("src"))
      .set("style", resolve("src/assets/style"))
      .set("dataF", resolve("src/data"))
      .set("apiF", resolve("src/data/api"))
      .set("apiF", resolve("src/data/api"))
      .set("pagesF", resolve("src/pages"))
      .set("routerF", resolve("src/router"));
  }
};

import Vue from "vue";
import App from "./App.vue";
import Element from "element-ui";
//样式
import "@/assets/styles/index.styl";
// 注册Element UI
Vue.use(Element, {
  size: "small"
});
// 路由
import router from "./router";
// 权限
import "./common/permission";
// Mock Server
import "./data/mock/index";


// vuex
import store from "./data/store";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");

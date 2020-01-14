import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
// 权限数据
import permission from "./permission";
//页面仓库
import pages from "./pages/index";

/* End */

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    permission,
    ...pages
  },
  getters
});

export default store;

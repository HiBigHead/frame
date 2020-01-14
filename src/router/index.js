// 加载vue模块
import Vue from "vue";
// 加载vue-router
import Router from "vue-router";
// 导入全局vue路由
const _import = file => () => import("@/pages/" + file + ".vue");
// 使用Router
Vue.use(Router);

export default new Router({
  routes: asyncRouterMap,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

export const asyncRouterMap = [
  // { path: '/', component: _import('Index/index') }
  {
    path: "",
    component: _import("Layout/index"),
    redirect: "index",
    children: [
      {
        path: "/index",
        component: _import("Index/index")
      },
      { path: "/system", component: _import("System/index") }
    ]
  },
  {
    path: "/login",
    component: _import("Login/index")
  },
  {
    path: "/router",
    component: _import("Layout/index"),
    redirect: "/router/index",
    children: [
      {
        path: "index",
        component: _import("Router/index")
      }
    ]
  },
  {
    path: "/page",
    component: _import("Layout/index"),
    redirect: "/page/index",
    children: [
      {
        path: "index",
        component: _import("Page/index")
      }
    ]
  }
];

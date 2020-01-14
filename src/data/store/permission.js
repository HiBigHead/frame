import { asyncRouterMap } from "routerF";
// 如果有权限功能，则对路由过滤
import * as api from "apiF/Permission";
// import store from "dataF/store";
import { filterRouters, filterPermission } from "../../common/check";
const permission = {
  state: {
    routers: [],
    addRouters: [],
    // 导航菜单
    menuNavs: [],
    // 按钮权限
    btnPermissions: [],
    // 数据权限
    dataPermissionArr: [],
    // 缓存页面name数组
    cachedViews: []
  },
  mutations: {
    // 路由
    SET_ROUTERS(state, routers) {
      state.addRouters = routers;
      state.routers = routers;
    },
    // 菜单
    SET_MENUNAVS(state, menuNavs) {
      state.menuNavs = menuNavs;
    },
    // 按钮权限
    SET_BTNPERMISSIONS(state, btnPermissions) {
      state.btnPermissions = btnPermissions;
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        api
          .getPermissionList({ sysId: 1})
        //   .getPermissionList({ sysId: store.getters.user.userInfo.sysId })
          .then(res => {
            let permissionObj = filterPermission(res.data);
            // 页面权限集合
            let pageNameArr = permissionObj.routerNameArr;
            // 按钮权限集合
            let btnNameArr = permissionObj.btnPessionArr;
            // 权限过滤后的路由
            let _asyncRouterMap = filterRouters(
              asyncRouterMap,
              pageNameArr,
              btnNameArr
            );
            // let _asyncRouterMap = asyncRouterMap
            commit("SET_ROUTERS", _asyncRouterMap);
            // 菜单导航模式，1 => 顶部菜单 || 2 => 侧边菜单|| 3 => TAB菜单
            commit("SET_MENUNAVS", _asyncRouterMap);
            commit("SET_BTNPERMISSIONS", btnNameArr);
            resolve();
          })
          .catch(_ => {
            reject(_);
          });
      });
    }
  }
};
export default permission;
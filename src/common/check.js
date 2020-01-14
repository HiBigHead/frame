import { loginOutCas } from "./utils/auth";
import { addEvent } from "./utils";

// 过滤动态路由
export function filterRouters(arr, routeKeysArr, btnPessionArr) {
  function _filetrFn(arr) {
    // 递归调用过滤
    return arr.filter(item => {
      if (item.children && item.children.length) {
        item.children = _filetrFn(item.children);
        item.children = item.children.filter(_item => {
          if (
            _item.meta &&
            _item.meta.permissions &&
            _item.meta.permissions.length
          ) {
            _item.meta.permissions = _item.meta.permissions.filter(
              itemChild => {
                return btnPessionArr.includes(itemChild.code);
              }
            );
          }
          return routeKeysArr.includes(_item.name);
        });
      }
      return routeKeysArr.includes(item.name);
    });
  }
  return filterNoHomeRouters(routeKeysArr, _filetrFn(arr));
}
function filterNoHomeRouters(routeKeysArr, arr) {
  // 无首页权限场景下 默认访问权限路由里的第一个页面
  if (!routeKeysArr.includes("Home") || !routeKeysArr.includes("HomeIndex")) {
    let _index = 0;
    let flag = arr.some((item, index) => {
      _index = index;
      return item.children && item.children.length > 0;
    });
    if (flag) {
      arr.push({
        path: "",
        redirect: arr[_index].path + "/" + arr[_index].children[0].path
      });
    }
  }
  return arr;
}

// 过滤权限数组
export function filterPermission(arr) {
  const obj = {
    routerNameArr: [],
    btnPessionArr: [],
    dataPermissionArr: []
  };
  function _filterFnArr(arr) {
    arr.map(item => {
      if (item.rightId) {
        if (
          ~~item.levelSort === 1 &&
          !(item.rightId === "DataDrivenAnalysisSystem")
        ) {
          // 非本系统权限树
          return;
        }
        if (item.rightRootId === "DataPermission") {
          // 数据权限
          obj.dataPermissionArr.push({
            name: item.rightName,
            code: item.rightId
          });
        } else {
          // 页面权限
          if (item.rightRootId === "PagePermission") {
            obj.routerNameArr.push(item.rightId);
          }
          if (item.rightId.includes(item.rightRootId)) {
            if (item.rightId.includes("_")) {
              // 按钮权限
              obj.btnPessionArr.push(item.rightId);
            } else {
              obj.routerNameArr.push(item.rightId);
            }
          }
        }
      }
      item.authorityUserBeanList &&
        item.authorityUserBeanList.length > 0 &&
        _filterFnArr(item.authorityUserBeanList);
    });
  }
  _filterFnArr(arr);
  return obj;
}
// 过滤出TAB菜单 sidebar侧边栏菜单
export function getNowRouter(asyncRouterMap, to) {
  // 如果有孩子就遍历孩子
  return asyncRouterMap.some(route => {
    if (to.path.indexOf(route.path) !== -1) {
      return true;
    } else if (route.children && route.children.length) {
      return getNowRouter(route.children, to);
    }
  });
}

/**
 * 监听鼠标、键盘是否有操作 默认5分钟未有操作跳转登录页
 * @param {Number} minute [分钟]
 */
export function listennerDocumentEvent(minute = 5) {
  let count = 0;
  // 监听鼠标
  addEvent(document, "mousemove", function() {
    count = 0;
  });
  addEvent(document, "click", function() {
    count = 0;
  });
  // 监听键盘
  addEvent(document, "keydown", function() {
    count = 0;
  });
  const timer = window.setInterval(listenFn, 1000);
  function listenFn() {
    count++;
    if (~~minute && ~~minute * 60 <= count) {
      clearInterval(timer);
      loginOutCas();
    }
  }
}

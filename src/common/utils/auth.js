const TokenKey = "Admin-Token";
const err = "Error:保存到本地存储失败!";
const errlimt = "Error:本地存储超过限制!";
export function getStorage(key) {
  if (window.localStorage.getItem(key || TokenKey)) {
    let dataObj = JSON.parse(window.localStorage.getItem(key || TokenKey));
    // 如果当前时间 - 存储元素在创建时设置得时间 大于过期时间
    let isTimed = new Date().getTime() - dataObj.time > dataObj.exprise;
    if (isTimed) {
      // 存储已经过期
      window.localStorage.removeItem(key || TokenKey);
      return null;
    } else {
      return dataObj.value;
    }
  } else {
    return null;
  }
}

export function setStorage(key, value, exprise, type) {
  return new Promise(resolve => {
    // 过期时间默认7天(毫秒)，获取当前时间，转换成JSON字符串序列
    let valueDate = JSON.stringify({
      value: value,
      time: new Date().getTime(),
      exprise: exprise || 60 * 60 * 24 * 7 * 1000,
      type: type || ""
    });
    try {
      window.localStorage.setItem(key || TokenKey, valueDate);
    } catch (e) {
      if (isQuotaExceeded(e)) {
        window.localStorage.clear();
        throw errlimt;
      } else {
        throw err;
      }
    }
    resolve();
  });
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key || TokenKey);
  } catch (e) {
    throw err;
  }
}

export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function loginOutCas() {
  // 注销登出
  removeStorage();
  let href = encodeURIComponent(
    window.location.origin + window.location.pathname
  );
  window.location.href = process.env.VUE_APP_LOGIN_URL + "?callBack=" + href;
}

function isQuotaExceeded(e) {
  let flag = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          flag = true;
          break;
        // fireFox
        case 1014:
          if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
            flag = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // ie
      flag = true;
    }
  }
  return flag;
}

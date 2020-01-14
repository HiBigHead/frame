/**
 * 工具包
 */
/**
 *  格式化时间 Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * 用户体验式格式化时间 几秒前、几分钟前、几小时前，何年何月何日
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * 获取URL参数并以对象数据形式返回
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

// 设置窗体滚动条高度
export function setScrollTop(top) {
  if (document.documentElement) {
    document.documentElement.scrollTop = top;
  } else if (document.body) {
    document.body.scrollTop = top;
  }
}

// 非空判断
export function isNotEmpty(value) {
  return value !== undefined && value !== "" && value !== null;
}

// 获取URL参数
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}

// 格式化HTML文本数据
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

// merge对象
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  for (const property in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property];
      if (typeof sourceProperty === "object") {
        target[property] = objectMerge(target[property], sourceProperty);
        continue;
      }
      target[property] = sourceProperty;
    }
  }
  return target;
}

// 滚动条定位
export function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

// 添加删除样式
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

// 延时调用
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

// 数据深拷
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "shallowClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === "object") {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}

// 数据深拷
// export function deepClone(data) {
//   const type = checkedType(data)
//   let result
//   if (type === 'Array') {
//     result = []
//   } else if (type === 'Object') {
//     result = {}
//   } else {
//     return data
//   }
//   if (type === 'Array') {
//     for (let i = 0, len = data.length; i < len; i++) {
//       result.push(deepClone(data[i]))
//     }
//   } else if (type === 'Object') {
//     // 对原型上的方法也拷贝了....
//     for (const key in data) {
//       result[key] = deepClone(data[key])
//     }
//   }
//   return result
// }

// 定义检测数据类型的功能函数
// function checkedType(target) {
//   return Object.prototype.toString.call(target).slice(8, -1)
// }

// 监听事件
export function addEvent(el, type, fn, capture) {
  if (window.addEventListener) {
    if (type === "mousewheel" && document.mozHidden !== undefined) {
      type = "DOMMouseScroll";
    }
    el.addEventListener(type, fn, !!capture);
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
}
// 移除事件
export function removeEvent(el, type, fn, capture) {
  if (window.removeEventListener) {
    if (type === "mousewheel" && document.mozHidden !== undefined) {
      type = "DOMMouseScroll";
    }
    el.removeEventListener(type, fn, !!capture);
  } else if (window.detachEvent) {
    el.detachEvent("on" + type, fn);
  }
}

// 解决浮点型计算精度问题
export function formatFloat(f, digit = 2, isNotRound) {
  if (arguments.length === 2 && typeof arguments[1] === "boolean") {
    isNotRound = arguments[1];
    digit = 2;
  }
  if (isNaN(Number(f))) {
    throw new Error("parameters cannot be non-numeric for formatFloat method");
  } else {
    if (typeof f === "string") {
      f = Number(f);
    }
  }
  f = f.toFixed(10);
  let m = Math.pow(10, digit);
  if (isNotRound) {
    return parseInt(f * m, 10) / m;
  }
  let _abs = 1;
  if (f < 0) {
    f = Math.abs(f);
    _abs = -1;
  }
  return (Math.round(f * m, 10) / m) * _abs;
}

// 深冻结
export function deepFreeze(o) {
  var prop, propKey;
  Object.freeze(o);
  for (propKey in o) {
    prop = o[propKey];
    if (
      // eslint-disable-next-line no-prototype-builtins
      !o.hasOwnProperty(propKey) ||
      !(typeof prop === "object") ||
      Object.isFrozen(prop)
    ) {
      continue;
    }
    deepFreeze(prop);
  }
}

/**
 * @see 获取随机数
 * @param str 随机数开头字母
 * @param n 随机数个数
 */
export function getRandomNum(str = "", n = 12) {
  if (typeof n === "string") {
    n = Number(n);
  }
  n += 2;
  return str + String(Math.random()).slice(2, n);
}

/**
 * HSL颜色值转换为RGB
 * H，S，L 设定在 [0, 1] 之间
 * R，G，B 返回在 [0, 255] 之间
 *
 * @param H 色相
 * @param S 饱和度
 * @param L 亮度
 * @returns Array RGB色值
 */
export function hslToRgb(H, S, L) {
  var R, G, B;
  if (+S === 0) {
    R = G = B = L; // 饱和度为0 为灰色
  } else {
    var hue2Rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    var P = 2 * L - Q;
    R = hue2Rgb(P, Q, H + 1 / 3);
    G = hue2Rgb(P, Q, H);
    B = hue2Rgb(P, Q, H - 1 / 3);
  }
  return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
}

// 获取随机HSL
export function randomHsl() {
  var H = Math.random();
  var S = Math.random();
  var L = Math.random();
  return [H, S, L];
}

// 获取HSL数组
export function getHslArray() {
  var HSL = [];
  var hslLength = 9; // 获取数量
  for (var i = 0; i < hslLength; i++) {
    var ret = this.randomHsl();

    // 颜色相邻颜色差异须大于 0.25
    if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
      i--;
      continue; // 重新获取随机色
    }
    ret[1] = 0.7 + ret[1] * 0.2; // [0.7 - 0.9] 排除过灰颜色
    ret[2] = 0.4 + ret[2] * 0.4; // [0.4 - 0.8] 排除过亮过暗色

    // 数据转化到小数点后两位
    ret = ret.map(function(item) {
      return parseFloat(item.toFixed(2));
    });

    HSL.push(ret);
  }
  return HSL;
}

import axios from "axios";
import { getStorage, loginOutCas } from "./auth";
import ErrorMessage from "./errorMessage";
import { MessageBox } from "element-ui";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});
service.interceptors.request.use(
  config => {
    // token
    if (getStorage()) {
      config.headers["Authorization"] = getStorage();
    }
    config.headers["version"] = "1";
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    if (response.data.code !== "000000") {
      return Promise.reject(response);
    } else {
      return Promise.resolve(response);
    }
  },
  error => {
    if (!error.response) {
      // 服务器请求失败时错误提示
      MessageBox({
        message: `请求超时${ErrorMessage.API_ERROR_LOAD}`,
        showCancelButton: false,
        confirmButtonText: "确定",
        type: "error",
        callback() {}
      });
    } else {
      switch (error.response.status) {
        case 400:
          error.message = ErrorMessage.STATUS_400;
          break;
        case 401:
          MessageBox({
            message: "失效，请再次登录！",
            showCancelButton: false,
            confirmButtonText: "确定",
            type: "error",
            callback() {
              loginOutCas();
            }
          });
          break;
        case 403:
          error.message = ErrorMessage.STATUS_403;
          break;
        case 404:
          error.message = ErrorMessage.STATUS_404;
          break;
        case 408:
          error.message = ErrorMessage.STATUS_408;
          break;
        case 500:
          error.message = ErrorMessage.STATUS_500;
          break;
        case 501:
          error.message = ErrorMessage.STATUS_501;
          break;
        case 502:
          error.message = ErrorMessage.STATUS_502;
          break;
        case 503:
          error.message = ErrorMessage.STATUS_503;
          break;
        case 504:
          error.message = ErrorMessage.STATUS_504;
          break;
        case 505:
          error.message = ErrorMessage.STATUS_505;
          break;
        default:
      }
      MessageBox({
        message: `请求失败-${error.message}`,
        showCancelButton: false,
        confirmButtonText: "确定",
        type: "error",
        callback() {}
      });
    }
    return Promise.reject(error);
  }
);

export default function(url, method, model, params, isPost) {
  let _config = {
    url: url,
    method: method
  };
  let _params = params
    ? model
      ? model.request(JSON.parse(JSON.stringify(params)))
      : params
    : "";
  if (method.toLowerCase() === "post" || isPost) {
    _config.data = _params;
  } else {
    _config.params = _params;
  }
  return new Promise((resolve, reject) => {
    return service(_config)
      .then(response => {
        resolve(model ? model.response(response.data) : response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

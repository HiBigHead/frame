import router from '../router'
import store from '../data/store'
import { Message, MessageBox } from 'element-ui'
// progress bar
import NProgress from 'nprogress'
import {
    setStorage,
    getStorage,
    getQueryString,
    loginOutCas
  } from './utils/auth' // get token from cookie


  NProgress.configure({ showSpinner: false }) // NProgress Configuration

  const whiteList = [] // no redirect whitelist
  
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    // set page title
    if(to.path.match('login')){runRouter(); return true}
    const hasToken = getStorage()
    
    if (hasToken) {
      try {
        runRouter()
      } catch (error) {
        // 错误 重置token 跳转登录页
        // await store.dispatch('resetStorage')
        Message.error(error || 'Has Error')
        // next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else {
      // has no token
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        if (getQueryString('token')) {
          // url 里有传token时
          setStorage(null, getQueryString('token')).then(() => {
            runRouter()
          })
        } else {
            console.log(to.path);
            
          // 跳转登录认证
        //   loginOutCas()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
    function runRouter() {
      if (store.getters.permission.addRouters.length === 0) {
        store
          .dispatch('GenerateRoutes')
          .then(() => {
            // 依token获取用户信息
            store
              .dispatch('GetCasUserName')
              .then(() => {
                // 没有任何页面权限的时候
                if (store.getters.permission.addRouters.length < 1) {
                  NProgress.done()
                  MessageBox({
                    message: '您没有任何页面访问权限，请联系管理员配置权限！',
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    type: 'error',
                    callback() {
                      loginOutCas()
                    }
                  })
                } else {
                  router.addRoutes(store.getters.permission.addRouters)
                  next({ ...to, replace: true })
                }
              })
              .catch(() => {
                NProgress.done()
                MessageBox({
                  message: '获取用户信息失败！',
                  showCancelButton: false,
                  confirmButtonText: '确定',
                  type: 'error',
                  callback() {}
                })
              })
          })
          .catch(() => {
            NProgress.done()
            MessageBox({
              message: '获取菜单树失败！',
              showCancelButton: false,
              confirmButtonText: '确定',
              type: 'error',
              callback() {
                loginOutCas()
              }
            })
          })
      } else {
        next()
      }
    }
  })
  
  router.afterEach(() => {
    NProgress.done()
  })
  


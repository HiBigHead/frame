import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

//页面仓库
import pages from './pages/index'

/* End */

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        ...pages
    },
    getters
})

export default store
module.exports = {
    configureWebpack: config => {
        config.devtool = 'cheap-source-map'
        config.externals = {
            // cdn 版本的element-ui、vue、vue-router设置的全局变量分别是ELEMENT、Vue、VueRouter、axios、VueI18n
            vue: 'Vue',
            'vue-router': 'VueRouter',
            vuex: 'Vuex',
            axios: 'axios',
            'element-ui': 'ELEMENT',
            // i18n: 'VueI18n',
            echarts: 'echarts'
        }
    }
}
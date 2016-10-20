import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'

// 同步路由到vuex store里面
// 存放在vuex.store.router里面
sync(store, router)

// 注册公共的过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 创建app的实例
// 这里我们注入所有的路由以及store里面的所有子组建
// 使用`this.$router` 和 `this.$store`可在vue任何一个地方用到
const app = new Vue({
  router,
  store,
  ...App // 从App传进来的一切对象
})

// 导出app, router, store
export { app, router, store }

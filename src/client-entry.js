require('es6-promise').polyfill()
import { app, store } from './app'

//使用服务器初始化状态的存储。(即直出的数据)
//即在页面内连的window.__INITIAL_STATE__的SSR和内联在页面标记。
store.replaceState(window.__INITIAL_STATE__)

// 在页面#app中输出html，区别与vue1版本的
app.$mount('#app')

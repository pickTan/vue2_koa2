import { app, router, store } from './app'

const isDev = process.env.NODE_ENV !== 'production'

//该导出函数将被命名为` bundlerenderer `。
//这是我们执行数据预取，以确定
//我们的应用程序之前，实际上渲染它。
//由于数据获取是异步的，这个函数将
//返回一个异步的promise给应用程序实例的作为初始化state放入上下文（对应bin/app里的content）。
export default context => {
  // 放入页面请求的url到router里面
  router.push(context.url)

  const s = isDev && Date.now()

  //通过异步的请求获得对应组建，运行对应组建的请求方法，通过对应组建的请求store
  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.preFetch) {
      return component.preFetch(store)
    }
  })).then(() => {
    isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
    //将store里请求回来的对应数据放入系统的state里面，返回app首页
    context.initialState = store.state
    return app
  })
}

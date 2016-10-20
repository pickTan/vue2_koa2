process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'

import Koa from 'koa'
import cors from 'koa-cors'
import compress from 'koa-compress'
import json from 'koa-json'
import send from 'koa-send'
import serve from 'koa-static'
import logger from 'koa-logger'
import convert from 'koa-convert'
import artTemplate from 'koa-artTemplate'
import bodyParser from 'koa-bodyparser'
import path from 'path'
import fs from 'fs'
import serialize  from 'serialize-javascript' //序列化 JavaScript 库成含有正则表达式和功能的 JSON 包
import getOpenId from './redis'
import { KoaErr } from './helper'
import proxy from './proxy'
import {createBundleRenderer} from 'vue-server-renderer'//vue服务器渲染
const app =new Koa()
//设置文件根路径
const resolve = file => path.resolve(__dirname, file)

// 全局错误处理
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.body = err
        ctx.status = err.status || 500
    }
})

// 使用自定义错误
app.use(async (ctx, next) => {
  ctx.Err = KoaErr
  await next()
})


// //设置Header
app.use(async (ctx, next) => {
    await next()
    ctx.set('X-Powered-By', 'web-app')

    // console.log("the first")
})


// 设置gzip
app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

// 记录所用方式与时间
app.use(convert(logger()))

// 设置跨域
app.use(convert(cors()))

// 传输JSON
app.use(convert(json()))

// body解析
app.use(bodyParser())

// 设置渲染引擎
// app.use(artTemplate(path.resolve(__dirname, '../index.html')))

// 静态文件夹 (开发用，生成静态资源访问静态服务器)
app.use(convert(serve(resolve('../dist'))));

/**
 * 直出页面
 * 如果请求为／doAction／* 则时接口访问
 * 如果不是 则是页面直出
 */
app.use(async(ctx,next) =>{
    const reg = /^\/doAction\//;
    const isPort = reg.test(ctx.path);
    //访问借口
    if (isPort)  return await next();

        // const context = { url: ctx.path }
        // ctx.body = await renderHtl(context);
        ctx.status = 200
        ctx.res.write(html.head);
        const context = { url: ctx.path }
        await renderer.renderToString(context, (err,hl)=>{
            // console.log(1111);
            ctx.res.write( `${html.head}<script>window.__INITIAL_STATE__=${
                serialize(context.initialState, { isJSON: true })
                }</script>${hl}`);
            // console.log(4444);
            ctx.res.end(html.tail);
        })
        // const context = { url: ctx.path }
        // const renderStream = renderer.renderToStream(context)
        // let firstChunk = true
        // ctx.res.write(html.head)
        // renderStream.on('data', chunk => {
        //     if (firstChunk) {
        //         // embed initial store state
        //         if (context.initialState) {
        //             ctx.res.write(
        //                 `<script>window.__INITIAL_STATE__=${
        //                     serialize(context.initialState, { isJSON: true })
        //                     }</script>`
        //             )
        //         }
        //         firstChunk = false
        //     }
        //     ctx.res.write(chunk)
        //     // console.log(22)
        // })
        //
        // renderStream.on('end', () => {
        //     console.log("the first")
        //     ctx.res.end(html.tail)
        // })
        //
        // renderStream.on('error', err => {
        //     // throw err
        // })

})



/**
 * 访问接口
 * 页面传入数据格式为 {head:{}body:{}}
 * 页面传入数据head里面有一个页面类型 type:[wx|pc|webApp]
 * wx：微信端访问
 * pc：pc端访问
 * webApp : 移动端访问
 */

//微信访问
app.use(async(ctx,next) =>{
    const webType = ctx.body.head.type;
    if (webType!='wx') return await next();
    const flag = await getOpenId(openid)
    ctx.body = flag ?  await proxy({func:ctx.path.replace(reg,''),openid:openid,bodyBody:htBodyBody})
        :  {status:'E0002',info:'未关注公众号'}
})



app.listen(process.env.PORT || 3001)
console.log(`Server up and running! On port ${process.env.PORT || 3001}!`)

import './getToken' //获取令牌的自动任务




/**
 * 数据直出
 * @type {{head, tail}}
 */
//读取index.html模版
const html = (() => {
    const template = fs.readFileSync(resolve('../index.html'), 'utf-8')
    const i = template.indexOf('{{ APP }}')
    // styles are injected dynamically via vue-style-loader in development
    const style = isProd ? '<link rel="stylesheet" href="http://127.0.0.1/styles.css">' : ''
    return {
        head: template.slice(0, i).replace('{{ STYLE }}', style),
        tail: template.slice(i + '{{ APP }}'.length)
    }
})()

//将服务器渲染的真实数据加入模版中
const createRenderer =  (bundle) => createBundleRenderer(bundle, {cache: require('lru-cache')({max: 1000, maxAge: 1000 * 60 * 15})})
let renderer
if (isProd) {
    const bundlePath = resolve('../dist/server-bundle.js')
    renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'))
} else {
    require('./setup-dev-server')(app, bundle => {
        renderer = createRenderer(bundle)
    })
}
//数据直出
function renderHtl(context){
         return renderer.renderToString(context, (err,hl)=>{
             console.log(hl);
             return `${html.head}<script>window.__INITIAL_STATE__=${
                    serialize(context.initialState, { isJSON: true })
                    }</script>${hl+html.tail}`;

            })
}


/**
 * Created by pengfeng on 2016/10/19.
 */
const Koa = require('koa');
const route = require('koa-route');
const convert = require('koa-convert');
const multer = require('koa-multer');

const app = new Koa();
const upload = multer({ dest: '../dist/images/' });

app.use(convert(function*(){
    console.log(this.headers)
    upload.single('avatar')
}));


app.listen(3000);
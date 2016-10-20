/**
 * 参数配置
 * Created by pengfeng on 2016/10/18.
 */

//base64方法
const base64 = (str) => (new Buffer(str)).toString('base64')

//商户ID
export const M_ID = 'S201610171001'

//访问密钥
export const ACCESS_KEY = '5254af68943c11e6bc02001b7899e15e'

//缺省时访问
export const GUEST = 'guest'

//APP_CODE
export const APP_CODE = 'A018'

//APP_CODE
export const USER_AGENT = 'web'

//访问java后台路径
export const PORT_URL = 'http://172.16.1.139:8595/rmip_a018/doAction'

//当接口为缺省时安全认证信息
export const FALSE_AUTHORIZATION = base64(`${GUEST}:${GUEST}`)

//当接口不为时安全认证信息
export const TRUE_AUTHORIZATION = base64(`${M_ID}:${ACCESS_KEY}`)


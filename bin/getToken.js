/**
 * Created by pengfeng on 2016/10/18.
 */
import proxy from './proxy'

/**
 *获取token的自动任务
 *默认在nodejs服务启动时进行自动任务
 */
const getToken = async () => {
    const result =   await proxy({DeviceToken:''});

    (result.status == 200) ? againGet(result) : getToken()
}
getToken()

/**
 * 获取token
 * @param result
 */
function againGet(result){
    const time = (parseInt(result.max_timeout)-600 )* 1000 //提前10分钟获取token
    !!result.iskeepalive || setTimeout(getToken, time)
    global.token = result.token
    console.log(`时间：${new Date()}  token:${result.token}`)
}
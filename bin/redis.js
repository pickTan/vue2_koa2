/**
 * Created by pengfeng on 2016/10/19.
 */
import {createClient} from  'then-redis'
const db = createClient('http://172.16.1.211:6380')
/**
 * 查询微信openid是否存在
 * @param openid
 */
export default (openid)=>db.select(1).then(()=>db.get(openid).then((value) => value))
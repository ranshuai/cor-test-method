import request from '@/utils/request'
import { netWork_onLine } from "@/utils/index";

export function HttpService(json) {
    //如果没有网络
    if (!netWork_onLine) {
        return new Promise((resolve, reject) => {
            resolve({
                success: false,
                msg: '网络已断开，请检查网络连接'
            })
        })
    }
    return request({
        url: json.url,
        method: json.method || json.type || 'get',
        params: json.params || {},
        data: json.data || {}
    })
}

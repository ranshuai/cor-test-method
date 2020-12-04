/**
 *  
 */
import httpConfig from './httpConfig'

import axios from "axios";

import { isDeviceSelect } from '../utils/index'

import { Toast, Indicator } from "mint-ui";
class HttpService {
    static IS_DEBUG = false;
    static IS_DEVICE = isDeviceSelect();
    constructor() {
        this.IS_DEBUG = false;
    }
    /**
     * 需要一些必传参数
     * @param {*} json 
     * return {}
     */
    static _params(json) {
        // json.params && (json.params.type = (HttpService.IS_DEVICE == 'phone' || HttpService.IS_DEVICE == 'pad') ? '1' : '0')
        //验证码登录 type = ‘0’ 
        // if(json.params.apiType){
        //     json.params.type = json.params.apiType
        // }
        return new Promise((resolve) => {

            //params 添加字段
            Object.assign(json.params, {
                "token": this._getLocalStorage('token')
            });
            let _json = Object.assign({}, json);
            //删除对象的url 属性
            // delete _json.url
            Reflect.deleteProperty(_json, 'url')
            let __json = {
                url: process.env.BASE_API + json.url,
                options: _json
            }
            resolve(__json)
        })
    }
    static _headers(json) {
        return new Promise((resolve) => {
            resolve(json)
        })
    }
    static _axiosRequest(url, options) {
        return new Promise((resolve, reject) => {
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
            HttpService.IS_DEBUG && console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
            axios.defaults.withCredentials = true;
            axios({
                url: url,
                method:options.method || 'GET',
                params: options.params,
                data: options.data,
                headers: options.headers,
                timeout: 30000,
            }).then(res => {
                Indicator.close();
                if (res.data.success) {
                    if (res.data.msg == 'token过期') {
                        window.location.href = '/#/login'
                        return
                    }
                    HttpService.IS_DEBUG && console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
                    if (res.data.result[0] && res.data.result[0].status === false) {
                        Toast(res.data.msg)
                    } else {
                        resolve(res)
                    }
                } else {
                    // Toast(res.data.msg)
                    if (res.data.errorCode == '401'||res.data.errorCode == '404') {
                        resolve(res)
                        if (HttpService.IS_DEVICE == "phone") {
                            window.location.href = '/mobilelogin'
                        } else {
                            window.location.href = '/login'
                        }
                        return 
                    }
                    resolve(res)
                }
            }).catch(err => {
                Indicator.close();
                HttpService.IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'res', err);
                reject(err);
                this._requestFailed(url, options, err)
            });
        })
    }
    static _requestFailed(url, options, err) {
        Toast(err)
    }

    //获取http配置信息
    getHttpConfig() {
        return httpConfig
    }

    //商品列表 Api
    api(json) {
        return new Promise((resolve, reject) => {
            HttpService._params(json).then(res => {
                HttpService._axiosRequest(res.url, res.options).then(res => {
                    resolve(res.data);
                }).catch(err => {
                    reject(err);
                });
            })
        })
    }

    /**
     * 设置缓存信息
     * @param key
     * @param data
     */
    setLocalStorage(key, data) {
        return window.localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * 获取指定缓存信息
     * @param key
     */
    getLocalStorage(key) {
        if (window.localStorage.getItem(key) == "undefined") {
            return undefined
        } else {
            return JSON.parse(window.localStorage.getItem(key));
        }
    }
    /**
     * 获取指定缓存信息
     * @param key
     */
    static _getLocalStorage(key) {
        if (window.localStorage.getItem(key) == "undefined") {
            return undefined
        } else {
            return JSON.parse(window.localStorage.getItem(key));
        }
    }

    /**
     * 删除指定缓存
     * @param key
     */
    removeLocalStorage(key) {
        return window.localStorage.removeItem(key);
    }

}

export default new HttpService()

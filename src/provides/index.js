
import Wlpreset from './wlpreset'

export { Wlpreset }

/**
 * 获取指定缓存信息
 * @param key
 */
export function getLocalStorage(key) {
    if (window.localStorage.getItem(key) == "undefined") {
        return undefined
    } else {
        return JSON.parse(window.localStorage.getItem(key));
    }
}
/**
 * 设置缓存信息
 * @param key
 * @param data
 */
export function setLocalStorage(key, data) {
    return window.localStorage.setItem(key, JSON.stringify(data));
}

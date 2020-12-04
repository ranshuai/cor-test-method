//当前网路环境
let netWork_onLine = true;
let netWork = function () {
    window.addEventListener('online', function () {
        netWork_onLine = true;
    });
    window.addEventListener('offline', function () {
        netWork_onLine = false;
    });
}

//当前网路状态

function getNetworkType() {
    var ua = navigator.userAgent;
    var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    networkStr = networkStr.toLowerCase().replace('nettype/', '');
    var networkType;
    switch (networkStr) {
        case 'wifi':
            networkType = 'wifi';
            break;
        case '4g':
            networkType = '4g';
            break;
        case '3g':
            networkType = '3g';
            break;
        case '3gnet':
            networkType = '3g';
            break;
        case '2g':
            networkType = '2g';
            break;
        default:
            networkType = 'other';
    }
    return networkType;
}
//用户使用的设备
function isDevice() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows",
        "iPad", "iPod"];
    var flag = '';
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = Agents[v];
            break;
        }
    }
    return flag;
}

// 判断用户使用设备
function isDeviceSelect() {
    let os = function () {
        var ua = navigator.userAgent;
        var isWindowsPhone = /(?:Windows Phone)/.test(ua);
        var isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
        var isAndroid = /(?:Android)/.test(ua) && /(?:Mobile)/.test(ua);
        var isFireFox = /(?:Firefox)/.test(ua);
        var isChrome = /(?:Chrome|CriOS)/.test(ua);
        var isTablet = /(?:iPad|PlayBook)/.test(ua) || (/(?:Android)/.test(ua) && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
        var isPhone = /(?:iPhone)/.test(ua) && !isTablet;
        var isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc
        };
    }();
    var flag = '';
    if (os.isAndroid || os.isPhone) {
        flag = 'phone';

    } else if (os.isTablet) {
        flag = 'pad';
    } else if (os.isPc) {

        flag = 'pc';
    }

    return flag;
}


export { isDeviceSelect, getNetworkType, netWork, netWork_onLine }

/**
 * 设置缓存信息
 * @param key
 * @param data
 */
export function setSessionStorage(key, data) {
    return window.sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * 获取指定缓存信息
 * @param key
 */
export function getSessionStorage(key) {
    if (window.sessionStorage.getItem(key) == "undefined") {
        return undefined
    } else {
        return JSON.parse(window.sessionStorage.getItem(key));
    }
}

/**
 * 删除指定缓存
 * @param key
 */
export function removeSessionStorage(key) {
    return window.sessionStorage.removeItem(key);
}

import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

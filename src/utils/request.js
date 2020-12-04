import axios from "axios";
import { Toast, Indicator } from "mint-ui";
import router from '../router'
import { isDeviceSelect } from './index'
// create an axios instance
console.log('process.env.BASE_API=>>>>>>>',process.env.BASE_API)
const service = axios.create({
    baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 50000, // request timeout
    withCredentials: true,
});

service.interceptors.request.use(
    config => {
        Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
        });
        config.headers["mobile-flag"] = isDeviceSelect() == "phone" ? '1' : '0';
        let Authorization = sessionStorage.getItem('Authorization')
        if (Authorization) {
            config.headers["Authorization"] = Authorization;
            // config.headers["Access-Control-Allow-Origin"] = "*";
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */

    response => {
        Indicator.close();
        const res = response.data;
        if (!res.success) {
            //token 过期 或者没有权限访问,
            if (res.errorCode == "401") {
                sessionStorage.clear();
                if (isDeviceSelect() == "phone") {
                    router.push({
                        path: '/mobilelogin',
                        name: 'mobilelogin',
                    })
                } else {
                    router.push({
                        path: '/login',
                        name: 'login',
                    })
                }
            } else {
                Toast({
                    message: res.msg,
                    type: "error",
                    duration: 3 * 1000
                });
            }
            return response.data;
        } else {
            return response.data;
        }
    },
    error => {
        Indicator.close();

        if (error.response.status == 401) {
            sessionStorage.clear();
            if (isDeviceSelect() == "phone") {
                router.push({
                    path: '/mobilelogin',
                    name: 'mobilelogin',
                })
            } else {
                router.push({
                    path: '/login',
                    name: 'login',
                })
            }
            return
        }

        Toast({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;

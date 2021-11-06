import axios from "axios";
import qs from "qs";
import { Message } from "antd";
import config from "../config";

const http = axios.create({
    paramsSerializer: params => qs.stringify(params),
});

http.interceptors.request.use(
    function (config) {
        if (config.method === "get") {
            config.params = config.data;
        }
        if (!config.headers["content-type"]) {
            config.headers["content-type"] = "application/json;charset=UTF-8";
        }
        const token = localStorage.getItem('token');
        config.headers.common['Authorization'] = 'Bearer ' + token;
        // 在发起请求请做一些业务处理
        return config;
    },
    function (error) {
        // 对请求失败做处理
        return Promise.reject(error);
    }
);
http.interceptors.response.use(
    function (response) {
        console.log('process.env.ServerUrl', config.serverUrl)
        if (response.status == 200) {
            return response.data
        }
        return response.data;
    },
    function (error) {
        // 用于主动取消axios请求的情况
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }
        if (error.response) {
            let { data, status, statusText } = error.response;
            let { message, code } = data || {};
            if (code === 401) {
                window.localStorage.removeItem('token')
                return Message.error('用户未登录, 请先登录', 1.5, function () {
                    return window.location.href = `${config.serverUrl || ''}/login`
                })
            } else {
                Message.error(status + ' ' + (message || statusText))
            }
        }
        return Promise.reject(error);
    }
);

http.uploadFile = function (url, data, options) {
    let form = new FormData();

    for (const dataKey in data) {
        if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
            form.set(dataKey, data[dataKey]);
        }
    }

    return http({
        method: "POST",
        data: form,
        ...options
    });
};

export default http;

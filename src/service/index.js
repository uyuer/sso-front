import http from 'utils/http'
import sso from './sso';

const apiPrefix = '/sso';
const service = {
    sso,
};

const gen = (params, key) => {
    let [method, url] = params.split(' ');
    let defaultOptions = {};
    method = method.toLowerCase();
    if (url) {
        url = apiPrefix + url;
    }
    return (data, options = {}) => {
        return http({ url, data, method, ...defaultOptions, ...options })
    }
};


for (const key in service) {
    for (const item in service[key]) {
        service[key][item] = gen(service[key][item], key)
    }
}

export default service;




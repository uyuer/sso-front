let NODE_ENV = process.env.NODE_ENV;
let config = {
    development: {
        serverUrl: '', // 开发环境下登录服务的地址
    },
    test: {
        serverUrl: '',
    },
    production: {
        serverUrl: '',
    },
}
export default config[NODE_ENV]
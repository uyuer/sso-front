let NODE_ENV = process.env.NODE_ENV;
let config = {
    development: {
        serverUrl: 'http://localhost:9601',
    },
    production: {
        serverUrl: '',
    },
}
export default config[NODE_ENV]
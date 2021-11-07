import Login from 'container/login';
import Register from 'container/register';

export default [
    { path: 'login', name: '登陆', component: Login, exact: true },
    { path: 'register', name: '注册', component: Register, exact: true },
];
import Login from 'container/login';
import Register from 'container/register';
import User from 'container/user';

export default [
    { path: 'login', name: '登陆', component: Login, exact: true },
    { path: 'register', name: '注册', component: Register, exact: true },
    { path: 'user', name: '个人中心', component: User, exact: true },
];
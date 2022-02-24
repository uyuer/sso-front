import React, { useEffect, useRef, useState, useContext } from 'react';
import { Input, Message, Form, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';
import styles from './style.module.scss';

import WebsiteName from 'components/WebsiteName';
import Navigate from 'components/Navigate';
import Beian from 'components/Beian';

import service from 'service'
import CommonContext from 'components/Common/context';

// // AES加密 加密用户网站密码
// let ciphertext = CryptoJS.AES.encrypt('123456', '123456').toString();
// let plaintext = CryptoJS.AES.decrypt(ciphertext, '123456').toString(CryptoJS.enc.Utf8);
// console.log(ciphertext, plaintext)

// // sha256加密 加密用户登录密码, 用户密码为密钥key
// CryptoJS.SHA256('123456', '123456').toString()

const formItemLayout = {
    labelCol: {
        md: { span: 6 },
        sm: { span: 6 },
        xs: { span: 24 },
    },
    wrapperCol: {
        md: { span: 18 }, // 屏幕 ≥ 768px
        sm: { span: 18 }, // 屏幕 ≥ 576px
        xs: { span: 24 }, // 屏幕 < 576px
    },
};
const tailLayout = {
    wrapperCol: {
        md: { offset: 6, span: 18 },
        sm: { offset: 6, span: 18 },
        xs: { offset: 0, span: 24 },
    },
};
// 登录
export default function Login(props) {
    let { loggedChange } = useContext(CommonContext);
    const formInstance = useRef();
    const [loading, setLoading] = useState(false);
    let urlParams = new URLSearchParams(window.location.search);
    let serviceURL = urlParams.get('serviceURL');

    const str = localStorage.getItem('user');
    const userinfo = str ? JSON.parse(str) : {}
    const initialValues = { username: userinfo.email }

    function handleSubmit(value) {
        let { username, password } = value;
        let enCryptPassword = CryptoJS.SHA256(password, password).toString();
        let params = {
            username,
            password: enCryptPassword,
            serviceURL: serviceURL ? serviceURL : '',
        }
        if (loading) return;
        setLoading(true);
        service.sso.login(params).then(response => {
            if (response) {
                loggedChange(true)
                Message.success('登录成功, 即将跳转..', 1.5, function () {
                    let { data } = response;
                    data && (window.location.href = data)
                });
            }
        }).catch(function (error) {
            loggedChange(false)
        }).finally(() => {
            setLoading(false);
        })
    };
    
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.formContent}>
                    <Form
                        {...formItemLayout}
                        onFinish={handleSubmit}
                        initialValues={initialValues}
                        ref={formInstance}
                    >
                        <Form.Item {...tailLayout}>
                            <WebsiteName />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Navigate />
                        </Form.Item>
                        <Form.Item
                            label={'用户名'}
                            name="username"
                            rules={[
                                { required: true, message: '请输入' },
                            ]}
                            extra="可使用邮箱或用户名登录"
                        >
                            <Input
                                className={styles.inputStyle}
                                placeholder="输入用户名"
                                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'密码'}
                            name="password"
                            rules={[
                                { required: true, message: '请输入' },
                            ]}
                            extra="密码将会以输入的密码为加密密钥使用SHA256方式加密"
                        >
                            <Input.Password
                                className={styles.inputStyle}
                                placeholder="请输入密码"
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit" type="primary" loading={loading} disabled={loading} className={styles.inputStyle}>登录</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className={styles.footer}>
                <Beian />
            </div>
        </div>
    )
}
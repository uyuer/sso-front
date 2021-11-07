import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Input, Message, Form, Radio, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';
import styles from './style.module.scss';

import service from 'service'

import WebsiteName from 'components/WebsiteName';
import Navigate from 'components/Navigate';
import Beian from 'components/Beian';

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
// 注册
export default function Register(props) {
    const formInstance = useRef();
    const [count, setCount] = useState(59);
    const [sending, setSending] = useState(false);
    const [start, setStart] = useState(false);
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     document.body.style.background = 'red'
    // }, [])
    // 发送验证码
    async function sendCodeHandle(e) {
        let { validateFields } = formInstance.current;
        let field = await validateFields(['email']);
        // setFieldsValue({ code: undefined })
        if (sending) return;
        setSending(true)
        service.ordinary.sendCode(field).then(data => {
            console.log(data, 'register-用户注册->发送验证码') // 只返回response中的data;
            if (data) {
                Message.success('邮件已发送,30分钟以内有效')
                setSending(false)
                setStart(true)
                down(count, (count) => {
                    if (count >= 0) {
                        setCount(count)
                    }
                    if (count <= 0) {
                        setTimeout(() => {
                            setCount(59)
                            setStart(false)
                        }, 1000)
                    }
                })
            }
        }).finally(() => {
            setSending(false)
        })
    }
    // 点击注册执行操作
    async function handleSubmit(value) {
        console.log(CryptoJS.SHA256('123456', '123456').toString())
        let { username, password, repassword, male, email, code } = value;
        if (password !== repassword) {
            return Message.info('两次密码输入不一致')
        }
        let params = {
            username,
            password: CryptoJS.SHA256(password, password).toString(),
            repassword: CryptoJS.SHA256(repassword, repassword).toString(),
            male,
            email, code
        }
        if (loading) return;
        setLoading(true);
        service.ordinary.register(params)
            .then(data => {
                console.log(data, 'register-用户注册->请求结果') // 只返回response中的data;
                if (data) {
                    Message.success('注册成功')
                    window.localStorage.setItem('user', JSON.stringify({ username, email }))
                    props.history.push('/login')
                }
            })
            .finally(() => {
                setLoading(false);
            })
    };

    function finishFailed(errorInfo) {
        console.log(errorInfo);
    }

    // 倒计时自减
    const down = useCallback(() => {
        const fn = function (count, fn) {
            if (count <= 0) return;
            setTimeout(() => {
                count--;
                fn(count)
                fn(count, fn)
            }, 1000)
        }
        return fn;
    }, [count])
    // function down(count, fn) {
    //     if (count <= 0) return;
    //     setTimeout(() => {
    //         count--;
    //         fn(count)
    //         down(count, fn)
    //     }, 1000)
    // }

    useEffect(() => {
        if (start) {
            down(count, setCount)
        }
    }, [start, down, count])

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.formContent}>
                    <Form
                        {...formItemLayout}
                        onFinish={handleSubmit}
                        onFinishFailed={finishFailed}
                        initialValues={{
                            // email: '271654537@qq.com',
                            // username: 'test005',
                            // password: '123456',
                            // repassword: '123456',
                            male: '2'
                        }}
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
                        >
                            <Input.Password
                                className={styles.inputStyle}
                                placeholder="请输入密码"
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'重复密码'}
                            name="repassword"
                            rules={[
                                { required: true, message: '请输入' },
                            ]}
                        >
                            <Input.Password
                                className={styles.inputStyle}
                                placeholder="请重复密码"
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            label={'性别'}
                            name="male"
                            rules={[{ required: false }]}
                        >
                            <Radio.Group>
                                <Radio value={'2'}>保密</Radio>
                                <Radio value={'1'}>男</Radio>
                                <Radio value={'0'}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={'邮箱'}
                            name="email"
                            rules={[
                                { required: true, message: '请输入' },
                                { type: 'email', message: '请输入正确的邮箱格式' },
                            ]}
                        >
                            <Input
                                className={styles.inputStyle}
                                placeholder="输入邮箱"
                                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </Form.Item>
                        <Form.Item label="邮箱验证码" extra="需要验证您的邮箱来确保不会恶意注册" >
                            <Form.Item
                                name="code"
                                noStyle
                                rules={[
                                    { required: true, message: '请输入' },
                                ]}
                            >
                                <Input placeholder="输入验证码" style={{ width: 100 }} />
                            </Form.Item>
                            <Button style={{ marginLeft: '10px', width: '100px' }} disabled={start || loading} loading={sending} onClick={sendCodeHandle}>{start ? count + '秒' : '获取'}</Button>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button htmlType="submit" type="primary" loading={loading} disabled={loading} className={styles.inputStyle}>注册</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className={styles.footer}>
                <Beian />
            </div>
        </div >
    )
}
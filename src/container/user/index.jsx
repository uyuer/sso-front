import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import styles from './style.module.scss';

import Calendar from 'components/Clock/calendar';
import NumberClock from 'components/Clock/numberClock';
import Beian from 'components/Beian';
import Navigate from 'components/Navigate';

import service from 'service';
import avatar from 'images/avatar.jpg';
const format = 'YYYY-MM-DD HH:mm:ss'

const TITLE = '幽钥的小站-个人中心';
// 头像路径问题: 后端返回根路径,前端获取地址拼接; 或者后端直接返回完整路径
// 用户-个人中心页
export default () => {
	const containerRef = useRef();
	const [userInfo, setUserInfo] = useState({})

	async function getUserInfo(value) {
		let userStr = localStorage.getItem('user')
		let user = JSON.parse(userStr || '{}');
		let params = { id: user.id };
		service.user.findOne(params)
			.then(data => {
				setUserInfo(data)
			})
			.finally(() => {
				console.log('获取用户信息')
			})
	};

	useEffect(() => {
		getUserInfo();
	}, [])

	useEffect(() => {
		document.title = TITLE;
		if (containerRef) {
			console.log(document.body.offsetHeight, document.body)
			containerRef.current.style.height = `${document.body.scrollHeight}px`;
		}
	}, [containerRef])
	return (
		<div className={styles.container} ref={containerRef}>
			<div className={styles.content}>
				<div className={styles.avatarWrap}>
					<div className={styles.avatar}>
						<div className={styles.avatarImg}>
							<img src={window.location.protocol + '//' + userInfo.avatarFullPath || avatar} alt='' />
						</div>
						<div className={styles.infoText}>
							<p className={styles.name}>
								<span>{userInfo.username || '--'}</span>
							</p>
							<p className={styles.account}>
								<span>{userInfo.email || '--'}</span>
							</p>
						</div>
					</div>
				</div>
				<div className={styles.infoText}>
					<p className={styles.description}>
						<span>账户状态{userInfo.status === '1' ? '正常' : '冻结'}</span>
					</p>
					<p className={styles.description}>
						<span>创建时间：{moment(userInfo.createTime).format(format) || '--'}</span>
					</p>
					<p className={styles.description}>
						<span>更新时间：{moment(userInfo.updateTime).format(format) || '--'}</span>
					</p>
				</div>
				<div className={styles.menu}>
					<a href="">修改昵称</a>
					<a href="">修改密码</a>
					<a href="">更改验证邮箱</a>
					<a href="">注销账户</a>
				</div>
				<div className={styles.position}>
					<Calendar />
					{/* <NumberClock /> */}
				</div>
				<div className={styles.navigator}>
					<Navigate title={false} />
				</div>
			</div>
			<div className={styles.beian}>
				<Beian />
			</div>
		</div>
	);
};

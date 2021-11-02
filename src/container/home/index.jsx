import React, { useRef, useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from './style.module.scss';

import WebsiteName from 'components/WebsiteName';
import Navigate from 'components/Navigate';
import Clock from 'components/Clock';
import Beian from 'components/Beian';

const TITLE = '幽钥的小站-首页'
// 用户-个人中心页
export default (props) => {
	const contentRef = useRef();
	const [full, setFull] = useState(false);
	const [contentAttr, setContentAttr] = useState({});
	useEffect(() => {
		if (full) {
			contentRef.current.style.height = '100%';
		} else {
			contentRef.current.style.height = contentAttr.height;
		}
	}, [full])
	useEffect(() => {
		if (contentRef.current) {
			let eleStyle = window.getComputedStyle ? window.getComputedStyle(contentRef.current, null) : contentRef.current.currentStyle;
			let dur = eleStyle.transitionDuration.replace('s', '');
			let temp = {
				height: eleStyle.height,
				transitionDuration: eleStyle.transitionDuration,
				durTime: Number(dur) * 1000,
			}
			setContentAttr(temp);
		}
	}, [contentRef]);
	useEffect(() => {
		document.title = TITLE
	}, [])
	return (
		<div className={styles.container}>
			<div className={styles.block1}></div>
			<div className={styles.block2}>
				<div className={styles.des}>
					<WebsiteName style={{ marginBottom: 16, fontSize: 30 }} />
					<p className={styles.subDescription}>
						个人网站，用于学习和生活方面。主要内容为一些便利日常生活的小程序、个人学习实践和一些学习作品等
					</p>
					<Navigate style={{ marginTop: 16 }} />
				</div>
			</div>
			<div className={styles.block3}>
				<Beian />
			</div>
			<div className={styles.content} ref={contentRef}>
				<Clock />
				<div className={styles.switchContainer} onClick={() => setFull(!full)}>
					<div className={styles.switchBox}>
						<span></span>
					</div>
				</div>
			</div>
		</div>
	);
};

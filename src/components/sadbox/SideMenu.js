import React, { useEffect, useState } from 'react'
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import './index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

const { Sider } = Layout
const { SubMenu } = Menu

const iconList = {
	'/home': <UserOutlined />,
	'/user-manage': <VideoCameraOutlined />,
	'/user-manage/list': <VideoCameraOutlined />,
	'/right-manage': <UploadOutlined />,
	'/right-manage/role/list': <UploadOutlined />,
	'/right-manage/right/list': <UploadOutlined />,
	'/news-manage': <UploadOutlined />,
	'/news-manage/add': <UploadOutlined />,
	'/news-manage/draft': <UploadOutlined />,
	'/news-manage/category': <UploadOutlined />,
	'/audit-manage': <UploadOutlined />,
	'/audit-manage/audit': <UploadOutlined />,
	'/audit-manage/list': <UploadOutlined />,
	'/publish-manage': <UploadOutlined />,
	'/publish-manage/unpublished': <UploadOutlined />,
	'/publish-manage/published': <UploadOutlined />,
	'/publish-manage/sunset': <UploadOutlined />,
}
function SideMenu(props) {
	const [menu, setMenu] = useState([])
	useEffect(() => {
		axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
			console.log(res.data)
			setMenu(res.data)
		})
	}, [])

	const checkPagePermission = (item) => {
		return item.pagepermisson === 1
	}
	const renderMenu = (menuList) => {
		return menuList.map((item) => {
			if (item.children?.length > 0 && checkPagePermission(item)) {
				return (
					<SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
						{renderMenu(item.children)}
					</SubMenu>
				)
			}
			return (
				checkPagePermission(item) && (
					<Menu.Item
						key={item.key}
						icon={iconList[item.key]}
						onClick={() => {
							props.history.push(item.key)
						}}>
						{item.title}
					</Menu.Item>
				)
			)
		})
	}

	const selectKeys = [props.location.pathname]
	const openKeys = ['/' + props.location.pathname.split('/')[1]]
	return (
		<Sider trigger={null} collapsible collapsed={false}>
			<div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
				<div className='logo'>全球新闻发布管理系统</div>
				<div style={{ flex: 1, overflow: 'auto' }}>
					<Menu
						theme='dark'
						mode='inline'
						selectedKeys={selectKeys}
						defaultOpenKeys={openKeys}>
						{renderMenu(menu)}
					</Menu>
				</div>
			</div>
		</Sider>
	)
}
export default withRouter(SideMenu)

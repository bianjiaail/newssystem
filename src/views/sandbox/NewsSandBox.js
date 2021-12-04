import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import SideMenu from './../../components/sadbox/SideMenu'
import TopHeader from './../../components/sadbox/TopHeader'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import Home from './home/Home'
import NoPermission from './nopermission/NoPermission'

// css
import './NewSandBox.css'

// antd
import { Layout } from 'antd'
const { Content } = Layout

export default function NewsSandBox() {
	return (
		<Layout>
			{/* 侧边栏 */}
			<SideMenu></SideMenu>
			<Layout className='site-layout'>
				{/* 顶部 */}
				<TopHeader></TopHeader>
				{/* 内容 */}
				<Content
					className='site-layout-background'
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
						overflow: 'auto',
					}}>
					{/* 从上到下进行路由匹配，匹配成功就不再往下匹配 */}
					<Switch>
						<Route path='/home' component={Home} />
						<Route path='/user-manage/list' component={UserList} />
						<Route path='/right-manage/role/list' component={RoleList} />
						<Route path='/right-manage/right/list' component={RightList} />

						<Redirect from='/' to='/home' exact />
						{/* 全都匹配不上则跳转到报错 */}
						<Route path='*' component={NoPermission} />
					</Switch>
				</Content>
			</Layout>
		</Layout>
	)
}

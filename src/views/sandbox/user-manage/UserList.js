import React, { useState, useEffect } from 'react'
import { Button, Table, Form, Modal, Input, Radio, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal
const [form] = Form.useForm()

export default function UserList() {
	const [dataSource, setdataSource] = useState([])
	const [isAddVisible, setisAddVisible] = useState(false)

	useEffect(() => {
		axios.get('http://localhost:5000/users?_expand=role').then((res) => {
			const list = res.data
			setdataSource(list)
		})
	}, [])
	const columns = [
		{
			title: '区域',
			dataIndex: 'region',
			render: (region) => {
				return <b>{region === '' ? '全球' : region}</b>
			},
		},
		{
			title: '角色名称',
			dataIndex: 'role',
			render: (role) => {
				return role?.roleName
			},
		},
		{
			title: '用户名',
			dataIndex: 'username',
		},
		{
			title: '用户状态',
			dataIndex: 'roleState',
			render: (roleState, item) => {
				return <Switch checked={roleState} disabled={item.default}></Switch>
			},
		},
		{
			title: '操作',

			render: (item) => {
				return (
					<div>
						<Button
							danger
							shape='circle'
							icon={<DeleteOutlined />}
							onClick={() => confirmMethod(item)}
							disabled={item.default}
						/>

						<Button
							type='primary'
							shape='circle'
							icon={<EditOutlined />}
							disabled={item.default}
						/>
					</div>
				)
			},
		},
	]

	const switchMethod = (item) => {
		item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
		console.log(item)
		setdataSource([...dataSource])
		if (item.grade === 1) {
			axios.patch(`http://localhost:5000/rights/${item.id}`, {
				pagepermisson: item.pagepermisson,
			})
		} else {
			axios.patch(`http://localhost:5000/children/${item.id}`, {
				pagepermisson: item.pagepermisson,
			})
		}
	}

	const confirmMethod = (item) => {
		confirm({
			title: '您确认要删除吗?',
			icon: <ExclamationCircleOutlined />,
			onOk() {
				console.log('OK')
				deleteMethod(item)
			},
			onCancel() {
				console.log('Cancel')
			},
		})
	}

	const deleteMethod = (item) => {
		if (item.grade === 1) {
			setdataSource(dataSource.filter((data) => data.id !== item.id))
			axios.delete(`http://localhost:5000/rights/${item.id}`)
		} else {
			let list = dataSource.filter((data) => data.id === item.rightId)
			list[0].children = list[0].children.filter((data) => data.id !== item.id)
			setdataSource([...dataSource])
			axios.delete(`http://localhost:5000/children/${item.id}`)
		}
	}
	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setisAddVisible(true)
				}}>
				添加用户
			</Button>
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item.id}
			/>
			<Modal
				visible={isAddVisible}
				title='添加一个新用户'
				okText='确定'
				cancelText='取消'
				onCancel={() => {
					setisAddVisible(false)
				}}
				onOk={() => {
					console.log('add')
				}}>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='title'
						label='Title'
						rules={[
							{
								required: true,
								message: 'Please input the title of collection!',
							},
						]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

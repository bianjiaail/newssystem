import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

export default function RoleList() {
	const [dataSource, setdataSource] = useState([])
	const [rightList, setRightList] = useState([])
	const [currentRights, setCurrentRights] = useState([])
	const [currentId, setCurrentId] = useState(0)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			render: (id) => {
				return <b>{id}</b>
			},
		},
		{
			title: '角色名称',
			dataIndex: 'roleName',
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
						/>

						<Button
							type='primary'
							shape='circle'
							icon={<EditOutlined />}
							onClick={() => {
								setIsModalVisible(true)
								setCurrentRights(item.rights)
								setCurrentId(item.id)
							}}
						/>
					</div>
				)
			},
		},
	]
	useEffect(() => {
		axios.get('http://localhost:5000/roles').then((res) => {
			setdataSource(res.data)
		})
	}, [])
	useEffect(() => {
		axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
			setRightList(res.data)
		})
	}, [])
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
		setdataSource(dataSource.filter((data) => data.id !== item.id))
		axios.delete(`http://localhost:5000/roles/${item.id}`)
	}

	const handleOk = () => {
		setIsModalVisible(false)
		// 同步 dataSource
		setdataSource(
			dataSource.map((item) => {
				if (item.id === currentId) {
					return {
						...item,
						rights: currentRights,
					}
				}
				return item
			})
		)
		// patch
		axios.patch(`http://localhost:5000/roles/${currentId}`, {
			rights: currentRights,
		})
	}
	const handleCancel = () => {
		setIsModalVisible(false)
	}

	const onCheck = (checkKeys) => {
		setCurrentRights(checkKeys)
	}
	return (
		<div>
			<Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
			<Modal
				title='权限分配'
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}>
				<Tree
					checkable
					checkedKeys={currentRights}
					onCheck={onCheck}
					checkStrictly={true}
					treeData={rightList}
				/>
			</Modal>
		</div>
	)
}

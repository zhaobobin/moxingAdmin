/**
 * 数据源列表
 */
import React from 'react';
import { Link } from 'dva/router'
import moment from 'moment'
import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

export default class Source extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      queryParams: {}
    }
  }

  refreshList = (values) => {
    this.setState({
      queryParams: values
    })
  };

  render(){

    const {queryParams} = this.state;

    const searchParams = [
      [
        {
          key: 'id',
          label: 'User ID',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入用户id',
          rules: [],
        },
        {
          key: 'create_time',
          label: '创建时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'user_type',
          label: '分类名称',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '会员',
              value: 1
            },
            {
              label: '店铺',
              value: 2
            }
          ]
        },
      ],
      [
        {
          key: 'user_status',
          label: '状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '禁用',
              value: 0
            },
            {
              label: '正常',
              value: 1
            },
            {
              label: '未验证',
              value: 2
            },
          ]
        },
        {
          key: 'btn',
          type: 'BtnGroup',
          btns: [
            {
              name: '查询',
              type: 'primary',
              htmlType: 'submit',
            },
            {
              name: '重置',
              type: 'default',
              htmlType: 'reset',
            },
          ]
        },
        {}
      ]
    ];

    const columns = [
      {
        title: '昵称',
        dataIndex: 'user_nickname',
        key: 'user_nickname',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
      },
      {
        title: '用户类型',
        dataIndex: 'user_type',
        key: 'user_type',
        align: 'center',
        render: (user_type) => (
          <span>{user_type === 1 ? '会员' : '店铺'}</span>
        )
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        align: 'center',
        render: (sex) => (
          <span>
            {sex === 0 ? '保密' : null}
            {sex === 1 ? '男' : null}
            {sex === 2 ? '女' : null}
          </span>
        )
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (create_time) => (
          <span>{moment(create_time * 1000).format('YYYY-MM-DD')}</span>
        )
      },
      {
        title: '最后登录时间',
        dataIndex: 'last_login_time',
        key: 'last_login_time',
        align: 'center',
        render: (last_login_time) => (
          <span>{last_login_time ? moment(last_login_time * 1000).format('YYYY-MM-DD') : '--'}</span>
        )
      },
      {
        title: '状态',
        dataIndex: 'user_status',
        key: 'user_status',
        align: 'center',
        render: (user_status) => (
          <span>
            {user_status === 0 ? '禁用' : null}
            {user_status === 1 ? '正常' : null}
            {user_status === 2 ? '未验证' : null}
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <Link to={`/member/detail/${item.id}`}>查看</Link>
          </span>
        )
      },
    ];

    return(
      <div>

        <FormInit layout="horizontal" params={searchParams} callback={this.refreshList}/>

        <TableInit
          params={{
            api: '/api/member/index',
            columns,
            queryParams
          }}
        />
      </div>
    )
  }
}

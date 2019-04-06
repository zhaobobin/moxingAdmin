import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class PrizeActivityList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {},                //查询参数
      pageTitle: '抽奖活动列表',
      apiList: '/api/prize/index',
      modalTitle: '抽奖活动',

      stateOptions: [],                   //状态下拉列表

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      queryParams: values,
    })
  };

  //创建
  add = () => {
    this.props.dispatch(routerRedux.push('/ticket/prize-activity-add'))
  };

  //编辑
  edit = (id) => {
    this.props.dispatch(routerRedux.push(`/ticket/prize-activity-edit/${id}`))
  };

  //奖项
  prize = (id) => {
    this.props.dispatch(routerRedux.push(`/ticket/prize-list/${id}`))
  };

  render(){

    const {currentUser} = this.props.global;
    const {apiList, queryParams, modalTitle, stateOptions} = this.state;

    const searchParams = [
      [
        {
          key: 'name',
          label: '抽奖名称',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入抽奖活动名称',
          rules: [],
        },
        {
          key: 'state',
          label: '抽奖状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {label: '关闭', value: '0'},
            {label: '开启', value: '1'},
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
      ],
    ];

    const columns = [
      {
        title: '抽奖名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '已抽奖人数',
        dataIndex: 'salenum',
        key: 'salenum',
        align: 'center',
      },
      {
        title: '活动状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (state) => (
          <span>{state === 1 ? '开启' : '关闭'}</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.prize(item.id)}>奖项</a>
            <span> | </span>
            <a onClick={() => this.edit(item.id)}>查看</a>
          </span>
        )
      },
    ];

    return(
      <div>

        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

        {
          currentUser.role === '超级管理员' ?
            <div style={{padding: '20px 0'}}>
              <Button type="primary" onClick={this.add}>添加{modalTitle}</Button>
            </div>
            :
            null
        }

        <TableInit
          onRef={ref => this.tableInit = ref}
          params={{
            api: apiList,
            columns,
            queryParams,
          }}
        />

      </div>
    )
  }
}

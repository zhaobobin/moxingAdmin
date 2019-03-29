import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class OrderList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {},                //查询参数
      pageTitle: '订单列表',
      apiList: '/api/order/index',
      apiAdd: '/api/order/order_add',
      apiEdit: '/api/order/order_edit',
      modalTitle: '订单',

      roleOptions: [],                   //角色下拉列表

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      queryParams: values,
    })
  };

  //详情
  detail = (id) => {
    this.props.dispatch(routerRedux.push(`/goods/order-detail/${id}`))
  };

  render(){

    const {currentUser} = this.props.global;
    const {apiList, queryParams, modalTitle} = this.state;

    const searchParams = [
      [
        {
          key: 'id',
          label: '订单号',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入订单号',
          rules: [],
        },
        {
          key: 'time',
          label: '订单时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'state',
          label: '展会状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '未开售',
              value: '0'
            },
            {
              label: '开售中',
              value: '1'
            },
            {
              label: '已结束',
              value: '2'
            },
            {
              label: '已下架',
              value: '3'
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
      ],
    ];

    const columns = [
      {
        title: '订单名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '订单时间',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (state) => (
          <span>
            {state === 0 ? '未开售' : null}
            {state === 2 ? '开售中' : null}
            {state === 3 ? '已结束' : null}
            {state === 3 ? '已下架' : null}
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
            <a onClick={() => this.detail(item.id)}>查看</a>
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

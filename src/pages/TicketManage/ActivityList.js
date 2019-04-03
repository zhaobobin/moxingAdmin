import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class ActivityList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {},                //查询参数
      pageTitle: '活动列表',
      apiList: '/api/activity/index',
      apiAdd: '/api/activity/activity_add',
      apiEdit: '/api/activity/activity_edit',
      modalTitle: '活动',

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
    this.props.dispatch(routerRedux.push('/ticket/activity-add'))
  };

  //编辑
  edit = (id) => {
    this.props.dispatch(routerRedux.push(`/ticket/activity-edit/${id}`))
  };

  render(){

    const {currentUser} = this.props.global;
    const {loading, apiList, queryParams, modalTitle, stateOptions} = this.state;

    const searchParams = [
      [
        {
          key: 'name',
          label: '活动名称',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入订单编号',
          rules: [],
        },
        {
          key: 'start_time',
          label: '开始时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'state',
          label: '活动状态',
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
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '已报名人数',
        dataIndex: 'salenum',
        key: 'salenum',
        align: 'center',
      },
      {
        title: '剩余报名人数',
        dataIndex: 'num',
        key: 'num',
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
        title: '报名金额',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '是否支持退款',
        dataIndex: 'is_out',
        key: 'is_out',
        align: 'center',
        render: (is_out) => (
          <span>{is_out === 1 ? '支持' : '不支持'}</span>
        )
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center',
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.edit(item.order_no)}>查看</a>
          </span>
        )
      },
    ];

    return(
      <div>

        {
          loading ?
            null
            :
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
        }

      </div>
    )
  }
}

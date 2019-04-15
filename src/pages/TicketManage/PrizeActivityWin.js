import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class PrizeActivityWin extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        prize_id: this.props.match.params.id,
      },                //查询参数
      pageTitle: '奖项列表',
      apiList: '/api/prize/prize_arr',
      apiAdd: '/api/prize/prize_arr_add',
      apiEdit: '/api/prize/prize_arr_edit',
      apiDel: '/api/prize/prize_arr_delete',

      stateOptions: [],                   //状态下拉列表

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      prize_id: this.queryParams.prize_id,
      queryParams: values,
    })
  };

  render(){

    const {currentUser} = this.props.global;
    const {apiList, queryParams} = this.state;

    const searchParams = [
      [
        {
          key: 'name',
          label: '奖项名称',
          type: 'Input',
          value: '',
          placeholder: '请输入奖项名称',
          rules: [],
        },
        {
          key: 'tel',
          label: '手机号码',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入手机号码',
          rules: [],
        },
        {
          key: 'no',
          label: '兑奖吗',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入兑奖吗',
          rules: [],
        },
      ],
      [
        {
          key: 'state',
          label: '奖项状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {label: '删除', value: '0'},
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
        {},
      ]
    ];

    const columns = [
      {
        title: '奖项名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '奖项数量',
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
          <span>{state === 1 ? '删除' : '关闭'}</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.edit(item)}>查看</a>
          </span>
        )
      },
    ];

    return(
      <div>

        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

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

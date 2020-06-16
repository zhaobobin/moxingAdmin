import React from 'react'
import {connect} from 'dva'
import moment from 'moment'
import {Link, routerRedux} from 'dva/router'
import {Button, Badge, Popconfirm, Modal} from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({global}) => ({
  global,
}))
export default class ActivityList extends React.Component {
  constructor(props) {
    super(props)
    this.ajaxFlag = true
    this.state = {
      queryParams: {}, //查询参数
      pageTitle: '商品列表',
      apiList: '/api/activity/index',
      apiDel: '/api/activity/activity_delete',
    }
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
    })
  }

  //创建活动
  add = () => {
    this.setState({
      modalVisible: true,
    })
  }

  del = (id, type) => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/activities_del',
      payload: {
        id,
        type,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        this.tableInit.refresh(this.state.queryParams);
      },
    });
  };

  render() {

    const {apiList, queryParams} = this.state

    const searchParams = [
      [
        {
          key: 'id',
          label: '活动ID',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'name',
          label: '活动名称',
          type: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'type',
          label: '活动类型',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {label: '全部', value: ''},
            {label: '常规', value: '1'},
            {label: '报名', value: '2'},
            {label: '抽奖', value: '3'},
          ],
        },
      ],
      [
        {
          key: 'state',
          label: '活动状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {label: '全部', value: ''},
            {label: '下架', value: '0'},
            {label: '上架', value: '1'}
          ],
        },
        {
          key: 'level',
          label: '活动级别',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {label: '全部', value: ''},
            {label: '一级活动', value: '1'},
            {label: '二级活动', value: '2'}
          ],
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
          ],
        },
      ],
    ];

    const columns = [
      {
        title: '活动ID',
        dataIndex: 'id',
        key: 'ID',
        align: 'center',
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '活动类型',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (type) => (
          <span>
            {type === '1' ? '常规' : null}
            {type === '2' ? '报名' : null}
            {type === '3' ? '抽奖' : null}
          </span>
        )
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center',
        render: start_time => (
          <span>{start_time ? moment(start_time).format('YYYY-MM-DD') : '--'}</span>
        ),
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        align: 'center',
        render: end_time => <span>{end_time ? moment(end_time).format('YYYY-MM-DD') : '--'}</span>,
      },
      {
        title: '活动级别',
        dataIndex: 'level',
        key: 'level',
        align: 'center',
        render: level => <span>{state === '1' ? '一级活动' : '二级活动'}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: state => (
          <span>
            <Badge status={state === '1' ? 'success' : 'error'} />
            {state === '1' ? '上架' : '下架'}
          </span>
        ),
      },

      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.edit(item.id)}>查看</a>
            <Popconfirm
              title={`是否要${item.state === '1' ? '下架' : '上架'}？`}
              onConfirm={() => this.del(item.id, item.state === '1' ? '2' : '1')}
            >
              <a>{item.state === '1' ? '下架' : '上架'}</a>
            </Popconfirm>
            <Popconfirm title="是否要删除？" onConfirm={() => this.del(item.id, '3')}>
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ]

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

        <TableInit
          onRef={ref => (this.tableInit = ref)}
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

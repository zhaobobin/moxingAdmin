import React from 'react'
import {connect} from 'dva'
import moment from 'moment'
import {Link, routerRedux} from 'dva/router'
import {Button, Popconfirm, Modal} from 'antd'

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
      pageTitle: '活动列表',
      apiList: '/api/activities/index',
      getActivity: '/api/activities/get_activity',
      modalTitle: '活动',

      stateOptions: [], //状态下拉列表

      modalVisible: false,

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

  edit = (item) => {
    let path = '';
    switch(item.type){
      case '1': path = 'edit-activity'; break;
      case '2': path = 'edit-game'; break;
      case '3': path = 'edit-lucky'; break;
      default: break;
    }
    this.props.dispatch(routerRedux.push(`/activity/${path}/${item.id}`))
  }

  //modal回调
  modalCallback = (values) => {
    if(values){
      if(!values.level || !values.type) return;
      let path = '',
        p_num = values.p_num || '';
      switch(values.type){
        case '1': path = 'create-activity'; break;
        case '2': path = 'create-game'; break;
        case '3': path = 'create-lucky'; break;
        default: break;
      }
      if(path) this.props.dispatch(routerRedux.push(`/activity/${path}/${values.level}_${values.type}_${p_num}`))
    }else{
      this.setState({
        modalVisible: false,
      })
    }
  };

  render() {
    const {currentUser} = this.props.global
    const {apiList, queryParams, modalTitle, modalVisible} = this.state

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
            {label: '常规活动', value: '1'},
            {label: '比赛活动', value: '2'},
            {label: '抽奖活动', value: '3'},
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

    const modalParams = [
      [
        {
          key: 'level',
          label: '请选择活动级别',
          type: 'Select',
          inputType: 'Select',
          value: '',
          placeholder: '请选择',
          rules: [
            { required: true, message: '请选择活动级别' },
          ],
          option: [
            {
              label: '一级活动',
              value: '1'
            },
            {
              label: '二级活动',
              value: '2'
            }
          ]
        },
        {
          key: 'type',
          label: '请选择活动类型',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          rules: [
            { required: true, message: '请选择活动类型' },
          ],
          option: [
            {
              label: '常规活动',
              value: '1'
            },
            {
              label: '比赛活动',
              value: '2'
            },
            {
              label: '抽奖活动',
              value: '3'
            }
          ]
        },
        {
          key: 'p_num',
          label: '请输入关联活动ID',
          type: 'Input',
          value: '',
          placeholder: '请输入',
          rules: []
        },
      ]
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
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (type) => (
          <span>
            {type === '1' ? '常规活动' : null}
            {type === '2' ? '比赛活动' : null}
            {type === '3' ? '抽奖活动' : null}
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
        title: '活动状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: state => <span>{state === '1' ? '上架' : '下架'}</span>,
      },
      {
        title: '活动级别',
        dataIndex: 'level',
        key: 'level',
        align: 'center',
        render: level => <span>{level === '1' ? '一级活动' : '二级活动'}</span>,
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
        ),
      },
    ]

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

        {currentUser.role === '超级管理员' ? (
          <div style={{padding: '20px 0'}}>
            <Button type="primary" onClick={this.add}>
              添加{modalTitle}
            </Button>
            <FormInit
              params={modalParams}
              callback={this.modalCallback}
              modal={{
                title: '请选择活动类型',
                visible: modalVisible
              }}
            />
          </div>
        ) : null}

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

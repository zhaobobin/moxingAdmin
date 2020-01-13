/**
 * 抽奖列表
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm, Modal, Table, Badge } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';
import AddSignFrom from './AddSignFrom';

@connect(({ global }) => ({
  global,
}))
export default class PrizeList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        type: '3',
      }, //查询参数
      pageTitle: '抽奖列表',
      apiList: '/api/activities/index',
      getActivity: '/api/activities/get_activity',
      modalTitle: '抽奖',

      stateOptions: [], //状态下拉列表

      activityLevel: '1', // 创建抽奖的等级
      currentActivityDetail: '', // 当前活动详情

      expandVisible: {},
      expandedRowRenders: null,
      expandedData: {},
    };
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: {
        type: '3',
        ...values,
      },
    });
  };

  addActivity = () => {
    this.props.dispatch(routerRedux.push('/activity/create-prize/1_3')); // level、type
    // this.setState({
    //   activityLevel: '1',
    //   addModalVisible: true,
    // });
  };

  edit = item => {
    this.props.dispatch(routerRedux.push(`/activity/edit-prize/${item.id}`));
  };

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
        this.tableInit.refresh({});
      },
    });
  };

  render() {
    const { currentUser } = this.props.global;
    const { activityLevel, apiList, queryParams, modalTitle } = this.state;

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
        {},
      ],
      [
        {
          key: 'state',
          label: '活动状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            { label: '全部', value: '' },
            { label: '下架', value: '0' },
            { label: '上架', value: '1' },
          ],
        },
        {
          key: 'level',
          label: '活动级别',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            { label: '全部', value: '' },
            { label: '一级活动', value: '1' },
            { label: '二级活动', value: '2' },
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

    // 添加活动
    const addModalParams = [
      [
        {
          key: 'level',
          label: '活动级别',
          type: 'Select',
          inputType: 'Select',
          value: activityLevel,
          placeholder: '请选择',
          disabled: true,
          rules: [{ required: true, message: '请选择活动级别' }],
          option: [
            {
              label: '一级活动',
              value: '1',
            },
            {
              label: '二级活动',
              value: '2',
            },
          ],
        },
        {
          key: 'type',
          label: '活动类型',
          type: 'Select',
          value: '1',
          placeholder: '请选择',
          rules: [{ required: true, message: '请选择活动类型' }],
          option: [
            {
              label: '常规活动',
              value: '1',
            },
            {
              label: '比赛活动',
              value: '2',
            },
            {
              label: '抽奖活动',
              value: '3',
            },
          ],
        },
      ],
    ];

    // 表格结构
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
        render: type => (
          <span>
            {type === '1' ? '常规活动' : null}
            {type === '2' ? '比赛活动' : null}
            {type === '3' ? '抽奖活动' : null}
          </span>
        ),
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
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        <div style={{ padding: '20px 0' }}>
          <Button type="primary" onClick={this.addActivity}>
            添加{modalTitle}
          </Button>
        </div>

        <TableInit
          onRef={ref => (this.tableInit = ref)}
          onExpand={this.onExpand}
          expandedRowRender={record =>
            this.state.expandVisible[record.id] === true
              ? this.state.expandedRowRenders[record.id]
              : true
          }
          params={{
            api: apiList,
            columns,
            queryParams,
          }}
        />

        {/*修改轮次*/}
        {/*<FormInit*/}
        {/*params={roundModalParams}*/}
        {/*callback={this.roundModalCallback}*/}
        {/*modal={{*/}
        {/*title: '修改轮次',*/}
        {/*visible: roundEditModalVisible,*/}
        {/*}}*/}
        {/*/>*/}
      </div>
    );
  }
}

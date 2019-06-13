/**
 * 活动统计
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Popconfirm } from 'antd';
import moment from 'moment';
import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class ActivityData extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        id: this.props.match.params.id,
      }, //查询参数
      apiList: '/api/activity/statistics',
    };
  }

  componentDidMount() {}

  //表单回调
  formCallback = values => {
    values.id = this.state.queryParams.id;
    this.setState({
      queryParams: values,
    });
  };

  //削票
  check = id => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/activity/operation',
      payload: {
        id,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.tableInit.refresh(this.state.queryParams);
        }
      },
    });
  };

  render() {
    const { apiList, queryParams } = this.state;

    const searchParams = [
      [
        {
          key: 'tel',
          label: '手机号',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入',
          rules: [],
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
        {},
      ],
    ];

    const columns = [
      {
        title: '活动id',
        dataIndex: 'activity_id',
        key: 'activity_id',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'u_name',
        key: 'u_name',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'u_tel',
        key: 'u_tel',
        align: 'center',
        render: u_tel => <span>{u_tel || '--'}</span>,
      },
      {
        title: '是否已验票',
        dataIndex: 'is_use',
        key: 'is_use',
        align: 'center',
        render: is_use => <span>{is_use === 1 ? '已验' : '未验'}</span>,
      },
      {
        title: '验票',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            {item.is_use === 1 ? (
              '--'
            ) : (
              <Popconfirm title="确定验票？" onConfirm={() => this.check(item.id)}>
                <a>验票</a>
              </Popconfirm>
            )}
          </span>
        ),
      },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        <TableInit
          onRef={ref => (this.tableInit = ref)}
          params={{
            api: apiList,
            columns,
            queryParams,
          }}
        />
      </div>
    );
  }
}

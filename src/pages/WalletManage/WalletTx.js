import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class WalletTx extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        id: parseInt(this.props.match.params.id),
      }, //查询参数
      pageTitle: '提现列表',
      apiList: '/api/wallet/user_cash',
      modalTitle: '提现',

      roleOptions: [], //角色下拉列表
    };
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
    });
  };

  detail = id => {
    this.props.dispatch(routerRedux.push(`/wallet-tx/detail/${id}`));
  };

  render() {
    const { apiList, queryParams } = this.state;

    const searchParams = [
      [
        {
          key: 'alipay',
          label: '用户账号',
          type: 'Input',
          value: '',
          placeholder: '请输入用户手机账号',
          rules: [],
        },
        {
          key: 'uid',
          label: 'User ID',
          type: 'Input',
          value: '',
          placeholder: '请输入用户ID',
          rules: [],
        },
        {
          key: 'name',
          label: '用户昵称',
          type: 'Input',
          value: '',
          placeholder: '请输入用户昵称',
          rules: [],
        },
      ],
      [
        {
          key: 'account_type',
          label: '提现状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '全部',
              value: 0,
            },
            {
              label: '大款中',
              value: 1,
            },
            {
              label: '已完成',
              value: 2,
            },
          ],
        },
        {},
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
        title: '申请时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '提现金额',
        dataIndex: 'change_account',
        key: 'change_account',
        align: 'center',
      },
      {
        title: '申请订单',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '提现渠道',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: type => <span>{type === '1' ? '支付宝' : '微信'}</span>,
      },
      {
        title: '渠道订单号',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'finished_time',
        key: 'finished_time',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'account_type',
        key: 'account_type',
        align: 'center',
        render: account_type => <span>{account_type === '1' ? '提现中' : '提现完成'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.id)}>查看</a>
          </div>
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

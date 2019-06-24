import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class WalletList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      pageTitle: '钱包列表',
      apiList: '/api/wallet/user_wallet',
      modalTitle: '钱包',

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
    this.props.dispatch(routerRedux.push(`/wallet/detail/${id}`));
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
        {},
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
        title: '用户账号',
        dataIndex: 'alipay',
        key: 'alipay',
        align: 'center',
      },
      {
        title: 'User ID',
        dataIndex: 'uid',
        key: 'uid',
        align: 'center',
      },
      {
        title: '用户昵称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },

      {
        title: '可用余额',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '冻结金额',
        dataIndex: 'freeze_account',
        key: 'freeze_account',
        align: 'center',
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

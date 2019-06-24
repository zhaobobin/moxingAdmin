import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm } from 'antd';

import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class WalletTxDetail extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {};
  }

  render() {
    return <div>用户提现详情</div>;
  }
}

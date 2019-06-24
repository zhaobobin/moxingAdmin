import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Card, Table, Tabs, Spin, Modal } from 'antd';
import styles from './WalletDetail.less';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

const { TabPane } = Tabs;

@connect(({ global }) => ({
  global,
}))
export default class WalletDetail extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      apiList: '/api/wallet/wallet_detailed',
      detail: '',
      queryParams: {
        uid: parseInt(this.props.match.params.id),
        type: '1',
      },
    };
  }

  // componentDidMount(){
  //   this.queryDetail(this.props.match.params.uid);
  // }
  //
  // componentWillReceiveProps(nextProps){
  //   if(nextProps.match.params.uid !== this.props.match.params.uid) {
  //     this.queryDetail(nextProps.match.params.uid);
  //   }
  // }

  //查询详情
  queryDetail(uid) {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { type } = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/wallet/wallet_detailed',
      payload: {
        uid,
        type,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.setState({
            loading: false,
            detail: res.data,
          });
        }
      },
    });
  }

  //表单回调
  formCallback = values => {};

  changeTab = key => {
    let { queryParams } = this.state;
    queryParams.type = key;
    console.log(queryParams);
    this.setState({
      queryParams,
    });
  };

  detail = no => {};

  render() {
    const { detail, apiList, queryParams } = this.state;

    const searchParams = [
      [
        {
          key: 'alipay',
          label: '用户账号',
          type: 'Input',
          value: detail.alipay || '',
          placeholder: '',
          disabled: true,
          rules: [],
        },
        {
          key: 'uid',
          label: 'User ID',
          type: 'Input',
          value: detail.uid || '',
          placeholder: '',
          disabled: true,
          rules: [],
        },
        {
          key: 'name',
          label: '用户昵称',
          type: 'Input',
          value: detail.name || '',
          placeholder: '',
          disabled: true,
          rules: [],
        },
      ],
      [
        {
          key: 'account',
          label: '可用余额',
          type: 'Input',
          value: detail.account || '',
          placeholder: '',
          disabled: true,
          rules: [],
        },
        {
          key: 'freeze_account',
          label: '冻结金额',
          type: 'Input',
          value: detail.freeze_account || '',
          placeholder: '',
          disabled: true,
          rules: [],
        },
        {},
      ],
    ];

    // 收款记录
    const columns1 = [
      {
        title: '收款订单',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '出售商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        align: 'center',
      },
      {
        title: '付款用户',
        dataIndex: 'buy_user',
        key: 'buy_user',
        align: 'center',
      },
      {
        title: '支付渠道',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center',
        render: pay_type => <span>{pay_type === '1' ? '支付宝' : '微信'}</span>,
      },
      {
        title: '渠道订单号',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '订单金额',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '支付时间',
        dataIndex: 'payment_time',
        key: 'payment_time',
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'finished_time',
        key: 'finished_time',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.no)}>查看</a>
          </div>
        ),
      },
    ];

    // 退款记录
    const columns2 = [
      {
        title: '收款订单',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '出售商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        align: 'center',
      },
      {
        title: '付款用户',
        dataIndex: 'buy_user',
        key: 'buy_user',
        align: 'center',
      },
      {
        title: '订单金额',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '申请时间',
        dataIndex: 'refund_apply_time',
        key: 'refund_apply_time',
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'finished_time',
        key: 'finished_time',
        align: 'center',
      },
      {
        title: '退款方式',
        dataIndex: 'refund_type',
        key: 'refund_type',
        align: 'center',
        render: refund_type => <span>{refund_type === '1' ? '卖家退款' : '强制退款'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.no)}>查看</a>
          </div>
        ),
      },
    ];

    // 提现记录
    const columns3 = [
      {
        title: '申请时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '订单金额',
        dataIndex: 'account',
        key: 'account',
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
        dataIndex: 'carry_type',
        key: 'carry_type',
        align: 'center',
        render: carry_type => <span>{carry_type === '1' ? '支付宝' : '微信'}</span>,
      },
      {
        title: '渠道订单号',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '付款用户',
        dataIndex: 'buy_user',
        key: 'buy_user',
        align: 'center',
      },

      {
        title: '完成时间',
        dataIndex: 'finished_time',
        key: 'finished_time',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.no)}>查看</a>
          </div>
        ),
      },
    ];

    // 退款记录
    const columns4 = [
      {
        title: '商品订单',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        align: 'center',
      },
      {
        title: '收款用户',
        dataIndex: 'buy_user',
        key: 'buy_user',
        align: 'center',
      },
      {
        title: '支付渠道',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center',
        render: pay_type => <span>{pay_type === '1' ? '支付宝' : '微信'}</span>,
      },
      {
        title: '渠道订单号',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '订单金额',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
      },
      {
        title: '支付时间',
        dataIndex: 'payment_time',
        key: 'payment_time',
        align: 'center',
      },
      {
        title: '完成时间',
        dataIndex: 'finished_time',
        key: 'finished_time',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.no)}>查看</a>
          </div>
        ),
      },
    ];

    return (
      <div className={styles.walletDetail}>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        <div className={styles.table}>
          <Tabs type="card" onChange={this.changeTab}>
            <TabPane tab="收款记录" key="1">
              <TableInit
                onRef={ref => (this.tableInit = ref)}
                params={{
                  api: apiList,
                  columns1,
                  queryParams,
                }}
              />
            </TabPane>

            <TabPane tab="退款记录" key="2">
              <TableInit
                onRef={ref => (this.tableInit = ref)}
                params={{
                  api: apiList,
                  columns2,
                  queryParams,
                }}
              />
            </TabPane>

            <TabPane tab="提现记录" key="3">
              <TableInit
                onRef={ref => (this.tableInit = ref)}
                params={{
                  api: apiList,
                  columns3,
                  queryParams,
                }}
              />
            </TabPane>

            <TabPane tab="消费记录" key="4">
              <TableInit
                onRef={ref => (this.tableInit = ref)}
                params={{
                  api: apiList,
                  columns4,
                  queryParams,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

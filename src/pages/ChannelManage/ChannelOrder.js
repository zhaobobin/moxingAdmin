/**
 * 渠道 - 订单
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Button, Icon, Statistic, Popconfirm } from 'antd';
import moment from 'moment';
import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class ChannelOrder extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      apiList: '/api/chanel/chanel_order',
      apiAdd: '/api/user/user_add',
      apiEdit: '/api/user/user_edit',
      apiDel: '/api/user/user_del',

      modalVisible: false,
      modalAction: '',
      modalTitle: '管理员',
      modalValues: '',

      roleOptions: [], //角色下拉列表

      total: '', // 累计用户
      amount: '', // 订单总金额
      user: '', // 下单用户数量
    };
  }

  componentDidMount() {}

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
      modalVisible: false,
    });
  };

  tableCallback = values => {
    this.setState({
      total: values.total,
      amount: values.amount,
      user: values.user,
    });
  };

  //添加
  add = () => {
    this.setState({
      modalVisible: true,
      modalAction: '添加',
    });
  };

  //编辑
  edit = item => {
    this.setState({
      modalVisible: true,
      modalAction: '编辑',
      modalValues: item,
    });
  };

  //保存
  save = values => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { apiAdd, apiEdit, modalAction } = this.state;
    let api = modalAction === '添加' ? apiAdd : apiEdit;
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: {
        ...values,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.tableInit.refresh({});
          this.setState({
            modalVisible: false,
            modalValues: '',
          });
        }
      },
    });
  };

  del = id => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { apiDel } = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: apiDel,
      payload: {
        id,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.tableInit.refresh({});
        }
      },
    });
  };

  //modal回调
  modalCallback = values => {
    if (values) {
      this.save(values);
    } else {
      this.setState({
        modalVisible: false,
        modalValues: '',
      });
    }
  };

  render() {
    const { apiList, queryParams, modalValues, roleOptions, total, amount, user } = this.state;
    console.log(queryParams);
    const searchParams = [
      [
        {
          key: 'id',
          label: '渠道id',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'name',
          label: '用户名称',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'order_no',
          label: '订单号',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
      ],
      [
        {
          key: 'order_type',
          label: '订单类型',
          type: 'Select',
          value: '',
          placeholder: '请输入',
          rules: [],
          option: [{ label: '商品', value: '0' }, { label: '门票', value: '1' }],
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
          key: 'end_time',
          label: '结束时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
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

    const modalParams = [
      [
        {
          key: 'user_name',
          label: '用户名',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.user_name : undefined,
          placeholder: '请输入用户名',
          rules: [],
        },
        {
          key: 'real_name',
          label: '真实名称',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.real_name : undefined,
          placeholder: '请输入用户名',
          rules: [],
        },
        {
          key: 'password',
          label: '密码',
          type: 'Input',
          inputType: 'password',
          value: '',
          placeholder: '请输入密码',
          rules: [],
        },
        {
          key: 'role_id',
          label: '角色',
          type: 'Select',
          value: modalValues ? modalValues.role_id : undefined,
          placeholder: '请选择',
          option: roleOptions,
        },
      ],
    ];

    const columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center',
      },
      {
        title: '渠道号',
        dataIndex: 'chanel_code',
        key: 'chanel_code',
        align: 'center',
      },
      {
        title: '渠道名称',
        dataIndex: 'chanel_name',
        key: 'chanel_name',
        align: 'center',
      },
      {
        title: '订单号',
        dataIndex: 'order_no',
        key: 'order_no',
        align: 'center',
        width: 140,
      },
      {
        title: '订单金额',
        dataIndex: 'order_amount',
        key: 'order_amount',
        align: 'center',
      },
      {
        title: '支付方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center',
        render: pay_type => (
          <span>
            {pay_type === 1 ? '支付宝' : null}
            {pay_type === 2 ? '微信' : null}
          </span>
        ),
      },
      {
        title: '付款时间',
        dataIndex: 'payment_time',
        key: 'payment_time',
        align: 'center',
        render: payment_time => <span>{moment(payment_time).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '订单状态',
        dataIndex: 'order_state',
        key: 'order_state',
        align: 'center',
        render: order_state => (
          <span>
            {order_state === 2 ? '已付款-待发货' : null}
            {order_state === 4 ? '已发货' : null}
            {order_state === 5 ? '提醒发货' : null}
            {order_state === 6 ? '已收货' : null}
          </span>
        ),
      },
      // {
      //   title: '操作',
      //   dataIndex: 'action',
      //   key: 'action',
      //   align: 'center',
      //   render: (text, item) => (
      //     <div>
      //       {
      //         currentUser.role === '超级管理员' ?
      //           <span>
      //             <a onClick={() => this.edit(item)}>编辑</a>
      //             {
      //               item.user_name === 'admin' ?
      //                 null
      //                 :
      //                 <span> | </span>
      //             }
      //             {
      //               item.user_name === 'admin' ?
      //                 null
      //                 :
      //                 <Popconfirm title="确定删除该用户？" onConfirm={() => this.del(item.id)}>
      //                   <a>删除</a>
      //                 </Popconfirm>
      //             }
      //           </span>
      //           :
      //           '--'
      //       }
      //     </div>
      //   )
      // },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        {/*{*/}
        {/*currentUser.role === '超级管理员' ?*/}
        {/*<div style={{padding: '20px 0'}}>*/}
        {/*<Button type="primary" onClick={this.add}>添加{modalTitle}</Button>*/}
        {/*<FormInit*/}
        {/*params={modalParams}*/}
        {/*callback={this.modalCallback}*/}
        {/*modal={{*/}
        {/*title: modalAction + modalTitle,*/}
        {/*visible: modalVisible*/}
        {/*}}*/}
        {/*/>*/}
        {/*</div>*/}
        {/*:*/}
        {/*null*/}
        {/*}*/}

        <Row gutter={20}>
          <Col span={6}>
            <Card>
              <Statistic title="订单数量" value={total} prefix={<Icon type="wallet" />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="订单总金额" value={amount || 0} prefix={<Icon type="wallet" />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="下单用户数量" value={user || 0} prefix={<Icon type="wallet" />} />
            </Card>
          </Col>
        </Row>

        <TableInit
          onRef={ref => (this.tableInit = ref)}
          params={{
            api: apiList,
            columns,
            queryParams,
          }}
          callback={this.tableCallback}
        />
      </div>
    );
  }
}

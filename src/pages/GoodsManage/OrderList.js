import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class OrderList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {},                //查询参数
      pageTitle: '订单列表',
      apiList: '/api/order/order',
      apiAdd: '/api/order/order_add',
      apiEdit: '/api/order/order_edit',
      modalTitle: '订单',

      stateOptions: [],                   //状态下拉列表

    }
  }

  componentDidMount(){
    this.queryStateList();
  }

  queryStateList(){
    this.props.dispatch({
      type: 'global/post',
      url: '/api/order/order_state',
      payload: {},
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          let arr = [];
          for(let i in res.data){
            let item = {
              label: res.data[i].name,
              value: res.data[i].state
            }
            arr.push(item)
          }
          this.setState({
            loading: false,
            stateOptions: arr
          })
        }
      }
    });
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      queryParams: values,
    })
  };

  //详情
  detail = (id) => {
    this.props.dispatch(routerRedux.push(`/goods/order-detail/${id}`))
  };

  render(){

    const {currentUser} = this.props.global;
    const {loading, apiList, queryParams, modalTitle, stateOptions} = this.state;

    const searchParams = [
      [
        {
          key: 'order_no',
          label: '订单编号',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入订单编号',
          rules: [],
        },
        {
          key: 'order_time',
          label: '订单时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'order_state',
          label: '订单状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: stateOptions
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
      ],
    ];

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'order_no',
        key: 'order_no',
        align: 'center',
      },
      {
        title: '收件人',
        dataIndex: 'realname',
        key: 'realname',
        align: 'center',
      },
      {
        title: '联系方式',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
      },
      {
        title: '收货地址',
        dataIndex: 'detail',
        key: 'detail',
        align: 'center',
      },
      {
        title: '所有商品价格',
        dataIndex: 'goods_amount',
        key: 'goods_amount',
        align: 'center',
      },
      {
        title: '实际付款价格',
        dataIndex: 'order_amount',
        key: 'order_amount',
        align: 'center',
      },
      {
        title: '支付方式',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center',
        render: (pay_type) => (
          <span>
            {pay_type === 1 ? '支付宝' : null}
            {pay_type === 2 ? '微信' : null}
          </span>
        )
      },
      {
        title: '状态',
        dataIndex: 'order_state',
        key: 'order_state',
        align: 'center',
        render: (order_state) => (
          <span>
            {order_state === 0 ? '已取消' : null}
            {order_state === 1 ? '待付款' : null}
            {order_state === 2 ? '待发货' : null}
            {order_state === 3 ? '支付失败' : null}
            {order_state === 4 ? '已发货' : null}
            {order_state === 5 ? '发货前退款' : null}
            {order_state === 6 ? '已收货' : null}
            {order_state === 7 ? '发货后退款' : null}
            {order_state === 8 ? '已退货' : null}
            {order_state === 9 ? '商家接入' : null}
          </span>
        )
      },
      {
        title: '生成时间',
        dataIndex: 'order_time',
        key: 'order_time',
        align: 'center',
      },
      // {
      //   title: '付款时间',
      //   dataIndex: 'payment_time',
      //   key: 'payment_time',
      //   align: 'center',
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.detail(item.order_no)}>查看</a>
          </span>
        )
      },
    ];

    return(
      <div>

        {
          loading ?
            null
            :
            <div>

              <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

              {
                currentUser.role === '超级管理员' ?
                  <div style={{padding: '20px 0'}}>
                    <Button type="primary" onClick={this.add}>添加{modalTitle}</Button>
                  </div>
                  :
                  null
              }

              <TableInit
                onRef={ref => this.tableInit = ref}
                params={{
                  api: apiList,
                  columns,
                  queryParams,
                }}
              />

            </div>
        }

      </div>
    )
  }
}

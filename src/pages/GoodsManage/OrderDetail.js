import React from 'react';
import { connect } from 'dva';
import styles from './OrderDetail.less'
import { Table } from 'antd'

import TableShowTotal from '@/components/Table/TableShowTotal'
import Loading from '@/components/Common/Loading'
import GoodsForm from './GoodsForm'

@connect(({ global }) => ({
  global,
}))
export default class OrderDetail extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      detail: ''
    }
  }

  componentDidMount(){
    let id = this.props.match.params.id;
    this.queryDetail(id);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id){
      let id = nextProps.match.params.id;
      this.queryDetail(id);
    }
  }

  queryDetail(id){
    this.props.dispatch({
      type: 'global/post',
      url: '/api/order/order_details',
      payload: {
        order_no: id,
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.setState({
            loading: false,
            detail: res.data
          })
        }
      }
    });
  }

  //延长收货
  extend = () => {

  };

  //退款
  refund = () => {

  };

  render(){

    const { loading, detail } = this.state;

    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
        align: 'center',
      },
      {
        title: '缩略图',
        dataIndex: 'img',
        key: 'img',
        align: 'center',
        render: (img) => (
          <span>
            <img src={img} alt="thumb" width="60px" height="60px"/>
          </span>
        )
      },
      {
        title: '用户类型',
        dataIndex: 'is_shops',
        key: 'is_shops',
        align: 'center',
        render: (is_shops) => (
          <span>
            {is_shops === '1' ? '商铺' : '个人'}
          </span>
        )
      },
      {
        title: '原价',
        dataIndex: 'marketprice',
        key: 'marketprice',
        align: 'center',
      },
      {
        title: '售价',
        dataIndex: 'order_amount',
        key: 'order_amount',
        align: 'center',
      },
      {
        title: '邮费',
        dataIndex: 'freight',
        key: 'freight',
        align: 'center',
      },
      {
        title: '全新商品',
        dataIndex: 'is_new',
        key: 'is_new',
        align: 'center',
        render: (is_new) => (
          <span>
            {is_new === '1' ? '是' : '否'}
          </span>
        )
      },
      {
        title: '是否讲价',
        dataIndex: 'is_ykj',
        key: 'is_ykj',
        align: 'center',
        render: (is_ykj) => (
          <span>
            {is_ykj === '1' ? '是' : '否'}
          </span>
        )
      },
      {
        title: '购买数量',
        dataIndex: 'goods_num',
        key: 'goods_num',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.extend(item.order_no)}>延长收货</a>
            <span> | </span>
            <a onClick={() => this.refund(item.order_no)}>退款</a>
          </span>
        )
      },
    ];

    return(
      <div>
        {
          loading && !detail ?
            <Loading/>
            :
            <div className={styles.detail}>

              <div className={styles.info}>
                <ul>
                  <li>
                    <label>订单号：</label>
                    <span>{detail.order_no}</span>
                  </li>
                  <li>
                    <label>订单状态：</label>
                    <span>
                      {detail.order_state === '0' ? '已取消' : null}
                      {detail.order_state === '1' ? '待付款' : null}
                      {detail.order_state === '2' ? '待发货' : null}
                      {detail.order_state === '3' ? '支付失败' : null}
                      {detail.order_state === '4' ? '已发货' : null}
                      {detail.order_state === '5' ? '发货前退款' : null}
                      {detail.order_state === '6' ? '已收货' : null}
                      {detail.order_state === '7' ? '发货后退款' : null}
                      {detail.order_state === '8' ? '已退货' : null}
                      {detail.order_state === '9' ? '商家接入' : null}
                    </span>
                  </li>

                  <li>
                    <label>付款方式：</label>
                    <span>
                      {detail.pay_type === '1' ? '支付宝' : null}
                      {detail.pay_type === '2' ? '微信' : null}
                    </span>
                  </li>
                  <li>
                    <label>购买时间：</label>
                    <span>{detail.create_time}</span>
                  </li>
                  <li>
                    <label>支付时间：</label>
                    <span>{detail.payment_time}</span>
                  </li>
                  <li>
                    <label>收货时间：</label>
                    <span>{detail.finished_time}</span>
                  </li>
                  <li>
                    <label>支付凭证：</label>
                    <span></span>
                  </li>
                  <li>
                    <label>商品总价：</label>
                    <span>{detail.goods_amount}</span>
                  </li>
                  <li>
                    <label>实付款金额：</label>
                    <span>{detail.order_price}</span>
                  </li>

                </ul>

                <ul>
                  <li>
                    <label>快递单号：</label>
                    <span>{detail.shipping_code}</span>
                  </li>
                  <li>
                    <label>快递公司：</label>
                    <span>{detail.shipping_type}</span>
                  </li>
                  <li>
                    <label>运费：</label>
                    <span>{detail.shipping_fee}</span>
                  </li>

                  <li>
                    <label>收货人名称：</label>
                    <span>{detail.name}</span>
                  </li>
                  <li>
                    <label>收货人电话：</label>
                    <span>{detail.address.mobile}</span>
                  </li>
                  <li>
                    <label>收货人地址：</label>
                    <span>{detail.address.province}-{detail.address.city}-{detail.address.area} {detail.address.detail}</span>
                  </li>
                </ul>

              </div>

              <div className={styles.table}>
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={detail.order}
                  pagination={{
                    total: detail.order_num,
                    hideOnSinglePage: false,
                    showSizeChanger: true,
                    showTotalText: true,
                  }}
                />
              </div>

            </div>
        }
      </div>
    )
  }
}

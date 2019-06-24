import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class GoodsList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      pageTitle: '商品列表',
      apiList: '/api/goods/index',
      apiAdd: '/api/goods/goods_add',
      apiEdit: '/api/goods/goods_edit', //下架操作
      modalTitle: '商品',

      roleOptions: [], //角色下拉列表
    };
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
    });
  };

  //添加商品
  add = () => {
    this.props.dispatch(routerRedux.push(`/goods/add`));
  };

  //编辑商品
  detail = id => {
    this.props.dispatch(routerRedux.push(`/goods/edit/${id}`));
  };

  //down
  down = id => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { apiEdit } = this.state;
    this.props.dispatch({
      type: 'global/post',
      url: apiEdit,
      payload: {
        id,
      },
      callback: res => {
        if (res.code === '0') {
          this.tableInit.refresh({});
          this.setState({
            modalVisible: false,
            modalValues: '',
          });
        }
      },
    });

    setTimeout(() => {
      this.ajaxFlag = true;
    }, 500);
  };

  render() {
    const { currentUser } = this.props.global;
    const { apiList, queryParams, modalTitle } = this.state;

    const searchParams = [
      [
        {
          key: 'name',
          label: '商品名称',
          type: 'Input',
          value: '',
          placeholder: '请输入商品名称',
          rules: [],
        },
        {
          key: 'user_name',
          label: '商家名称',
          type: 'Input',
          value: '',
          placeholder: '请输入商家名称',
          rules: [],
        },
        {
          key: 'time',
          label: '销售时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
      ],
      [
        {
          key: 'state',
          label: '状态',
          type: 'Select',
          value: '',
          placeholder: '请选择商品状态',
          rules: [],
          option: [
            { label: '下架', value: '0' },
            { label: '正常', value: '1' },
            { label: '违规', value: '10' },
          ],
        },
        {
          key: 'is_shops',
          label: '商户类型',
          type: 'Select',
          value: '',
          placeholder: '请选择商户类型',
          rules: [],
          option: [
            { label: '全部', value: '' },
            { label: '店铺', value: '1' },
            { label: '个人', value: '0' },
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

    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '缩略图',
        dataIndex: 'image',
        key: 'image',
        align: 'center',
        render: image => (
          <span>
            <img src={image} alt="thumb" width="60px" height="60px" />
          </span>
        ),
      },
      {
        title: '商户类型',
        dataIndex: 'is_shops',
        key: 'is_shops',
        align: 'center',
        render: is_shops => <span>{is_shops === 1 ? '店铺' : '个人'}</span>,
      },

      {
        title: '原价',
        dataIndex: 'marketprice',
        key: 'marketprice',
        align: 'center',
      },
      {
        title: '售价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '邮费',
        dataIndex: 'freight',
        key: 'freight',
        align: 'center',
      },
      {
        title: '是否全新',
        dataIndex: 'is_new',
        key: 'is_new',
        align: 'center',
        render: is_new => <span>{is_new === 1 ? '是' : '否'}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: state => (
          <span>
            {state === 0 ? '下架' : null}
            {state === 1 ? '正常' : null}
            {state === 10 ? '违规' : null}
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.id)}>查看</a>
            {item.state === 1 ? (
              <Popconfirm title="确定下架该商品？" onConfirm={() => this.down(item.id)}>
                <span> | </span>
                <a>下架</a>
              </Popconfirm>
            ) : null}
          </div>
        ),
      },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        {/*{*/}
        {/*currentUser.role === '超级管理员' ?*/}
        {/*<div style={{padding: '20px 0'}}>*/}
        {/*<Button type="primary" onClick={this.add}>添加{modalTitle}</Button>*/}
        {/*</div>*/}
        {/*:*/}
        {/*null*/}
        {/*}*/}

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

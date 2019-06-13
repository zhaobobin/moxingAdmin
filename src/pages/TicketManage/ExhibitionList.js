import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class ExhibitionList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      pageTitle: '展会列表',
      apiList: '/api/exhibition/index',
      apiAdd: '/api/exhibition/exhibition_add',
      apiEdit: '/api/exhibition/exhibition_edit',
      apiDel: '/api/exhibition/exhibition_delete',
      modalTitle: '展会',

      roleOptions: [], //角色下拉列表
    };
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
    });
  };

  //添加
  add = () => {
    this.props.dispatch(routerRedux.push('/ticket/exhibition-add'));
  };

  //编辑
  edit = id => {
    this.props.dispatch(routerRedux.push(`/ticket/exhibition-edit/${id}`));
  };

  //删除
  del = id => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let { apiDel } = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: apiDel,
      payload: {
        id: id,
      },
      callback: res => {
        if (res.code === '0') {
          this.tableInit.refresh({});
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
          label: '展会名称',
          type: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'time',
          label: '展会时间',
          type: 'RangePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'state',
          label: '展会状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '未开售',
              value: '0',
            },
            {
              label: '开售中',
              value: '1',
            },
            {
              label: '已结束',
              value: '2',
            },
            {
              label: '已下架',
              value: '3',
            },
          ],
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
        title: '展会名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '展会开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center',
      },
      {
        title: '展会结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        align: 'center',
      },
      {
        title: '门票总数',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: num => <span>{num || 0}</span>,
      },
      {
        title: '已售数量',
        dataIndex: 'salenum',
        key: 'salenum',
        align: 'center',
        render: salenum => <span>{salenum || 0}</span>,
      },
      {
        title: '可售数量',
        dataIndex: 'storage',
        key: 'storage',
        align: 'center',
        render: storage => <span>{storage || 0}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: state => (
          <span>
            {state === 1 ? '未开始' : null}
            {state === 2 ? '已开始' : null}
            {state === 3 ? '已结束' : null}
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
            <a onClick={() => this.edit(item.id)}>编辑</a>
            <span> | </span>
            <Link to={`/ticket/list/${item.id}`}>统计</Link>
            {currentUser.role === '超级管理员' ? (
              <Popconfirm title="确定删除该展会？" onConfirm={() => this.del(item.id)}>
                <span> | </span>
                <a>删除</a>
              </Popconfirm>
            ) : null}
          </div>
        ),
      },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        {currentUser.role === '超级管理员' ? (
          <div style={{ padding: '20px 0' }}>
            <Button type="primary" onClick={this.add}>
              添加{modalTitle}
            </Button>
          </div>
        ) : null}

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

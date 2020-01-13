/**
 * 渠道列表
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
export default class ChannelList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      apiList: '/api/chanel/index',
      apiAdd: '/api/chanel/add_chanel',
      apiEdit: '/api/chanel/edit_chanel',
      apiDel: '//api/chanel/del_chanel',

      modalVisible: false,
      modalAction: '',
      modalTitle: '渠道',
      modalValues: '',

      roleOptions: [], //角色下拉列表

      total: '', // 累计用户
      usernew: '', // 新增用户
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
      usernew: values.usernew,
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
    const { currentUser } = this.props.global;
    const {
      apiList,
      queryParams,
      modalVisible,
      modalAction,
      modalTitle,
      modalValues,
      roleOptions,
    } = this.state;

    const modalParams = [
      [
        {
          key: 'chanel_code',
          label: '渠道号',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.chanel_code : undefined,
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'chanel_name',
          label: '渠道名称',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.chanel_name : undefined,
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'name',
          label: '渠道联系人',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.name : undefined,
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'tel',
          label: '联系人电话',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.tel : undefined,
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'desc',
          label: '渠道简介',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.desc : undefined,
          placeholder: '请输入',
          rules: [],
        },
      ],
    ];

    const columns = [
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
        title: '渠道联系人',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '联系人电话',
        dataIndex: 'tel',
        key: 'tel',
        align: 'center',
      },
      {
        title: '渠道添加时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: create_time => <span>{moment(create_time).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '最后编辑时间',
        dataIndex: 'update_time',
        key: 'update_time',
        align: 'center',
        render: update_time => <span>{moment(update_time).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            {currentUser.role === '超级管理员' ? (
              <span>
                <a onClick={() => this.edit(item)}>编辑</a>
              </span>
            ) : (
              '--'
            )}
          </div>
        ),
      },
    ];

    return (
      <div>
        {currentUser.role === '超级管理员' ? (
          <div style={{ padding: '20px 0' }}>
            <Button type="primary" onClick={this.add}>
              添加{modalTitle}
            </Button>
            <FormInit
              params={modalParams}
              callback={this.modalCallback}
              modal={{
                title: modalAction + modalTitle,
                visible: modalVisible,
              }}
            />
          </div>
        ) : null}

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

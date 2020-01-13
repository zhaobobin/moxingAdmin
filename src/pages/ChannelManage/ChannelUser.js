/**
 * 渠道 - 用户
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
export default class ChannelUser extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      apiList: '/api/chanel/chanel_register',
      apiAdd: '/api/user/user_add',
      apiEdit: '/api/user/user_edit',
      apiDel: '/api/user/user_del',

      modalVisible: false,
      modalAction: '',
      modalTitle: '管理员',
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
      total,
      usernew,
    } = this.state;

    const searchParams = [
      [
        {
          key: 'id',
          label: '渠道id',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入渠道名称',
          rules: [],
        },
        {
          key: 'name',
          label: '用户名称',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入用户名',
          rules: [],
        },
        {
          key: 'start_time',
          label: '开始时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
      ],
      [
        {
          key: 'end_time',
          label: '结束时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
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
        {},
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
        title: '最后登录时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: create_time => <span>{moment(create_time).format('YYYY-MM-DD')}</span>,
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
              <Statistic
                title="新增用户"
                value={total}
                prefix={<Icon type="user-add" />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="累计用户" value={usernew} prefix={<Icon type="team" />} />
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

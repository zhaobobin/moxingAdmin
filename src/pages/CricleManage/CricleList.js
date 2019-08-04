import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class CricleList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {},                //查询参数
      pageTitle: '会员列表',
      apiList: '/api/member/index',
      apiAdd: '/api/member/user_add',
      apiEdit: '/api/member/user_edit',
      apiDel: '/api/member/user_del',
      modalVisible: false,
      modalAction: '',
      modalTitle: '会员',
      modalValues: '',

      roleOptions: [],                   //角色下拉列表

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      queryParams: values,
      modalVisible: false,
    })
  };

  //添加
  add = () => {
    this.setState({
      modalVisible: true,
      modalAction: '添加',
    })
  };

  //编辑
  edit = (item) => {
    this.setState({
      modalVisible: true,
      modalAction: '编辑',
      modalValues: item
    })
  };

  //详情
  detail = (id) => {
    this.props.dispatch(routerRedux.push(`/cricle/detail/${id}`))
  };

  //保存
  save = (values) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let {apiAdd, apiEdit, modalAction} = this.state;
    let api = modalAction === '添加' ? apiAdd : apiEdit;
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: {
        ...values,
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.tableInit.refresh({});
          this.setState({
            modalVisible: false,
            modalValues: '',
          })
        }
      }
    });
  };

  del = (id) => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let {apiDel} = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: apiDel,
      payload: {
        id,
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.tableInit.refresh({})
        }
      }
    });
  };

  //modal回调
  modalCallback = (values) => {
    if(values){
      this.save(values)
    }else{
      this.setState({
        modalVisible: false,
        modalValues: '',
      })
    }
  };

  render(){

    const {currentUser} = this.props.global;
    const {apiList, queryParams, modalVisible, modalAction, modalTitle, modalValues} = this.state;

    const searchParams = [
      [
        {
          key: 'id',
          label: 'User ID',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入用户id',
          rules: [],
        },
        {
          key: 'nickname',
          label: '昵称',
          type: 'Input',
          value: '',
          placeholder: '请输入昵称',
          rules: [],
        },
        {
          key: 'mobile',
          label: '手机号',
          type: 'Input',
          value: '',
          placeholder: '请输入手机号',
          rules: [],
        },
      ],
      [
        {
          key: 'status',
          label: '状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '禁用',
              value: 0
            },
            {
              label: '正常',
              value: 1
            },
            {
              label: '未验证',
              value: 2
            },
          ]
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
        {}
      ]
    ];

    const modalParams = [
      [
        {
          key: 'nickname',
          label: '昵称',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.nickname : undefined,
          placeholder: '请输入昵称',
          rules: [],
        },
        {
          key: 'mobile',
          label: '手机号',
          type: 'Input',
          value: modalValues ? modalValues.mobile : undefined,
          placeholder: '请输入手机号',
          rules: [],
        },
        {
          key: 'type',
          label: '用户类型',
          type: 'Select',
          value: modalValues ? modalValues.type : undefined,
          placeholder: '请选择',
          option: [
            {
              label: '会员',
              value: 1
            },
            {
              label: '店铺',
              value: 2
            }
          ]
        },
        {
          key: 'sex',
          label: '性别',
          type: 'Select',
          value: modalValues ? modalValues.sex : undefined,
          placeholder: '请选择',
          option: [
            {
              label: '保密',
              value: 0
            },
            {
              label: '男',
              value: 1
            },
            {
              label: '女',
              value: 2
            }
          ]
        },
      ]
    ];

    const columns = [
      {
        title: 'User ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        align: 'center',
        render: (nickname) => (
          <span>{nickname || '--'}</span>
        )
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        align: 'center',
      },
      {
        title: '用户类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (type) => (
          <span>{type === 1 ? '会员' : '店铺'}</span>
        )
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        align: 'center',
        render: (sex) => (
          <span>
            {sex === 0 ? '保密' : null}
            {sex === 1 ? '男' : null}
            {sex === 2 ? '女' : null}
          </span>
        )
      },
      {
        title: '注册方式',
        dataIndex: 'create_method',
        key: 'create_method',
        align: 'center',
        render: (create_method) => (
          <span>{create_method || '--'}</span>
        )
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (create_time) => (
          <span>{create_time}</span>
        )
      },
      {
        title: '状态',
        dataIndex: 'user_status',
        key: 'user_status',
        align: 'center',
        render: (user_status) => (
          <span>
            {user_status === 0 ? '禁用' : null}
            {user_status === 1 ? '正常' : null}
            {user_status === 2 ? '未验证' : null}
            {!user_status ? '--' : null}
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            <a onClick={() => this.detail(item.id)}>详情</a>
            <span> | </span>
            <a onClick={() => this.edit(item)}>编辑</a>
            {/*{*/}
            {/*currentUser.role === '超级管理员' ?*/}
            {/*<span>*/}
            {/*<Popconfirm title="确定删除该用户？" onConfirm={() => this.del(item.id)}>*/}
            {/*<span> | </span>*/}
            {/*<a>删除</a>*/}
            {/*</Popconfirm>*/}
            {/*</span>*/}
            {/*:*/}
            {/*null*/}
            {/*}*/}
          </div>
        )
      },
    ];

    return(
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

        {
          currentUser.role === '超级管理员' ?
            <div style={{padding: '20px 0'}}>
              <Button type="primary" onClick={this.add}>添加{modalTitle}</Button>
              <FormInit
                params={modalParams}
                callback={this.modalCallback}
                modal={{
                  title: modalAction + modalTitle,
                  visible: modalVisible
                }}
              />
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
    )
  }
}

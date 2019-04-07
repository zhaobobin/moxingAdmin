import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class PrizeActivityList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        prize_id: this.props.match.params.id,
      },                //查询参数
      pageTitle: '奖项列表',
      apiList: '/api/prize/prize_arr',
      apiAdd: '/api/prize/prize_arr_add',
      apiEdit: '/api/prize/prize_arr_edit',
      apiDel: '/api/prize/prize_arr_delete',

      modalVisible: false,
      modalAction: '',
      modalTitle: '奖项',
      pidDisabled: true,

      stateOptions: [],                   //状态下拉列表

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      prize_id: this.queryParams.prize_id,
      queryParams: values,
    })
  };

  //添加
  add = (item) => {
    this.setState({
      modalVisible: true,
      modalAction: '添加',
      modalValues: {
        pid: item ? item.id : '0',
      },
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

  //保存
  save = (values) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let {apiAdd, apiEdit, queryParams, modalAction, modalValues} = this.state;

    let api = modalAction === '添加' ? apiAdd : apiEdit;

    let data = {...values};
    if(modalAction === '添加') {
      data.prize_id = queryParams.prize_id;
    }else{
      data.id = modalValues.id;
    }

    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: (res) => {
        if(res.code === '0'){
          this.tableInit.refresh(queryParams);
          this.setState({
            modalVisible: false,
            modalValues: '',
            queryParams,
          })
        }
      }
    });

    setTimeout(() => {this.ajaxFlag = true}, 500);
  };

  del = (id) => {
    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let {queryParams, apiDel} = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: apiDel,
      payload: {
        category_id: id,
      },
      callback: (res) => {
        if(res.code === '0'){
          this.tableInit.refresh(queryParams)
        }
      }
    });

    setTimeout(() => {this.ajaxFlag = true}, 500);
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
    const {apiList, queryParams, modalVisible, modalAction, modalTitle, modalValues, pidDisabled} = this.state;

    const searchParams = [
      [
        {
          key: 'name',
          label: '奖项名称',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入奖项名称',
          rules: [],
        },
        {
          key: 'state',
          label: '奖项状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {label: '删除', value: '0'},
            {label: '开启', value: '1'},
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
      ],
    ];

    const modalParams = [
      [
        {
          key: 'name',
          label: '奖项名称',
          type: 'Input',
          inputType: 'Input',
          value: modalValues && modalValues.name ? modalValues.name : undefined,
          placeholder: '请输入奖项名称',
          rules: [
            { required: true, message: '请输入奖项名称' },
          ],
        },
        {
          key: 'num',
          label: '奖项数量',
          type: 'InputNumber',
          value: modalValues && modalValues.num ? modalValues.num : undefined,
          placeholder: '奖项数量',
          rules: [
            { required: true, message: '请输入奖项数量' },
          ],
        },
        {
          key: 'state',
          label: '奖项状态',
          type: 'Select',
          value: modalValues && modalValues.state ? modalValues.state.toString() : '1',
          placeholder: '请选择',
          option: [
            {label: '删除', value: '0'},
            {label: '正常', value: '1'},
          ],
          rules: [
            { required: true, message: '请选择奖项状态' },
          ],
        },
      ]
    ];

    const columns = [
      {
        title: '奖项名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '奖项数量',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
      },
      {
        title: '活动状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (state) => (
          <span>{state === 1 ? '删除' : '关闭'}</span>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.edit(item)}>查看</a>
          </span>
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

/**
 * 抽奖 - 奖品名单
 */
import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Badge, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

@connect(({ global }) => ({
  global,
}))
export default class PrizeGoodsList extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {

      },                //查询参数
      pageTitle: '奖项列表',
      apiList: '/api/activities/goods',
      apiAdd: '/api/activities/goods_add',
      apiEdit: '/api/activities/goods_edit',
      apiDel: '/api/activities/goods_add',

      modalVisible: false,
      modalAction: '',
      modalTitle: '奖品',
      pidDisabled: true,

      stateOptions: [],                   //状态下拉列表

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
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
      data.type = '1';
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
        goods_id: id,
        type: '2'
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
          key: 'storage',
          label: '奖项数量',
          type: 'InputNumber',
          value: modalValues && modalValues.storage ? modalValues.storage : undefined,
          placeholder: '奖项数量',
          rules: [
            { required: true, message: '请输入奖项数量' },
          ],
        },
        // {
        //   key: 'state',
        //   label: '奖项状态',
        //   type: 'Select',
        //   value: modalValues && modalValues.state ? modalValues.state.toString() : '1',
        //   placeholder: '请选择',
        //   option: [
        //     {label: '删除', value: '0'},
        //     {label: '正常', value: '1'},
        //   ],
        //   rules: [
        //     { required: true, message: '请选择奖项状态' },
        //   ],
        // },
      ]
    ];

    const columns = [
      {
        title: '奖项名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '奖项数量',
        dataIndex: 'storage',
        key: 'storage',
        align: 'center',
      },
      // {
      //   title: '状态',
      //   dataIndex: 'state',
      //   key: 'state',
      //   align: 'center',
      //   render: state => (
      //     <span>
      //       <Badge status={state === '1' ? 'success' : 'error'} />
      //       {state === '1' ? '上架' : '下架'}
      //     </span>
      //   ),
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.edit(item)}>编辑</a>
            <Popconfirm title="是否要删除？" onConfirm={() => this.del(item)}>
              <a>删除</a>
            </Popconfirm>
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

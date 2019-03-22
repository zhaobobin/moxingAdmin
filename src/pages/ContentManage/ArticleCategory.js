import React from 'react';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

function foreachCategory(values, cateArr){

  for(let i in values){
    let item = {label: values[i].name, value: values[i].id.toString()};
    cateArr.push(item);
    if(values[i].children && values[i].children.length > 0){
      foreachCategory(values[i].children, cateArr)
    }
  }
  return cateArr;
}

@connect(({ global }) => ({
  global,
}))
export default class ArticleCategory extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {},                //查询参数

      pageTitle: '文章分类列表',
      apiList: '/api/portal/category',
      apiAdd: '/api/portal/category_add',
      apiEdit: '/api/portal/category_edit',
      apiDel: '/api/portal/category_del',

      modalVisible: false,
      modalAction: '',
      modalTitle: '文章分类',

    }
  }

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

  //保存
  save = (values) => {

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    let {apiAdd, apiEdit, modalAction, modalValues} = this.state;

    let api = modalAction === '添加' ? apiAdd : apiEdit;

    let data = {...values};
    data.uid = this.props.global.currentUser.uid;
    if(modalAction !== '添加') data.id = modalValues.id;

    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: (res) => {
        if(res.code === '0'){
          this.tableInit.refresh({});
          this.setState({
            modalVisible: false,
            modalValues: '',
          })
        }
      }
    });

    setTimeout(() => {this.ajaxFlag = true}, 500);
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
        if(res.code === '0'){
          this.tableInit.refresh({})
        }
      }
    });

    setTimeout(() => {this.ajaxFlag = true}, 500);
  };

  //表格回调，初始化商品分类Options
  tableCallback = (values) => {

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

    const modalParams = [
      [
        {
          key: 'name',
          label: '分类名称',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.name : undefined,
          placeholder: '请输入分类名称',
          rules: [
            { required: true, message: '请输入分类名称' },
          ],
        },
        {
          key: 'explain',
          label: '介绍',
          type: 'Input',
          inputType: 'Input',
          value: modalValues ? modalValues.explain : undefined,
          placeholder: '请输入分类介绍',
          rules: [

          ],
        },
      ]
    ];

    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '分类介绍',
        dataIndex: 'explain',
        key: 'explain',
        align: 'center',
      },
      {
        title: '排序',
        dataIndex: 'list_order',
        key: 'list_order',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (status) => (
          <span>{status === 1 ? '正常' : ''}</span>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <div>
            {
              currentUser.role === '超级管理员' ?
                <span>
                  <a onClick={() => this.edit(item)}>编辑</a>
                  {
                    item.children && item.children.length > 0 ?
                      null
                      :
                      <Popconfirm title="确定删除该分类？" onConfirm={() => this.del(item.id)}>
                        <a>删除</a>
                      </Popconfirm>
                  }
                </span>
                :
                null
            }
          </div>
        )
      },
    ];

    return(
      <div>

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
            queryParams
          }}
          callback={this.tableCallback}
        />

      </div>
    )
  }
}

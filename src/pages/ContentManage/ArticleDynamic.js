import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import { Button, Popconfirm } from 'antd'

import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

const titleStyle = {
  width: '100px',
  height: '20px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

@connect(({ global }) => ({
  global,
}))
export default class ArticleDynamic extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        type: '2'       //文章类型
      },                //查询参数
      apiList: '/api/portal/get_portal',
      apiDel: '/api/portal/portal_del',
      title: '文章',

    }
  }

  //表单回调
  formCallback = (values) => {
    this.setState({
      queryParams: values,
    })
  };

  //添加
  add = () => {
    this.props.dispatch(routerRedux.push('/content/article-add'))
  };

  //编辑
  edit = (id) => {
    this.props.dispatch(routerRedux.push(`/content/article-edit/${id}`))
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

  render(){

    const {currentUser} = this.props.global;
    const {apiList, queryParams, title} = this.state;

    const searchParams = [
      [
        {
          key: 'title',
          label: '文章标题',
          type: 'Input',
          value: '',
          placeholder: '请输入文章标题',
          rules: [],
        },
        {
          key: 'published_time',
          label: '发布时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'author',
          label: '发布用户',
          type: 'Input',
          value: '',
          placeholder: '请输入用户名称',
          rules: [],
        },
      ],
      [
        {
          key: 'category_name',
          label: '文章分类',
          type: 'Input',
          value: '',
          placeholder: '请输入文章分类',
          rules: [],
        },
        {
          key: 'status',
          label: '文章状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '未发布',
              value: '0'
            },
            {
              label: '已发布',
              value: '2'
            },
            {
              label: '已下架',
              value: '3'
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
      ]
    ];

    const columns = [
      {
        title: '文章标题',
        dataIndex: 'title',
        key: 'title',
        render: (title) => (
          <div style={titleStyle}>
            {title || '--'}
          </div>
        )
      },
      {
        title: '分类',
        dataIndex: 'category_name',
        key: 'category_name',
        align: 'center',
        render: (category_name) => (
          <span>{category_name || '--'}</span>
        )
      },
      {
        title: '发布时间',
        dataIndex: 'published_time',
        key: 'published_time',
        align: 'center',
      },
      {
        title: '阅读',
        dataIndex: 'view',
        key: 'view',
        align: 'center',
      },
      {
        title: '评论',
        dataIndex: 'reply',
        key: 'reply',
        align: 'center',
      },
      {
        title: '分享',
        dataIndex: 'share',
        key: 'share',
        align: 'center',
      },
      {
        title: '收藏',
        dataIndex: 'favorites',
        key: 'favorites',
        align: 'center',
      },
      {
        title: '点赞',
        dataIndex: 'like',
        key: 'like',
        align: 'center',
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (status) => (
          <span>
            {status === 0 ? '未发布' : null}
            {status === 1 ? '已发布' : null}
            {status === 2 ? '已下架' : null}
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
            {
              currentUser.role === '超级管理员' ?
                <span>
                  <a onClick={() => this.edit(item.id)}>编辑</a>
                  {/*<Popconfirm title="确定删除该用户？" onConfirm={() => this.del(item.id)}>*/}
                  {/*<a>删除</a>*/}
                  {/*</Popconfirm>*/}
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

        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback}/>

        {
          currentUser.role === '超级管理员' ?
            <div style={{padding: '20px 0'}}>
              <Button type="primary" onClick={this.add}>添加{title}</Button>
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

/**
 * 文章列表
 */
import React from 'react';
import { Link } from 'dva/router'
import moment from 'moment'
import FormInit from '@/components/Form/FormInit'
import TableInit from '@/components/Table/TableInit'

export default class ArticleList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      queryParams: {}
    }
  }

  refreshList = (values) => {
    this.setState({
      queryParams: values
    })
  };

  render(){

    const {queryParams} = this.state;

    const searchParams = [
      [
        {
          key: 'title',
          label: '文章名称',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入文章名称',
          rules: [],
        },
        {
          key: 'create_time',
          label: '创建时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'user',
          label: '发布用户',
          type: 'Input',
          value: '',
          placeholder: '请输入用户名称',
          rules: [],
        },
      ],
      [
        {
          key: 'user_status',
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

    const columns = [
      {
        title: '分类',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (type) => (
          <span>
            {type === 1 ? '文章' : null}
            {type === 2 ? '动态' : null}
            {type === 3 ? '抓取' : null}
          </span>
        )
      },
      {
        title: '文章标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (create_time) => (
          <span>{moment(create_time * 1000).format('YYYY-MM-DD')}</span>
        )
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
            {status === 0 ? '禁用' : null}
            {status === 1 ? '正常' : null}
            {status === 2 ? '未验证' : null}
          </span>
        )
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <Link to={`/article/detail/${item.id}`}>查看</Link>
          </span>
        )
      },
    ];

    return(
      <div>

        <FormInit layout="horizontal" params={searchParams} callback={this.refreshList}/>

        <TableInit
          params={{
            api: '/api/portal/get_portal',
            columns,
            queryParams
          }}
        />
      </div>
    )
  }
}

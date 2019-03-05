import React from 'react';
import moment from 'moment'
import TableInit from '@/components/Table/TableInit'

export default class ExhibitionList extends React.Component {

  render(){

    const columns = [
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center',
      },
      {
        title: '真实名称',
        dataIndex: 'real_name',
        key: 'real_name',
        align: 'center',
      },
      {
        title: '用户角色',
        dataIndex: 'role_id',
        key: 'role_id',
        align: 'center',
      },
      {
        title: '最后登录时间',
        dataIndex: 'last_login_time',
        key: 'last_login_time',
        align: 'center',
        render: (last_login_time) => (
          <span>{moment(last_login_time).format('YYYY-MM-DD')}</span>
        )
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
      },
    ];

    return(
      <div>
        <TableInit
          params={{
            api: '/api/exhibition/index',
            columns,
            queryParams: {

            }
          }}
        />
      </div>
    )
  }
}

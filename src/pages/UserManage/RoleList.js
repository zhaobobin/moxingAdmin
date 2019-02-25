import React from 'react';
import TableInit from '@/components/Table/TableInit'

export default class RoleList extends React.Component {

  render(){

    const columns = [
      {
        title: '角色id',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '角色名',
        dataIndex: 'role_name',
        key: 'role_name',
        align: 'center',
      },
      {
        title: '节点数据',
        dataIndex: 'rule',
        key: 'rule',
        align: 'center',
      },
    ];

    return(
      <div>
        <TableInit
          params={{
            api: '/api/role/index',
            columns,
            queryParams: {

            }
          }}
        />
      </div>
    )
  }
}

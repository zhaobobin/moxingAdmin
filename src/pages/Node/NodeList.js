import React from 'react';
import TableInit from '@/components/Table/TableInit'

export default class NodeList extends React.Component {

  render(){

    const columns = [
      {
        title: '节点id',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '节点名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '父节点id',
        dataIndex: 'pid',
        key: 'pid',
        align: 'center',
      },
      {
        title: '是否是菜单项',
        dataIndex: 'is_menu',
        key: 'is_menu',
        align: 'center',
        render: (is_menu) => (
          <span>{is_menu === '1' ? '不是' : '是'}</span>
        )
      },
      {
        title: '菜单样式',
        dataIndex: 'style',
        key: 'style',
        align: 'center',
      },
      {
        title: '控制器名',
        dataIndex: 'control_name',
        key: 'control_name',
        align: 'center',
      },
      {
        title: '方法名',
        dataIndex: 'action_name',
        key: 'action_name',
        align: 'center',
      },
    ];

    return(
      <div>
        <TableInit
          params={{
            api: '/api/node/index',
            columns,
            queryParams: {

            }
          }}
        />
      </div>
    )
  }
}

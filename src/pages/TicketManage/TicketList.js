import React from 'react';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
    };
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
    });
  };

  render() {
    let { queryParams } = this.state;
    queryParams.id = this.props.match.params.id;

    const searchParams = [
      [
        {
          key: 'name',
          label: '门票名称',
          type: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'time',
          label: '门票有效期',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [],
        },
        {
          key: 'is_day',
          label: '是否当日票',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            {
              label: '当日票',
              value: '1',
            },
            {
              label: '通用票',
              value: '2',
            },
          ],
        },
      ],
      [
        {},
        {},
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
      ],
    ];

    const columns = [
      {
        title: '门票名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '门票有效期',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
      {
        title: '门票数量',
        dataIndex: 'salenum',
        key: 'salenum',
        align: 'center',
      },
      {
        title: '销售数量',
        dataIndex: 'storage',
        key: 'storage',
        align: 'center',
      },
      {
        title: '核销数量',
        dataIndex: 'inspect',
        key: 'inspect',
        align: 'center',
      },
      {
        title: '过期数量',
        dataIndex: 'overdue',
        key: 'overdue',
        align: 'center',
      },
      {
        title: '单价（元）',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '是否是当日票',
        dataIndex: 'is_day',
        key: 'is_day',
        align: 'center',
        render: is_day => <span>{is_day === 1 ? '当日票' : '通用票'}</span>,
      },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        <TableInit
          params={{
            api: '/api/exhibition/ticket',
            columns,
            queryParams,
          }}
        />
      </div>
    );
  }
}

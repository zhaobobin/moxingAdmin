/**
 * 抽奖 - 抽奖名单
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Popconfirm } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';

@connect(({ global }) => ({
  global,
}))
export default class PrizePersonList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {
        id: this.props.match.params.id,
      }, //查询参数
      apiList: '/api/prize/statistics',
    };
  }

  componentDidMount() {}

  //表单回调
  formCallback = values => {
    values.id = this.state.queryParams.id;
    this.setState({
      queryParams: values,
    });
  };

  //削奖
  check = id => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/prize/operation',
      payload: {
        id,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.tableInit.refresh(this.state.queryParams);
        }
      },
    });
  };

  render() {
    const { apiList, queryParams } = this.state;

    const searchParams = [
      [
        {
          key: 'tel',
          label: '抽奖手机号',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请选择',
          rules: [],
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
          ],
        },
        {},
      ],
    ];

    const columns = [
      {
        title: '抽奖活动id',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '奖项名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '抽奖手机号',
        dataIndex: 'tel',
        key: 'tel',
        align: 'center',
        render: tel => <span>{tel || '--'}</span>,
      },
      {
        title: '是否是新用户抽奖',
        dataIndex: 'is_new',
        key: 'is_new',
        align: 'center',
        render: is_new => <span>{is_new === 1 ? '是' : '否'}</span>,
      },
      {
        title: '是否已兑奖',
        dataIndex: 'is_use',
        key: 'is_use',
        align: 'center',
        render: is_use => <span>{is_use === 1 ? '已兑奖' : '为兑奖'}</span>,
      },
      {
        title: '削奖',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            {item.is_use === 1 || item.name === '未中奖' ? (
              '--'
            ) : (
              <Popconfirm title="确定削奖？" onConfirm={() => this.check(item.id)}>
                <a>削奖</a>
              </Popconfirm>
            )}
          </span>
        ),
      },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        <TableInit
          onRef={ref => (this.tableInit = ref)}
          params={{
            api: apiList,
            columns,
            queryParams,
          }}
        />
      </div>
    );
  }
}

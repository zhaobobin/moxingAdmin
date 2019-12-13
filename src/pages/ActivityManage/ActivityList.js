import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link, routerRedux } from 'dva/router';
import { Button, Popconfirm, Modal, Table, Badge } from 'antd';

import FormInit from '@/components/Form/FormInit';
import TableInit from '@/components/Table/TableInit';
import AddSignFrom from './AddSignFrom';

@connect(({ global }) => ({
  global,
}))
export default class ActivityList extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      queryParams: {}, //查询参数
      pageTitle: '活动列表',
      apiList: '/api/activities/index',
      getActivity: '/api/activities/get_activity',
      modalTitle: '活动',

      stateOptions: [], //状态下拉列表

      activityLevel: '1',           // 创建活动的等级
      currentActivityDetail: '', // 当前活动详情
      currentRoundDetail: '', // 当前轮次详情
      addModalVisible: false, // 添加活动modal
      roundModalVisible: false, // 添加轮次modal
      ticketModalVisible: false, // 添加门票modal
      signModalVisible: false, // 添加报名modal

      expandVisible: {},
      expandedRowRenders: null,
      expandedData: {},
    };
  }

  //表单回调
  formCallback = values => {
    this.setState({
      queryParams: values,
    });
  };

  // 创建活动 begin !
  addActivity = () => {
    this.setState({
      activityLevel: '1',
      addModalVisible: true,
    });
  };

  addSecondActivity = (item) => {
    let path = '';
    switch (item.type) {
      case '1': path = 'create-activity'; break;
      case '2': path = 'create-game'; break;
      case '3': path = 'create-lucky'; break;
      default: break;
    }
    this.props.dispatch(
      routerRedux.push(`/activity/${path}/2_${item.type}_${item.id}`)
    )
  }

  edit = item => {
    let path = '';
    switch (item.type) {
      case '1':
        path = 'edit-activity';
        break;
      case '2':
        path = 'edit-game';
        break;
      case '3':
        path = 'edit-lucky';
        break;
      default:
        break;
    }
    this.props.dispatch(routerRedux.push(`/activity/${path}/${item.id}`));
  };

  del = (id, type) => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/activities_del',
      payload: {
        id,
        type
      },
      callback: res => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        this.tableInit.refresh({});
      },
    });
  };

  // addSign = (id) => {
  //   this.props.dispatch(routerRedux.push(`/activity/add-sign/${id}`))
  // }

  // 添加活动回调
  addModalCallback = values => {
    if (values) {
      if (!values.level || !values.type) return;
      let path = '',
        p_num = values.p_num || '';
      switch (values.type) {
        case '1': path = 'create-activity'; break;
        case '2': path = 'create-game'; break;
        case '3': path = 'create-lucky'; break;
        default: break;
      }
      if (path)
        this.props.dispatch(
          routerRedux.push(`/activity/${path}/${values.level}_${values.type}_${p_num}`)
        );
    } else {
      this.setState({
        addModalVisible: false,
      });
    }
  };
  // 添加活动 end !

  // 添加轮次 begin !
  addRound = item => {
    this.setState({
      currentActivityDetail: item,
      roundModalVisible: true,
    });
  };

  saveRound (values) {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/round_add',
      payload: {
        activities_id: this.state.currentActivityDetail.id,
        ...values,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          //this.tableInit.refresh({});
          this.queryRound(this.state.currentActivityDetail);  // 刷新活动下的轮次信息
          this.setState({
            roundModalVisible: false,
          });
        }
      },
    });
  }

  roundModalCallback = values => {
    if (values) {
      values.start_time = moment(values.start_time).format('YYYY-MM-DD HH:mm:ss');
      values.end_time = moment(values.end_time).format('YYYY-MM-DD HH:mm:ss');
      // console.log(values)
      this.saveRound(values);
    } else {
      this.setState({
        roundModalVisible: false,
      });
    }
  };
  // 添加轮次 end !

  // 添加门票 begin !
  showTicket = item => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/getroundticket',
      payload: {
        round_id: item.id,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
        }
      },
    });
  };

  addTicket = item => {
    this.setState({
      currentRoundDetail: item,
      ticketModalVisible: true,
    });
  };

  saveTicket(values) {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/ticket_add',
      payload: {
        activities_id: this.state.currentActivityDetail.id,
        round_id: this.state.currentRoundDetail.id,
        type: this.state.currentActivityDetail.type,
        ...values,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          //this.tableInit.refresh({});
          this.roundTable.queryTicket(this.state.currentRoundDetail); // 刷新轮次下的门票信息
          this.setState({
            ticketModalVisible: false,
          });
        }
      },
    });
  }

  ticketModalCallback = values => {
    if (values) {
      this.saveTicket(values);
    } else {
      this.setState({
        ticketModalVisible: false,
      });
    }
  };
  // 添加门票 end !

  // 添加报名 begin !
  // 展开报名modal前，调取相关轮次信息
  addSign = item => {
    const { currentRoundDetail } = this.state;
    if(currentRoundDetail){
      this.addSingForm.show({ activity_id: item.id, roundDetail: currentRoundDetail})
    } else {
      this.props.dispatch({
        type: 'global/post',
        url: '/api/activities/getround',
        payload: {
          id: item.id
        },
        callback: (res) => {
          if(res.code === '0') {
            this.addSingForm.show({ activity_id: item.id, roundDetail: res.data})
          }
        }
      })
    }

    // this.setState({
    //   currentRoundDetail: item,
    //   signModalVisible: true,
    // });
  };
  // 添加报名 end !

  // 查询活动下的轮次信息 begin !
  onExpand = (expanded, record) => {
    // console.log(record)
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!expanded) {
      this.setState({
        subTabData: {
          ...this.state.subTabData,
          [record.id]: [],
        },
      });
    } else {
      this.queryRound(record)
    }

    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  // 查询轮次
  queryRound = (record) => {
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/getround',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (res.code === '0') {
          this.setState({
            currentActivityDetail: record,
            expandVisible: {
              ...this.state.expandVisible,
              [record.id]: true,
            },
            subTabData: {
              ...this.state.expandedData,
              [record.id]: res.data,
            },
            expandedRowRenders: {
              ...this.state.expandedRowRenders,
              [record.id]: (
                <RoundTable
                  onRef={e => this.roundTable = e}
                  expandVisible
                  expandRecord={record}
                  data={res.data}
                  showTicket={item => this.showTicket(item)}
                  addTicket={item => this.addTicket(item)}
                  addSign={item => this.addSign(item)}
                />
              ),
            },
          });
        }
      },
    });
  }
  // 查询活动下的轮次信息 end !

  render() {
    const { currentUser } = this.props.global;
    const {
      activityLevel,
      apiList,
      queryParams,
      modalTitle,
      currentActivityDetail,
      addModalVisible,
      roundModalVisible,
      ticketModalVisible,
      signModalVisible,
    } = this.state;

    const searchParams = [
      [
        {
          key: 'id',
          label: '活动ID',
          type: 'Input',
          inputType: 'number',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'name',
          label: '活动名称',
          type: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [],
        },
        {
          key: 'type',
          label: '活动类型',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            { label: '全部', value: '' },
            { label: '常规活动', value: '1' },
            { label: '比赛活动', value: '2' },
            { label: '抽奖活动', value: '3' },
          ],
        },
      ],
      [
        {
          key: 'state',
          label: '活动状态',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            { label: '全部', value: '' },
            { label: '下架', value: '0' },
            { label: '上架', value: '1' },
          ],
        },
        {
          key: 'level',
          label: '活动级别',
          type: 'Select',
          value: '',
          placeholder: '请选择',
          option: [
            { label: '全部', value: '' },
            { label: '一级活动', value: '1' },
            { label: '二级活动', value: '2' },
          ],
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
      ],
    ];

    // 添加活动
    const addModalParams = [
      [
        {
          key: 'level',
          label: '活动级别',
          type: 'Select',
          inputType: 'Select',
          value: activityLevel,
          placeholder: '请选择',
          disabled: true,
          rules: [{ required: true, message: '请选择活动级别' }],
          option: [
            {
              label: '一级活动',
              value: '1',
            },
            {
              label: '二级活动',
              value: '2',
            },
          ],
        },
        {
          key: 'type',
          label: '活动类型',
          type: 'Select',
          value: '1',
          placeholder: '请选择',
          rules: [{ required: true, message: '请选择活动类型' }],
          option: [
            {
              label: '常规活动',
              value: '1',
            },
            {
              label: '比赛活动',
              value: '2',
            },
            {
              label: '抽奖活动',
              value: '3',
            },
          ],
        },
      ],
    ];

    // 添加轮次
    const roundModalParams = [
      [
        {
          key: 'name',
          label: '轮次名称',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入',
          rules: [{ required: true, message: '请输入轮次名称' }],
        },
        {
          key: 'start_time',
          label: '开始时间',
          type: 'DatePicker',
          value: '',
          showTime: true,
          disabledDate: current => {
            return (
              current < moment(currentActivityDetail.start_time) ||
              current > moment(currentActivityDetail.end_time)
            );
          },
          placeholder: '请选择',
          rules: [{ required: true, message: '请选择轮次开始时间' }],
        },
        {
          key: 'end_time',
          label: '结束时间',
          type: 'DatePicker',
          value: '',
          showTime: true,
          disabledDate: current => {
            return (
              current < moment(currentActivityDetail.start_time) ||
              current > moment(currentActivityDetail.end_time)
            );
          },
          placeholder: '请选择',
          rules: [{ required: true, message: '请选择轮次结束时间' }],
        },
      ],
    ];

    // 添加门票
    const ticketModalParams = [
      [
        {
          key: 'name',
          label: '门票名称',
          type: 'Input',
          inputType: 'Input',
          value: '',
          placeholder: '请输入门票名称（最多5个汉子）',
          rules: [
            { required: true, message: '请输入门票名称' },
            { max: 10, message: '不能超过5个汉子' },
          ],
        },
        {
          key: 'price',
          label: '门票价格',
          type: 'Input',
          inputType: 'Number',
          value: '',
          placeholder: '请输入门票价格',
          rules: [{ required: true, message: '请输入门票价格' }],
        },
        {
          key: 'storage',
          label: '门票库存',
          type: 'Input',
          inputType: 'Number',
          value: '',
          placeholder: '请输入门票库存',
          rules: [{ required: true, message: '请输入门票库存' }],
        },
        {
          key: 'start_ticket_time',
          label: '开始售票时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [{ required: true, message: '请选择开始售票时间' }],
        },
        {
          key: 'end_ticket_time',
          label: '结束售票时间',
          type: 'DatePicker',
          value: '',
          placeholder: '请选择',
          rules: [{ required: true, message: '请选择结束售票时间' }],
        },
      ],
    ];

    // 表格结构
    const columns = [
      {
        title: '活动ID',
        dataIndex: 'id',
        key: 'ID',
        align: 'center',
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '活动类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: type => (
          <span>
            {type === '1' ? '常规活动' : null}
            {type === '2' ? '比赛活动' : null}
            {type === '3' ? '抽奖活动' : null}
          </span>
        ),
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center',
        render: start_time => (
          <span>{start_time ? moment(start_time).format('YYYY-MM-DD') : '--'}</span>
        ),
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        align: 'center',
        render: end_time => <span>{end_time ? moment(end_time).format('YYYY-MM-DD') : '--'}</span>,
      },
      {
        title: '活动状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: state => <span>{state === '1' ? '上架' : '下架'}</span>,
      },
      {
        title: '活动级别',
        dataIndex: 'level',
        key: 'level',
        align: 'center',
        render: level => <span>{level === '1' ? '一级活动' : '二级活动'}</span>,
      },

      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (text, item) => (
          <span>
            <a onClick={() => this.edit(item)}>查看</a>
            <a onClick={() => this.addRound(item)}>添加轮次</a>
            <a onClick={() => this.addSign(item)}>添加报名</a>
            {item.level === '1' ? <a onClick={() => this.addSecondActivity(item)}>添加二级活动</a> : null}
            <Popconfirm title={`是否要${item.state === '1' ? '下架' : '上架'}？`} onConfirm={() => this.del(item.id, item.state === '1' ? '2' : '1')}>
              <a>{item.state === '1' ? '下架' : '上架'}</a>
            </Popconfirm>
            <Popconfirm title="是否要删除？" onConfirm={() => this.del(item.id, '3')}>
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div>
        <FormInit layout="horizontal" params={searchParams} callback={this.formCallback} />

        <div style={{ padding: '20px 0' }}>
          <Button type="primary" onClick={this.addActivity}>
            添加{modalTitle}
          </Button>
        </div>

        <TableInit
          onRef={ref => (this.tableInit = ref)}
          onExpand={this.onExpand}
          expandedRowRender={record =>
            this.state.expandVisible[record.id] === true
              ? this.state.expandedRowRenders[record.id]
              : true
          }
          params={{
            api: apiList,
            columns,
            queryParams,
          }}
        />

        {/*添加活动*/}
        <FormInit
          params={addModalParams}
          callback={this.addModalCallback}
          modal={{
            title: '添加活动',
            visible: addModalVisible,
          }}
        />

        {/*添加轮次*/}
        <FormInit
          params={roundModalParams}
          callback={this.roundModalCallback}
          modal={{
            title: '添加轮次',
            visible: roundModalVisible,
          }}
        />

        {/*添加门票*/}
        <FormInit
          params={ticketModalParams}
          callback={this.ticketModalCallback}
          modal={{
            title: '添加门票',
            visible: ticketModalVisible,
          }}
        />

        {/*添加报名*/}
        <AddSignFrom onRef={e => this.addSingForm = e} />
      </div>
    );
  }
}

// 子表格 - 轮次信息
@connect(({ global }) => ({
  global,
}))
class RoundTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      expandVisible: {},
      expandedRowRenders: null,
      expandedData: {},
    };
  }

  componentDidMount(){
    this.props.onRef(this)
  }

  // 查询轮次下的门票信息 begin !
  onExpand = (expanded, record) => {
    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    if (!expanded) {
      this.setState({
        subTabData: {
          ...this.state.subTabData,
          [record.id]: [],
        },
      });
    } else {
      this.queryTicket(record)
    }

    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  // 查询门票
  queryTicket = (record) => {
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/getroundticket',
      payload: {
        round_id: record.id,
      },
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.setState({
            expandVisible: {
              ...this.state.expandVisible,
              [record.id]: true,
            },
            subTabData: {
              ...this.state.expandedData,
              [record.id]: res.data,
            },
            expandedRowRenders: {
              ...this.state.expandedRowRenders,
              [record.id]: (
                <TicketTable
                  expandVisible
                  expandRecord={record}
                  data={res.data}
                  // showTicket={(item) => this.showTicket(item)}
                  // addTicket={(item) => this.addTicket(item)}
                  // addSign={(item) => this.addSign(item)}
                />
              ),
            },
          });
        }
      },
    });
  }
  // 查询轮次下的门票信息 end !

  render() {
    const { data } = this.props;

    const columns = [
      { title: '轮次名称', dataIndex: 'name', key: 'name' },
      { title: '开始时间', dataIndex: 'start_time', key: 'start_time' },
      { title: '结束时间', dataIndex: 'end_time', key: 'end_time' },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, item) => (
          <span>
            <a onClick={() => this.props.addTicket(item)}>添加门票</a>
            {/*<a onClick={() => this.props.addSign(item)}>添加报名</a>*/}
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        onExpand={this.onExpand}
        expandedRowRender={record =>
          this.state.expandVisible[record.id] === true
            ? this.state.expandedRowRenders[record.id]
            : true
        }
        pagination={false}
      />
    );
  }
}

// 子表格 - 票务信息
@connect(({ global }) => ({
  global,
}))
class TicketTable extends React.PureComponent {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      detail: ''
    }
  }

  showTicketDetail = id => {
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/ticket_details',
      payload: {
        id
      },
      callback: (res) => {
        if(res.code === '0'){
          this.setState({
            visible: true,
            detail: res.data
          })
        }
      }
    })
  };

  ticketDetailModalCallback = (values) => {
    // console.log(values)
    if (values) {
      // this.props.dispatch({
      //   type: 'global/post',
      //   url: '/api/activities/ticket_edit',
      //   payload: values,
      //   callback: (res) => {
      //     if(res.code === '0'){
      //       this.setState({
      //         visible: false,
      //       })
      //     }
      //   }
      // })
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  render() {

    const { data } = this.props;
    const { visible, detail } = this.state;

    // 查看门票详情
    const ticketModalParams = [
      [
        {
          key: 'id',
          label: '门票id',
          type: 'Input',
          inputType: 'Input',
          value: detail.id ? detail.id.toString() : '',
          disabled: true,
          placeholder: '',
          rules: [],
        },
        {
          key: 'name',
          label: '门票名称',
          type: 'Input',
          inputType: 'Input',
          value: detail.name || '',
          placeholder: '',
          rules: [],
        },
        {
          key: 'start_ticket_time',
          label: '开始售票时间',
          type: 'DatePicker',
          value: detail.start_ticket_time || '',
          placeholder: '请选择',
          disabled: true,
          rules: [],
        },
        {
          key: 'end_ticket_time',
          label: '结束售票时间',
          type: 'DatePicker',
          value: detail.end_ticket_time || '',
          placeholder: '请选择',
          disabled: true,
          rules: [],
        },

        {
          key: 'storage',
          label: '销售数量',
          type: 'Input',
          inputType: 'Number',
          value: detail.storage ? detail.storage.toString() : '',
          placeholder: '',
          rules: [],
        },
        {
          key: 'salenum',
          label: '已卖出数量',
          type: 'Input',
          inputType: 'Number',
          value: detail.salenum ? detail.salenum.toString() : '0',
          disabled: true,
          placeholder: '',
          rules: [],
        },
        {
          key: 'inspect',
          label: '已检票数量',
          type: 'Input',
          inputType: 'Number',
          value: detail.inspect ? detail.inspect.toString() : '0',
          disabled: true,
          placeholder: '',
          rules: [],
        },

        {
          key: 'price',
          label: '门票价格',
          type: 'Input',
          inputType: 'Number',
          value: detail.price ? detail.price.toString() : '',
          placeholder: '',
          rules: [],
        },
      ],
    ];

    const loading = !data;

    const columns = [
      { title: '门票名称', dataIndex: 'name', key: 'name' },
      { title: '价格', dataIndex: 'price', key: 'price' },
      { title: '数量', dataIndex: 'storage', key: 'storage' },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, item) => (
          <span>
            <a onClick={() => this.showTicketDetail(item.id)}>查看</a>
          </span>
        ),
      },
    ];

    return (
      <div>
        <Table loading={loading} columns={columns} dataSource={data} pagination={false} />
        <FormInit
          params={ticketModalParams}
          callback={this.ticketDetailModalCallback}
          modal={{
            title: '门票详情',
            visible: visible,
            okText: '修改'
          }}
        />
      </div>
    );
  }
}

import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { ENV, Storage } from '@/utils/utils';
import TableShowTotal from './TableShowTotal'

@connect(({ global }) => ({
  global,
}))
export default class TableInit extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      list: [],
      total: null,

      queryParams: {
        page: 1,
        page_count: Storage.get(ENV.storagePagesize) || 10,
      }
    }
  }

  componentDidMount() {
    if(this.props.onRef) this.props.onRef(this);
    this.queryList(this.props.params.queryParams);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.params.queryParams !== this.props.params.queryParams) {
      this.queryList(nextProps.params.queryParams);
    }
  }

  refresh = (queryParams) => {
    this.queryList(queryParams);
  };

  queryList(queryParams){

    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.setState({ loading: true });

    let {page, page_count} = this.state.queryParams;

    this.props.dispatch({
      type: 'global/post',
      url: this.props.params.api,
      payload: {
        uid: this.props.global.currentUser.uid,
        ...this.state.queryParams,
        ...queryParams,
      },
      callback: (res) => {
        this.ajaxFlag = true;
        if (res.code === "0") {
          this.setState({
            loading: false,
            list: res.data.rows || res.data,
            total: res.data.total || res.data.length,
            queryParams: {
              ...queryParams,
              page: queryParams.page || page,
              page_count: queryParams.page_count || page_count,
            },
          });
        }else{
          this.setState({loading: false, total: 0})
        }
      }
    });
  }

  //表格筛选
  handleTableChange = (pagination, filters, sorter) => {
    Storage.set(ENV.storagePagesize, pagination.pageSize);
    this.queryList({
      ...this.state.queryParams,
      page: pagination.current,
      page_count: pagination.pageSize
    });
  };

  render(){

    const { loading, list, total, queryParams } = this.state;
    const { columns } = this.props.params;

    return(
      <div style={{padding: '20px 0'}}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          onChange={this.handleTableChange}
          pagination={{
            total: total,
            current: queryParams.page,
            pageSize: queryParams.page_count,
            hideOnSinglePage: false,
            showSizeChanger: true,
            showTotalText: true,
            showTotal: () => (
              <TableShowTotal
                total={total}
                page={queryParams.page}
                page_count={queryParams.page_count}
              />
            ),
          }}
        />
      </div>
    )
  }

}

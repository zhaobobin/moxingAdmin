import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Button,
  Icon,
  Select,
  Checkbox,
  DatePicker,
  TimePicker,
  Radio,
  Modal,
} from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
    md: { span: 17 },
  },
};

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
    md: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
  },
};

const btnItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      offset: 7,
      span: 17,
    },
    md: {
      offset: 7,
      span: 17,
    },
  },
};

@connect(({ global }) => ({
  global,
}))
@Form.create()
export default class AddSignFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '添加报名',
      detail: '',
    };
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    // this.queryDetail(id)
  }

  queryDetail(id) {
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/ticket',
      payload: {
        id,
      },
      callback: res => {
        if (res.code === '0') {
          this.setState({
            detail: res.data,
          });
        }
      },
    });
  }

  render() {
    const { detail } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    return (
      <div>
        <Form>
          <FormItem {...formItemLayout} label={'活动名称'}>
            {getFieldDecorator('name', {
              initialValue: '',
            })(<Input disabled />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}

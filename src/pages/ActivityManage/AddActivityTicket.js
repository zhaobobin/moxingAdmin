import React from 'react';
import { connect } from 'dva';
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

@connect(({ global }) => ({
  global,
}))
@Form.create()
export default class AddActivityTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  show = () => {};

  close = () => {};

  render() {
    const { visible } = this.state;

    return (
      <Modal title="添加门票" visible={visible}>
        <Form>
          <FormItem {...formItemLayout2} label="门票名称">
            {getFieldDecorator('name', {
              initialValue: (detail && item.name) || '',
              validateFirst: true,
              rules: [{ required: true, message: '请输入票面名称' }],
            })(
              <Input
                autoComplete="off"
                placeholder="请输入票面名称"
                allowClear={true}
                onChange={e => this.changeTicketForm(e, index, 'name')}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="门票售价">
            {getFieldDecorator('price', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入销售票价' },
                { pattern: /^[0-9.]+$/, message: '只能输入数值' },
              ],
            })(
              <Input
                autoComplete="off"
                placeholder="请输入销售票价"
                allowClear={true}
                suffix="￥"
                onChange={e => this.changeTicketForm(e, index, 'price')}
                onBlur={e => this.changeTicketBlur(e, index)}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="门票库存">
            {getFieldDecorator(`ticket-storage-${index}`, {
              initialValue: (detail && item.storage) || '',
              validateFirst: true,
              rules: [
                { required: true, message: '请输入销售数量' },
                { pattern: /^[0-9]+$/, message: '只能输入正整数' },
              ],
            })(
              <Input
                autoComplete="off"
                style={{ width: '100%' }}
                allowClear={true}
                placeholder="请输入销售数量"
                onChange={e => this.changeTicketForm(e, index, 'storage')}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

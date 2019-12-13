/*
 * 表单生成器
 * layout: 布局类型，垂直vertical，水平horizontal
 * modal: 使用弹出框
 * params: 二维数组，用于生成表单结构
 * callback: 回调函数
 * demo:
  <FormInit layout="horizontal" params={searchParams} callback={this.refreshList}/>
  <FormInit
    params={modalParams}
    modal={{title: modalTitle, visible: modalVisible}}
    callback={this.handleModalSubmit}
  />
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Modal,
  Icon,
} from 'antd';
import styles from './FormInit.less';

import UploadImage from '@/components/Form/UploadImage';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

@Form.create()
export default class FormInit extends PureComponent {
  state = {
    layout: this.props.layout ? this.props.layout : 'vertical',
    params: this.props.params,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.params !== this.state.params) {
      this.setState({ params: nextProps.params });
    }
  }

  // 按条件查询
  handleFormSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields('', (err, values) => {
      if (err) return;
      //this.props.form.resetFields();
      this.props.callback(values);
    });
  };

  // Modal取消
  handleFormCancel = e => {
    e.preventDefault();
    this.props.form.resetFields();
    this.props.callback();
  };

  // 重置查询
  handleFormReset = e => {
    e.preventDefault();
    this.props.form.resetFields();
    this.props.callback({});
  };

  //上传图片回调
  uploadCallback = (key, img) => {
    let data = {};
    data[key] = img.url;
    this.props.form.setFieldsValue(data);
  };

  //依据表单类型，返回相应的html
  getFormItem = (topic, getFieldDecorator, getFieldValue) => {
    let html = '',
      style = topic.width ? { width: topic.width } : { width: '100%' };
    switch (topic.type) {
      case 'Input':
        html = (
          <FormItem {...formItemLayout} label={topic.label}>
            {getFieldDecorator(topic.key, {
              initialValue: topic.value ? topic.value : undefined,
              rules: [
                ...topic.rules,
                { validator: topic.validator === 'password' ? this.checkConfirm : null },
              ],
            })(
              <Input
                autoComplete="off"
                type={topic.inputType ? topic.inputType : 'text'}
                placeholder={topic.placeholder}
                style={style}
                disabled={topic.disabled}
                allowClear={true}
              />
            )}
          </FormItem>
        );
        break;

      case 'InputNumber':
        html = (
          <FormItem {...formItemLayout} label={topic.label}>
            {getFieldDecorator(topic.key, {
              initialValue: topic.value ? topic.value : undefined,
              rules: topic.rules ? topic.rules : undefined,
            })(
              <InputNumber
                autoComplete="off"
                min={0}
                placeholder={topic.placeholder}
                style={style}
                allowClear={true}
              />
            )}
          </FormItem>
        );
        break;

      case 'DatePicker':
        html = (
          <FormItem {...formItemLayout} label={topic.label}>
            {getFieldDecorator(topic.key, {
              initialValue: topic.value ? topic.value : undefined,
              rules: topic.rules ? topic.rules : undefined,
            })(
              <DatePicker
                showTime={topic.showTime}
                disabledDate={topic.disabledDate}
                style={style}
              />
            )}
          </FormItem>
        );
        break;

      case 'RangePicker':
        html = (
          <FormItem {...formItemLayout} label={topic.label}>
            {getFieldDecorator(topic.key, {
              initialValue: topic.value ? topic.value : undefined,
              rules: topic.rules ? topic.rules : undefined,
            })(<RangePicker style={style} />)}
          </FormItem>
        );
        break;

      case 'Select':
        html = (
          <FormItem {...formItemLayout} label={topic.label}>
            {getFieldDecorator(topic.key, {
              initialValue: topic.value ? topic.value : undefined,
              rules: topic.rules ? topic.rules : undefined,
            })(
              <Select placeholder={topic.placeholder} style={style} disabled={topic.disabled}>
                {topic.option.map((op, key) => (
                  <Option
                    key={key}
                    value={op.value}
                    className={op.ischildren ? styles.ischildren : ''}
                  >
                    {op.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        );
        break;

      case 'Upload':
        html = (
          <FormItem {...formItemLayout} label={topic.label}>
            {getFieldDecorator(topic.key, {
              initialValue: topic.value ? topic.value : undefined,
              rules: topic.rules ? topic.rules : undefined,
            })(
              <div style={topic.style || null}>
                <UploadImage
                  type="card"
                  defaultUrl={topic.value}
                  callback={img => this.uploadCallback(topic.key, img)}
                />
              </div>
            )}
          </FormItem>
        );
        break;

      case 'BtnGroup':
        html = (
          <FormItem {...btnItemLayout} className={styles.btnGroup}>
            {topic.btns.map((btn, k) => (
              <Button key={k} type={btn.type} htmlType={btn.htmlType}>
                {btn.name}
              </Button>
            ))}
          </FormItem>
        );
        break;
    }
    return html;
  };

  checkConfirm = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue('password')) {
      callback('请重新确认新密码!');
    } else {
      callback();
    }
  };

  render() {
    const { layout, params } = this.state;
    const { form, modal } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const inputBox = params.map((item, index) => (
      <Row key={index} gutter={{ md: 8, lg: 24, xl: 48 }}>
        {item.map((topic, key) => (
          <Col
            key={key}
            className={styles.col}
            sm={24}
            xs={24}
            md={layout === 'horizontal' ? parseInt(24 / item.length) : 24}
          >
            {this.getFormItem(topic, getFieldDecorator, getFieldValue)}
          </Col>
        ))}
      </Row>
    ));

    return (
      <div className={styles.formInit}>
        {modal ? (
          <Modal
            title={modal.title}
            visible={modal.visible}
            centered={true}
            destroyOnClose={true}
            okText={modal.okText || '确定'}
            cancelText={modal.cancelText || '取消'}
            onOk={this.handleFormSubmit}
            onCancel={this.handleFormCancel}
          >
            <Form>{inputBox}</Form>
          </Modal>
        ) : (
          <Form onSubmit={this.handleFormSubmit} onReset={this.handleFormReset}>
            {inputBox}
          </Form>
        )}
      </div>
    );
  }
}

import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Form, Input, InputNumber, Button, Icon, Select, DatePicker, Radio } from 'antd'
import styles from './TicketForm.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

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

const btnItemLayout2 = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      offset: 0,
      span: 24,
    },
    md: {
      offset: 5,
      span: 19,
    },
  },
};

@connect(({ global }) => ({
  global,
}))
@Form.create()
export default class TicketForm extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      basicInfo: '',
      ticketForm: [
        {
          name: '',
          is_day: '0',
          price: '',
          storage: '',
        }
      ],
    }
  }

  //修改限购数量
  onChangeLimit = (value) => {
    this.props.form.setFieldsValue({'limit': value});
  };

  //添加门票表单
  addTicketForm = () => {
    let {ticketForm} = this.state;
    let item = {
      name: '',
      is_day: '0',
      price: '',
      storage: '',
    };
    ticketForm.push(item);
    this.setState({
      ticketForm
    })
  };

  //删除门票表单
  removeTicketForm = (index) => {
    let {ticketForm} = this.state;
    ticketForm.splice(index, 1);
    this.setState({
      ticketForm
    })
  };

  //监控门票表单
  changeTicketForm = (e, index, key) => {
    let value = e.target.value,
      {ticketForm} = this.state;
    //if(key === 'price') value = value.toFixed(2);
    ticketForm[index][key] = value;
    this.setState({
      ticketForm
    })
  };

  //重置查询
  handleFormReset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  };

  //表单确定
  handleFormSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        values.start_time = moment(values.time[0]._d).format('YYYY-MM-DD HH:mm'); //展会开始时间
        values.end_time = moment(values.time[1]._d).format('YYYY-MM-DD HH:mm');   //展会结束时间
        values.ticket = this.state.ticketForm;
        console.log(values)
        this.save(values);
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //保存
  save = (values) => {
    const {action} = this.props;
    const api = action === 'add' ? '/api/exhibition/exhibition_add' : '/api/exhibition/exhibition_edit';
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: {
        name: values.name,
        image: values.image || '',
        start_time: values.start_time,
        end_time: values.end_time,
        place: values.place,
        ticket: values.ticket,
        limit: values.limit,
        refund: values.refund,
        content: values.content || '',
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.props.dispatch(routerRedux.push('/ticket/exhibition'))
        }
      }
    });
  };

  render(){

    const {action} = this.props;
    const {ticketForm} = this.state;

    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    //门票信息表单
    const ticketFormList = (
      ticketForm.map((item, index) => (
        <div key={index} className={styles.ticketFormItem}>
          <FormItem {...formItemLayout2} label="票面名称">
            {getFieldDecorator(`ticket-name-${index}`,
              {
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入票面名称' },
                ],
              })(
              <Input
                autoComplete="off"
                placeholder="请输入票面名称"
                onChange={ e => this.changeTicketForm(e, index, 'name') }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="门票时间">
            {getFieldDecorator(`ticket-is_day-${index}`,
              {
                initialValue: item.is_day,
              })(
              <RadioGroup name="is_day" onChange={ e => this.changeTicketForm(e, index, 'is_day') }>
                <Radio value={'0'}>展会期间有效</Radio>
                <Radio value={'1'}>展会当日有效</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="销售票价">
            {getFieldDecorator(`ticket-price-${index}`,
              {
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入销售票价' },
                  { pattern: /^[0-9.]+$/, message: '只能输入数值' },
                ],
              })(
              <Input
                autoComplete="off"
                placeholder="请输入销售票价"
                suffix="￥"
                onChange={ e => this.changeTicketForm(e, index, 'price') }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="销售数量">
            {getFieldDecorator(`ticket-storage-${index}`,
              {
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入销售数量' },
                  { pattern: /^[0-9]+$/, message: '只能输入正整数' },
                ],
              })(
              <Input
                autoComplete="off"
                style={{width: '100%'}}
                placeholder="请输入销售数量"
                onChange={ e => this.changeTicketForm(e, index, 'storage') }
              />
            )}
          </FormItem>
          {
            index > 0 ?
              <a
                className={styles.remove}
                onClick={() => this.removeTicketForm(index)}
              >
                删除门票信息
              </a>
              :
              null
          }
        </div>
      ))
    );
    // 门票信息表单 end

    return(
      <div className={styles.container}>

        <Row>
          <Col xs={24} sm={24} md={24} lg={14}>
            <Form
              hideRequiredMark={true}
              onSubmit={this.handleFormSubmit}
              onReset={this.handleFormReset}
            >

              <FormItem {...formItemLayout} label="展会名称">
                {getFieldDecorator('name',
                  {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请输入展会名称' },
                    ],
                  })(
                  <Input
                    autoComplete="off"
                    placeholder="请输入展会名称"
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="展会时间">
                {getFieldDecorator('time',
                  {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请选择展会时间' },
                    ],
                  })(
                  <RangePicker
                    style={{width: '100%'}}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{
                      defaultValue: [moment('09:00', 'HH:mm'), moment('20:00', 'HH:mm')]
                    }}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="展会地点">
                {getFieldDecorator('place',
                  {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请输入展会地点' },
                    ],
                  })(
                  <Input
                    autoComplete="off"
                    placeholder="请输入展会地点"
                  />
                )}
              </FormItem>

              <FormItem {...btnItemLayout2}>

                <h3>门票信息</h3>

                {ticketFormList}

                <Button
                  type="dashed"
                  size="large"
                  style={{width: '100%'}}
                  onClick={this.addTicketForm}
                >
                  <Icon type="plus" />
                  <span>添加门票信息</span>
                </Button>

              </FormItem>

              <FormItem {...formItemLayout} label="限购数量">
                {getFieldDecorator('limit',
                  {
                    initialValue: '0',
                  })(
                  <RadioGroup name="limit">
                    <Radio value={'0'}>不限购</Radio>
                    <Radio value={'1'}>
                      限购
                      {
                        getFieldValue('limit') === '0' ?
                          null
                          :
                          <InputNumber
                            min={1}
                            defaultValue={100}
                            style={{marginLeft: '10px'}}
                            onChange={this.onChangeLimit}
                          />
                      }
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="退票正常">
                {getFieldDecorator('refund',
                  {
                    initialValue: '0',
                  })(
                  <RadioGroup name="refund">
                    <Radio value={'0'}>不支持</Radio>
                    <Radio value={'1'}>支持</Radio>
                  </RadioGroup>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="展会介绍">
                {getFieldDecorator('content',
                  {
                    rules: [

                    ],
                  })(
                  <TextArea autosize={{ minRows: 4, maxRows: 8 }} placeholder="请输入展会介绍"/>
                )}
              </FormItem>

              <FormItem {...btnItemLayout}>
                <div className={styles.btns}>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    提交
                  </Button>
                  <Button htmlType="reset">取消</Button>
                </div>
              </FormItem>

            </Form>
          </Col>
          <Col xs={0} sm={0} md={0} lg={10}/>
        </Row>

      </div>
    )
  }
}

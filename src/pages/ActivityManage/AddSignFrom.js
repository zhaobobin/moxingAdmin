import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import moment from 'moment'
import {Row, Col, Form, Input, InputNumber, Button, Icon, Select, Checkbox, DatePicker, TimePicker, Radio, Modal} from 'antd'

import styles from './AddSignFrom.less'

const FormItem = Form.Item
const { Option } = Select;

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

const signSchema = [
  { type: '1', key: 'text', field: 'name', max: 20, is_select: 1, is_only: 1 },
  { type: '2', key: 'tel', max: 11, is_select: 1 },
  { type: '3', key: 'photo' },
  { type: '4', key: 'gender' },
  { type: '5', key: 'city' },
  { type: '6', key: 'number', max: 10000 },
  { type: '7', key: 'datepicker' },
]

@connect(({global}) => ({
  global,
}))
@Form.create()
export default class AddSignFrom extends React.Component {
  constructor(props) {
    super(props)
    this.ajaxFlag = true;
    this.state = {
      title: '添加报名',
      activity_id: '',
      roundDetail: '',
      loading: true,
      visible: false,
      signForm: [
        { type: '1', key: 'text', max: 20, is_select: 1, is_only: 1 }
      ]
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  show = ({ activity_id, roundDetail }) => {
    this.setState({
      loading: false,
      visible: true,
      activity_id,
      roundDetail
    })
  }

  hide = () => {
    this.setState({
      visible: false,
      activity_id: '',
      roundDetail: ''
    })
  }

  queryRound = () => {

  }

  addSignForm = () => {
    let {signForm} = this.state
    let item = {
      type: '',
      name: '',
    }
    signForm.push(item)
    this.setState({
      signForm,
    })
  }

  changeSignFormType = (value, index) => {
    let { signForm } = this.state;
    signForm[index]['type'] = value;
    this.setState({
      signForm,
    });
  }

  changeSignFormName = (e, index) => {
    let { signForm } = this.state;
    signForm[index]['name'] = e.target.value;
    this.setState({
      signForm,
    });
  }

  deleteSignFormItem = (index) => {
    let { signForm } = this.state;
    signForm.splice(index, 1);
    this.setState({
      signForm,
    });
  }

  submit = (e) => {
    e.preventDefault()

    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (err) return;

      let {activity_id, signForm} = this.state;
      for(let i in signForm){
        for(let j in signSchema) {
          if(signSchema[j].type === signForm[i].type) {
            signForm[i] = Object.assign(signForm[i], signSchema[j])
          }
        }
      }
      // console.log(signForm)
      let data = {
        activities_id: activity_id,
        name: values.name,
        price: values.price,
        strong: values.strong,
        end_time: moment(values.end_time).format('YYYY-MM-DD HH:mm:ss'),
        info: JSON.stringify(signForm)
      }
      // console.log(data)
      this.createSign(data)
    });

    setTimeout(() => { this.ajaxFlag = true }, 500);

  }

  createSign = (data) => {
    this.props.dispatch({
      type: 'global/post',
      url: '/api/activities/enroll_add',
      payload: data,
      callback: res => {
        if (res.code === '0') {
          this.hide()
        }
      },
    })
  }

  render() {

    const {loading, title, roundDetail, visible, signForm} = this.state
    const {getFieldDecorator, getFieldValue, getFieldsError} = this.props.form
    // console.log(roundDetail)

    const signTypeOptions = [
      {label: '单行文本框', value: '1'},
      {label: '手机输入框', value: '2'},
      {label: '图片选择', value: '3'},
      {label: '多级选择框', value: '4'},
      {label: '城市选择框', value: '5'},
      {label: '数字输入框', value: '6'},
      {label: '年龄选择器', value: '7'},
    ];

    const signFormList = !loading && signForm.length > 0 ?
      signForm.map((item, index) => (
        <div className={styles.signFormItem} key={index}>
          <div className={styles.item + " " + styles.type}>
            {getFieldDecorator(`sign-type-${index}`, {
              validateFirst: true,
              rules: [{required: true, message: '请选择字段类型'}],
            })(
              <Select
                placeholder="请选择字段类型"
                onChange={value => this.changeSignFormType(value, index)}
              >
                {signTypeOptions.map((op, key) => (
                  <Option
                    key={key}
                    value={op.value}
                  >
                    {op.label}
                  </Option>
                ))}
              </Select>
            )}
          </div>
          <div className={styles.item + " " + styles.name}>
            {getFieldDecorator(`sign-name-${index}`, {
              validateFirst: true,
              rules: [{required: true, message: '请输入字段名称'}],
            })(
              <Input
                autoComplete="off"
                placeholder="请输入字段名称"
                allowClear={true}
                onChange={e => this.changeSignFormName(e, index)}
              />
            )}
          </div>
          <div className={styles.item + " " + styles.btn}>
            <Button type="danger" ghost onClick={() => this.deleteSignFormItem(index)}>删除</Button>
          </div>
        </div>
      ))
      :
      []

    return (
      <Modal
        title={title}
        visible={visible}
        width={750}
        centered={true}
        destroyOnClose={true}
        onOk={this.submit}
        onCancel={this.hide}
      >
        {
          loading ?
            null
            :
            <Form className={styles.container}>

              <FormItem {...formItemLayout} label={'报名名称'}>
                {getFieldDecorator('name', {
                  initialValue: '',
                  rules: [
                    {required: true, message: '请输入报名名称'},
                    {max: 20, message: '不能超过20个汉子'},
                  ]
                })(
                  <Input autoComplete="off" placeholder='请输入报名名称'/>
                )}
              </FormItem>

              {
                roundDetail.length > 0 ?
                  <FormItem {...formItemLayout} label={'活动轮次'}>
                    {getFieldDecorator('round_id', {
                      initialValue: roundDetail[0].id,
                      rules: []
                    })(
                      <Select placeholder="请选择轮次">
                        {roundDetail.map((op, key) => (
                          <Option
                            key={key}
                            value={op.id}
                          >
                            {op.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                  :
                  null
              }

              <FormItem {...formItemLayout} label={'报名费用'}>
                {getFieldDecorator('price', {
                  initialValue: '',
                  rules: [
                    {required: true, message: '请输入报名费用'},
                  ]
                })(
                  <Input type='number' autoComplete="off" placeholder='请输入报名名称'/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={'报名人数'}>
                {getFieldDecorator('strong', {
                  initialValue: '',
                  rules: [
                    {required: true, message: '请输入报名人数'},
                  ]
                })(
                  <Input type='number' autoComplete="off" placeholder='请输入报名人数'/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={'报名截止时间'}>
                {getFieldDecorator('end_time', {
                  initialValue: '',
                  rules: [
                    {required: true, message: '请选择截止时间'},
                  ]
                })(
                  <DatePicker style={{width: '100%'}} showTime placeholder='请选择截止时间'/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<strong>报名表单</strong>}>
                {signFormList}
                {
                  signForm.length < 10 ?
                    <Button
                      type="dashed"
                      style={{width: '100%'}}
                      onClick={this.addSignForm}
                    >
                      <Icon type="plus"/>
                      <span>添加报名字段</span>
                    </Button>
                    :
                    null
                }
              </FormItem>

            </Form>
        }
      </Modal>
    )
  }
}

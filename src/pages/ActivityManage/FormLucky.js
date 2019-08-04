import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import moment from 'moment'
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
} from 'antd'
import styles from './Form.less'

import UploadImage from '@/components/Form/UploadImage'
import Ueditor from '@/components/Form/Ueditor'

const FormItem = Form.Item
const {TextArea} = Input
const {Option} = Select
const {RangePicker} = DatePicker
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
    md: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 17},
    md: {span: 17},
  },
}

const formItemLayout2 = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
    md: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
    md: {span: 20},
  },
}

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
}

//获取日期范围
function getAllDate(beginDate, endDate) {
  // 开始日期和结束日期
  if (!beginDate || !endDate) {
    // 去除空的可能性
    //console.log('时间不能为空');
    return false
  }
  let begin = beginDate.split(' ')[0],
    beginTime = beginDate.split(' ')[1],
    end = endDate.split(' ')[0],
    endTime = endDate.split(' ')[1]

  let ab = begin.split('-') // 把日期参数分割，注意，如果以'/'连接，则分割'/'
  let ae = end.split('-')
  let db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]) // 返回符合UTC的时间格式
  let de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  let unixDb = db.getTime()
  let unixDe = de.getTime()
  let arr = []
  for (let k = unixDb, i = 1; k <= unixDe; i++) {
    let date = moment(new Date(parseInt(k))).format('YYYY-MM-DD')
    let tickeyTime = {
      label: date + ' ' + beginTime + ' ~ ' + date + ' ' + endTime,
      value: i.toString(),
    }
    arr.push(tickeyTime)
    k = k + 24 * 60 * 60 * 1000
  }
  return arr // 返回两个日期之间的所有日期数组。
}

@connect(({global}) => ({
  global,
}))
@Form.create()
export default class CreateLucky extends React.Component {

  constructor(props) {
    super(props)
    this.ajaxFlag = true
    this.state = {
      title: '抽奖',
      level: this.props.keys ? this.props.keys.split('_')[0] : '',
      type: this.props.keys ? this.props.keys.split('_')[1] : '',
      p_num: this.props.keys ? this.props.keys.split('_')[2] : '',        // 上一级活动id

      detail: '',
      mapVisible: false, //地图显示
      mapAddress: '', //地图地址
      mapPosition: '', //地图坐标

      luckyForm: [],
    }
  }

  componentDidMount() {
    let {detail, action} = this.props
    if (action === 'add') return
    let mapAddress = detail.place,
      luckyForm = detail.lucky;
    for (let i in luckyForm) {
      if (luckyForm[i].choose) {
        luckyForm[i].choose = luckyForm[i].choose.split(',')
      }
    }
    this.setState({
      level: detail.level,
      type: detail.type,
      p_num: detail.p_num || '',
      detail,
      mapAddress,
      luckyForm,
    })
  }

  // 门票 start

  // 时间 - 循环时间范围
  handleChangeTime = values => {
    if (!values[0]) return
    let start_time = moment(values[0]._d).format('YYYY-MM-DD HH:mm') //开始时间
    let end_time = moment(values[1]._d).format('YYYY-MM-DD HH:mm') //结束时间
    let ticketTimeArr = getAllDate(start_time, end_time)
    this.setState({
      ticketTimeArr,
    })
  }

  //修改限购数量
  onChangeLimit = value => {
    this.props.form.setFieldsValue({limit: value})
  }

  //添加门票表单
  addLuckyForm = () => {
    let {luckyForm} = this.state
    let item = {
      name: '',
      is_day: '0',
      choose: '',
      price: '',
      storage: '',
    }
    luckyForm.push(item)

    this.setState({
      luckyForm,
    })
  }

  //删除门票表单
  removeLuckForm = index => {
    let {luckyForm} = this.state
    luckyForm.splice(index, 1)
    this.setState({
      luckyForm,
    })
  }

  //监控门票表单
  changeLuckyForm = (e, index, key) => {
    let {luckyForm} = this.state
    luckyForm[index][key] = e.target.value
    this.setState({
      luckyForm,
    })
  }

  changeTicketBlur = (e, index) => {
    let value = e.target.value
    if(!value) return;
    let k = `ticket-price-${index}`
    value = parseFloat(value).toFixed(2)
    this.props.form.setFieldsValue({[k]: value})
  }

  changeTicketTime = (checkedValues, key) => {
    let {luckyForm} = this.state
    luckyForm[key]['choose'] = checkedValues
    this.setState({
      luckyForm,
    })
  }
  // 门票 end !!!

  //上传图片回调
  coverUploadCallback = img => {
    if (img) this.props.form.setFieldsValue({'image': img.img_url})
  }
  detailUploadCallback = img => {
    if (img) this.props.form.setFieldsValue({'image_details': img.img_url})
  }

  //富文本
  editorCallback = content => {
    this.props.form.setFieldsValue({'content': content})
  }

  // 重置
  handleFormReset = e => {
    e.preventDefault()
    this.props.form.resetFields()
  }

  //表单确定
  handleFormSubmit = e => {
    e.preventDefault()

    if (!this.ajaxFlag) return
    this.ajaxFlag = false

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        let {mapPosition, luckyForm, p_num} = this.state
        if(p_num) values.p_num = p_num;
        for (let i in luckyForm) {
          if (luckyForm[i].choose) {
            luckyForm[i].choose = luckyForm[i].choose.join(',')
          }
        }
        values.ticket = JSON.stringify(luckyForm)
        values.coordinate = mapPosition                   // 地图坐标
        values.shelf_time = moment(values.shelf_time._d).format('YYYY-MM-DD HH:mm') //售票开始时间
        values.start_time = moment(values.time[0]._d).format('YYYY-MM-DD HH:mm') //活动开始时间
        values.end_time = moment(values.time[1]._d).format('YYYY-MM-DD HH:mm') //活动结束时间
        delete values.ticket_time;
        delete values.time;
        this.save(values)
      }
    })
    setTimeout(() => {
      this.ajaxFlag = true
    }, 500)
  }

  //保存
  save = values => {
    const {action, detail} = this.props
    const api =
      action === 'add' ? '/api/exhibition/exhibition_add' : '/api/exhibition/exhibition_edit'
    let data = values;
    if (action === 'edit') {
      data.id = detail.id
      data.is_edit = '1'
    }
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: res => {
        if (res.code === '0') {
          this.props.dispatch(routerRedux.push('/activity'))
        }
        setTimeout(() => { this.ajaxFlag = true }, 500);
      },
    })
  }

  render() {

    const {title, level, type, luckyForm} = this.state
    const {getFieldDecorator, getFieldValue, getFieldsError} = this.props.form

    //门票信息表单
    const luckyFormList =
      luckyForm && luckyForm.length > 0
        ? luckyForm.map((item, index) => (
          <div key={index} className={styles.ticketFormItem}>
            <FormItem {...formItemLayout2} label="奖品名称">
              {getFieldDecorator(`lucky-name-${index}`, {
                validateFirst: true,
                rules: [{required: true, message: '请输入奖品名称'}],
              })(
                <Input
                  autoComplete="off"
                  placeholder="请输入奖品名称"
                  allowClear={true}
                  onChange={e => this.changeLuckyForm(e, index, 'name')}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout2} label="奖品库存">
              {getFieldDecorator(`lucky-storage-${index}`, {
                validateFirst: true,
                rules: [
                  {required: true, message: '请输入奖品库存'},
                  {pattern: /^[0-9]+$/, message: '只能输入正整数'},
                ],
              })(
                <Input
                  autoComplete="off"
                  style={{width: '100%'}}
                  allowClear={true}
                  placeholder="请输入奖品库存"
                  onChange={e => this.changeLuckyForm(e, index, 'storage')}
                />
              )}
            </FormItem>

            {index >= 0 ? (
              <a className={styles.remove} onClick={() => this.removeLuckForm(index)}>
                删除门票信息
              </a>
            ) : null}
          </div>
        ))
        : []

    return (
      <div className={styles.container}>

        <Row>

          <Col xs={24} sm={24} md={24} lg={14}>
            <Form
              hideRequiredMark={true}
              onSubmit={this.handleFormSubmit}
              onReset={this.handleFormReset}
            >
              <FormItem {...formItemLayout} label={'活动级别'}>
                {getFieldDecorator('level', {
                  initialValue: level,
                })
                (
                  <Select disabled>
                    <Option value="1">一级活动</Option>
                    <Option value="2">二级活动</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={'活动类型'}>
                {getFieldDecorator('type', {
                  initialValue: type,
                })
                (
                  <Select disabled>
                    <Option value="1">常规活动</Option>
                    <Option value="2">比赛活动</Option>
                    <Option value="3">抽奖活动</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={`${title}名称`}>
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入活动名称' },
                  ]
                })
                (
                  <Input
                    autoComplete="off"
                    allowClear={true}
                    placeholder="请输入"
                  />
                )}
              </FormItem>

              {
                level === '2' ?
                  <FormItem {...formItemLayout} label={'是否赠票'}>
                    {getFieldDecorator('ticket_id', {
                      rules: [
                        { required: true, message: '请选择是否赠票' },
                      ]
                    })
                    (
                      <Input
                        autoComplete="off"
                        allowClear={true}
                        placeholder="请输入"
                      />
                    )}
                  </FormItem>
                  :
                  null

              }

              <FormItem {...formItemLayout} label={'活动上架时间'}>
                {getFieldDecorator('shelf_time', {
                  rules: [
                    { required: true, message: '请选择上架时间' },
                  ]
                })
                (
                  <DatePicker style={{width: '100%'}} showTime placeholder="请选择时间" />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={`${title}时间`}>
                {getFieldDecorator('time', {
                  rules: [
                    { required: true, message: '请选择时间' },
                  ]
                })
                (
                  <RangePicker
                    style={{width: '100%'}}
                    showTime={{ format: 'HH:mm' }}
                    placeholder={[`${title}开始时间`, `${title}结束时间`]}
                    onChange={this.handleChangeTime}
                  />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label={<strong>奖品信息</strong>}>
                {luckyFormList}

                <Button
                  type="dashed"
                  size="large"
                  style={{width: '100%'}}
                  onClick={this.addLuckyForm}
                >
                  <Icon type="plus"/>
                  <span>添加奖品信息</span>
                </Button>
              </FormItem>

              <FormItem {...formItemLayout} label={`${title}介绍`} className={styles.ueditor}>
                {getFieldDecorator('content', {
                  rules: [
                    { required: true, message: '请输入介绍' },
                  ]
                })(
                  <Ueditor height={250} callback={this.editorCallback}/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="列表展示图">
                {getFieldDecorator('image', {
                  rules: [
                    { required: true, message: '请选择展示图' },
                  ]
                })(
                  <UploadImage callback={this.coverUploadCallback} />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="详情展示图">
                {getFieldDecorator('image_details', {
                  rules: [
                    { required: true, message: '请选择展示图' },
                  ]
                })(
                  <UploadImage callback={this.detailUploadCallback} />
                )}
              </FormItem>

              <FormItem {...btnItemLayout}>
                <div className={styles.btns}>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
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

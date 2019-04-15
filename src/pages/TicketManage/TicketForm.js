import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import moment from 'moment';
import { Row, Col, Form, Input, InputNumber, Button, Icon, Select, Checkbox, DatePicker, Radio, Modal } from 'antd'
import styles from './TicketForm.less'

import GaodeMap from '@/components/Map/GaodeMap'
import UploadImage from '@/components/Form/UploadImage'
import Ueditor from '@/components/Form/Ueditor'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

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

//获取日期范围
function getAllDate(beginDate, endDate){			// 开始日期和结束日期
  if(!beginDate || !endDate){			// 去除空的可能性
    //console.log('时间不能为空');
		return false;
  }
  let begin = beginDate.split(' ')[0], beginTime = beginDate.split(' ')[1],
    end = endDate.split(' ')[0], endTime = endDate.split(' ')[1];

  let ab = begin.split('-');			// 把日期参数分割，注意，如果以'/'连接，则分割'/'
  let ae = end.split('-');
  let db = new Date();
  db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);			// 返回符合UTC的时间格式
  let de = new Date();
  de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
  let unixDb = db.getTime();
  let unixDe = de.getTime();
  let arr = [];
  for(let k = unixDb, i = 1; k <= unixDe; i++){
    let date = moment(new Date(parseInt(k))).format('YYYY-MM-DD');
    let tickeyTime = {
      label: date + " " + beginTime + " ~ " + date + " " + endTime,
      value: i.toString()
    };
    arr.push(tickeyTime);
    k = k + 24 * 60 * 60 * 1000;
  }
  return arr;			// 返回两个日期之间的所有日期数组。
}

@connect(({ global }) => ({
  global,
}))
@Form.create()
export default class TicketForm extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      detail: '',
      mapVisible: false,      //地图显示
      mapAddress: '',         //地图地址
      basicInfo: '',
      ticketForm: [
        {
          name: '',
          is_day: '0',
          choose: '',
          price: '',
          storage: '',
        }
      ],
      ticketTimeArr: [],
    }
  }

  componentDidMount(){
    let {detail, action} = this.props;
    if(action === 'add') return;
    let mapAddress = detail.place,
      ticketForm = detail.ticket;
    let ticketTimeArr = getAllDate(detail.start_time, detail.end_time);
    for(let i in ticketForm){
      if(ticketForm[i].choose){
        ticketForm[i].choose = ticketForm[i].choose.split(',');
      }
    }
    this.setState({
      detail,
      mapAddress,
      ticketForm,
      ticketTimeArr
    })
  }

  //显示地图
  showMap = () => {
    this.setState({
      mapVisible: true
    })
  };

  //隐藏地图
  hideMap = () => {
    this.setState({
      mapVisible: false
    })
  };

  handleMapSubmit = () => {
    this.props.form.setFieldsValue({'place': this.state.mapAddress});
    this.hideMap();
  };

  handleMapCancel = () => {
    this.hideMap();
  };

  //地图回调
  mapCallback = (value) => {
    this.setState({
      mapAddress: value.place,
    });
  };

  //监控展会地址
  changeAddress = (e) => {
    let mapAddress = e.target.value;
    this.setState({
      mapAddress
    })
  };

  //展会时间 - 循环门票时间范围
  handleChangeTime = (values) => {
    if(!values[0]) return;
    let start_time = moment(values[0]._d).format('YYYY-MM-DD HH:mm'); //展会开始时间
    let end_time = moment(values[1]._d).format('YYYY-MM-DD HH:mm');   //展会结束时间
    let ticketTimeArr = getAllDate(start_time, end_time);
    this.setState({
      ticketTimeArr
    });
  };

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
      choose: '',
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
    let {ticketForm} = this.state;
    ticketForm[index][key] = e.target.value;
    this.setState({
      ticketForm
    })
  };

  changeTicketBlur = (e, index) => {
    let value = e.target.value;
    let k = `ticket-price-${index}`;
    value = parseFloat(value).toFixed(2);
    this.props.form.setFieldsValue({[k]: value});
  };

  changeTicketTime = (checkedValues, key) => {
    let {ticketForm} = this.state;
    ticketForm[key]['choose'] = checkedValues;
    this.setState({
      ticketForm
    })
  };

  //上传图片回调
  uploadCallback = (img) => {
    if(img) this.props.form.setFieldsValue({'image': img.img_url});
  };

  //富文本
  editorCallback = (content) => {
    this.props.form.setFieldsValue({'content': content});
  };

  //重置
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
        let {ticketForm} = this.state;
        //console.log(ticketForm)
        for(let i in ticketForm){
          if(ticketForm[i].choose) {
            ticketForm[i].choose = ticketForm[i].choose.join(',')
          }
        }
        values.ticket = JSON.stringify(ticketForm);
        values.start_time = moment(values.time[0]._d).format('YYYY-MM-DD HH:mm'); //展会开始时间
        values.end_time = moment(values.time[1]._d).format('YYYY-MM-DD HH:mm');   //展会结束时间

        this.save(values);
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //保存
  save = (values) => {
    const {action, detail} = this.props;
    const api = action === 'add' ? '/api/exhibition/exhibition_add' : '/api/exhibition/exhibition_edit';
    let data = {
      name: values.name,
      image: values.image || '',
      start_time: values.start_time,
      end_time: values.end_time,
      place: values.place,
      ticket: values.ticket,
      limit: values.limit,
      refund: values.refund,
      content: values.content || '',
      state: '1',
    };
    if(action === 'edit'){
      data.id = detail.id;
      data.is_edit = '1';
    }
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.props.dispatch(routerRedux.push('/ticket/exhibition'))
        }
      }
    });
  };

  render(){

    const { action } = this.props;
    const { detail, mapVisible, mapAddress, ticketForm, ticketTimeArr } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    // console.log(ticketForm)
    // console.log(ticketTimeArr)

    //门票信息表单
    const ticketFormList = detail ?
      ticketForm.map((item, index) => (
        <div key={index} className={styles.ticketFormItem}>
          <FormItem {...formItemLayout2} label="票面名称">
            {getFieldDecorator(`ticket-name-${index}`,
              {
                initialValue: detail && item.name || '',
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入票面名称' },
                ],
              })(
              <Input
                autoComplete="off"
                placeholder="请输入票面名称"
                allowClear={true}
                onChange={ e => this.changeTicketForm(e, index, 'name') }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="门票时间">
            {getFieldDecorator(`ticket-is_day-${index}`,
              {
                initialValue: detail && item.is_day.toString() || item.is_day,
              })(
              <RadioGroup name="is_day" onChange={ e => this.changeTicketForm(e, index, 'is_day') }>
                <Radio value={'0'}>展会期间有效</Radio>
                <br/>
                <Radio value={'1'}>
                  <span>展会当日有效</span>
                  <br/>
                  {
                    getFieldValue(`ticket-is_day-${index}`) === '1' && ticketTimeArr.length > 0 ?
                      <CheckboxGroup
                        options={ticketTimeArr}
                        defaultValue={item.choose || ''}
                        onChange={ e => this.changeTicketTime(e, index) }
                      />
                      :
                      null
                  }
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="销售票价">
            {getFieldDecorator(`ticket-price-${index}`,
              {
                initialValue: detail && item.price ? parseFloat(item.price).toFixed(2) : '',
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
                onChange={ e => this.changeTicketForm(e, index, 'price') }
                onBlur={e => this.changeTicketBlur(e, index)}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="门票总量">
            {getFieldDecorator(`ticket-storage-${index}`,
              {
                initialValue: detail && item.storage || '',
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入销售数量' },
                  { pattern: /^[0-9]+$/, message: '只能输入正整数' },
                ],
              })(
              <Input
                autoComplete="off"
                style={{width: '100%'}}
                allowClear={true}
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
      :
      [];
    // 门票信息表单 end

    return(
      <div className={styles.container}>

        {
          action === 'edit' && !detail ?
            '暂无数据'
            :
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
                        initialValue: detail.name || '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请输入展会名称' },
                        ],
                      })(
                      <Input
                        autoComplete="off"
                        allowClear={true}
                        placeholder="请输入展会名称"
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="展会时间">
                    {getFieldDecorator('time',
                      {
                        initialValue:
                          detail.start_time && detail.end_time ?
                            [moment(detail.start_time, 'YYYY-MM-DD HH:mm'), moment(detail.end_time, 'YYYY-MM-DD HH:mm')]
                            :
                            '',
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
                        onChange={this.handleChangeTime}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="展会地点">
                    {getFieldDecorator('place',
                      {
                        initialValue: detail.place || '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请输入展会地点' },
                        ],
                      })(
                      <Input
                        autoComplete="off"
                        allowClear={true}
                        placeholder="请输入展会地点"
                        onChange={this.changeAddress}
                      />
                    )}
                    <div className={styles.mapAction}>
                      <a className={styles.mapBtn} onClick={this.showMap}>地图</a>
                      {
                        getFieldValue('place') ?
                          <span className={styles.green}>(已标记)</span>
                          :
                          <span className={styles.red}>(未标记)</span>
                      }
                    </div>

                  </FormItem>

                  <FormItem {...formItemLayout} label={<strong>门票信息</strong>}>

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

                  <FormItem {...formItemLayout} label="展会封面">
                    {getFieldDecorator('image',
                      {
                        initialValue: detail.image || '',
                      })(
                      <UploadImage callback={this.uploadCallback} defaultUrl={detail.image || ''}/>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="单人限购数量">
                    {getFieldDecorator('limit',
                      {
                        initialValue: detail.limit || '0',
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
                                defaultValue={detail && detail.limit || 6}
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
                        initialValue: detail.refund || '0',
                      })(
                      <RadioGroup name="refund">
                        <Radio value={'0'}>不支持</Radio>
                        <Radio value={'1'}>支持</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="展会介绍" className={styles.ueditor}>
                    {getFieldDecorator('content',
                      {
                        initialValue: detail.content || '',
                      })(
                      <Ueditor
                        height={250}
                        content={detail.content}
                        callback={this.editorCallback}
                      />
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
        }

        <Modal
          title="点击地图选取地址"
          width={800}
          centered={true}
          destroyOnClose={true}
          visible={mapVisible}
          onOk={this.handleMapSubmit}
          onCancel={this.handleMapCancel}
        >
          <div
            id="app"
            style={{width:'100%', height: '500px', padding: '0 0 20px'}}
          >
            <GaodeMap defaultAddress={mapAddress} callback={this.mapCallback}/>
            <p
              className={styles.currentAddress}
              style={{padding: '5px 0'}}
            >
              <strong>当前地址：</strong>
              <span>{mapAddress}</span>
            </p>
          </div>
        </Modal>

      </div>
    )
  }
}

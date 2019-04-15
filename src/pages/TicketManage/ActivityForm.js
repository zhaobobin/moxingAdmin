import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import moment from 'moment';
import { Row, Col, Form, Input, InputNumber, Button, Icon, Select, Checkbox, DatePicker, Radio, Modal } from 'antd'
import styles from './ActivityForm.less'

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
export default class ActivityForm extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      detail: '',
      mapVisible: false,      //地图显示
      mapAddress: '',         //地图地址
      mapPosition: '',         //地图坐标
    }
  }

  componentDidMount(){
    let {detail, action} = this.props;
    if(action === 'add') return;
    let mapAddress = detail.place;
    this.setState({
      detail,
      mapAddress,
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
      mapPosition: value.position,
    });
  };

  //监控展会地址
  changeAddress = (e) => {
    let mapAddress = e.target.value;
    this.setState({
      mapAddress
    })
  };

  //修改限购数量
  onChangeLimit = (value) => {
    this.props.form.setFieldsValue({'limit': value});
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
        values.start_time = moment(values.time[0]._d).format('YYYY-MM-DD HH:mm'); //展会开始时间
        values.end_time = moment(values.time[1]._d).format('YYYY-MM-DD HH:mm');   //展会结束时间
        values.out_time = moment(values.out_time._d).format('YYYY-MM-DD HH:mm');   //退款期限

        this.save(values);
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //保存
  save = (values) => {
    const { action, detail } = this.props;
    const { mapPosition } = this.state;
    const api = action === 'add' ? '/api/activity/activity_add' : '/api/activity/activity_edit';
    let data = {
      name: values.name,
      image: values.image || '',
      start_time: values.start_time,
      end_time: values.end_time,
      place: values.place,
      coordinate: mapPosition ? JSON.stringify(mapPosition) : '',
      num: values.num,
      price: values.price,
      is_out: values.is_out,
      out_time: values.out_time || '',
      content: values.content,
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
          this.props.dispatch(routerRedux.push('/ticket/activity'))
        }
      }
    });
  };

  render(){

    const { action } = this.props;
    const { detail, mapVisible, mapAddress } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    return(
      <div className={styles.container}>

        {
          action === 'edit' && !detail ?
            null
            :
            <Row>
              <Col xs={24} sm={24} md={24} lg={14}>
                <Form
                  hideRequiredMark={true}
                  onSubmit={this.handleFormSubmit}
                  onReset={this.handleFormReset}
                >

                  <FormItem {...formItemLayout} label="活动名称">
                    {getFieldDecorator('name',
                      {
                        initialValue: detail.name || '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请输入活动名称' },
                        ],
                      })(
                      <Input
                        autoComplete="off"
                        allowClear={true}
                        placeholder="请输入活动名称"
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="活动时间">
                    {getFieldDecorator('time',
                      {
                        initialValue:
                          detail.start_time && detail.end_time ?
                            [moment(detail.start_time, 'YYYY-MM-DD HH:mm'), moment(detail.end_time, 'YYYY-MM-DD HH:mm')]
                            :
                            '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请选择活动时间' },
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

                  <FormItem {...formItemLayout} label="活动地点">
                    {getFieldDecorator('place',
                      {
                        initialValue: detail.place || '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请输入活动地点' },
                        ],
                      })(
                      <Input
                        autoComplete="off"
                        allowClear={true}
                        placeholder="请输入活动地点"
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

                  <FormItem {...formItemLayout} label="活动主图">
                    {getFieldDecorator('image',
                      {
                        initialValue: detail.image || '',
                      })(
                      <UploadImage callback={this.uploadCallback} defaultUrl={detail.image || ''}/>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="报名总量">
                    {getFieldDecorator('num',
                      {
                        initialValue: detail.num ? detail.num.toString() : '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请输入报名总量' },
                          { pattern: /^[0-9]+$/, message: '只能输入数值' },
                        ],
                      })(
                      <InputNumber
                        autoComplete="off"
                        placeholder="请输入报名总量"
                        allowClear={true}
                        style={{width: '100%'}}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="单人限制次数">
                    {getFieldDecorator('limit',
                      {
                        initialValue: detail.limit ? detail.limit.toString() : '0',
                      })(
                      <RadioGroup name="limit">
                        <Radio value={'0'}>不限制</Radio>
                        <Radio value={'1'}>
                          限制
                          {
                            getFieldValue('limit') === '0' ?
                              null
                              :
                              <InputNumber
                                min={1}
                                defaultValue={detail.limit || 6}
                                style={{marginLeft: '10px'}}
                                onChange={this.onChangeLimit}
                              />
                          }
                        </Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="退票正常">
                    {getFieldDecorator('is_out',
                      {
                        initialValue: detail.is_out ? detail.is_out.toString() : '0',
                      })(
                      <RadioGroup name="refund">
                        <Radio value={'0'}>不支持</Radio>
                        <Radio value={'1'}>支持</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="实名认证">
                    {getFieldDecorator('shiming',
                      {
                        initialValue: detail.shiming ? detail.shiming.toString() : '1',
                      })(
                      <RadioGroup name="refund">
                        <Radio value={'1'}>需要</Radio>
                        <Radio value={'0'}>不需要</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="姓名/手机号">
                    {getFieldDecorator('xingming',
                      {
                        initialValue: detail.xingming ? detail.xingming.toString() : '1',
                      })(
                      <RadioGroup name="refund">
                        <Radio value={'1'}>需要</Radio>
                        <Radio value={'0'}>不需要</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="报名费">
                    {getFieldDecorator('price',
                      {
                        initialValue: detail.price !== undefined ? detail.price.toString() : '',
                        validateFirst: true,
                        rules: [
                          { required: true, message: '请输入报名费' },
                          { pattern: /^[0-9.]+$/, message: '只能输入数值' },
                        ],
                      })(
                      <Input
                        autoComplete="off"
                        placeholder="请输入销售票价"
                        allowClear={true}
                        suffix="￥"
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="退款期限">
                    {getFieldDecorator('out_time',
                      {
                        initialValue: detail.out_time ? moment(detail.out_time, 'YYYY-MM-DD HH:mm') : '',
                      })(
                      <DatePicker style={{width: '100%'}} format="YYYY-MM-DD HH:mm"/>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="活动介绍" className={styles.ueditor}>
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

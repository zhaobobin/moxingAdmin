import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import moment from 'moment';
import { Row, Col, Form, Input, InputNumber, Button, Icon, Select, Checkbox, DatePicker, Radio, Switch } from 'antd'
import styles from './PrizeActivityForm.less'

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
export default class PrizeActivityForm extends React.Component {

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

  //抽奖状态
  onChangeState = (value) => {
    this.props.form.setFieldsValue({'state': value});
  };

  //修改限购数量
  onChangeLimit = (value) => {
    this.props.form.setFieldsValue({'num': value});
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
        this.save(values);
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //保存
  save = (values) => {
    const { action, detail } = this.props;
    const { mapPosition } = this.state;
    const api = action === 'add' ? '/api/prize/prize_add' : '/api/prize/prize_edit';
    let data = {
      name: values.name,
      image: values.image || '',
      num: values.num,
      invitation: values.invitation,
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
          this.props.dispatch(routerRedux.push('/ticket/prize-activity'))
        }
      }
    });
  };

  render(){

    const { action } = this.props;
    const { detail } = this.state;
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

                  <FormItem {...formItemLayout} label="活动主图">
                    {getFieldDecorator('image',
                      {
                        initialValue: detail.image || '',
                      })(
                      <UploadImage callback={this.uploadCallback} defaultUrl={detail.image || ''}/>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="抽奖状态">
                    {getFieldDecorator('state',
                      {
                        initialValue: detail.state || '',
                        validateFirst: true,
                        rules: [

                        ],
                      })(
                      <Switch
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                        defaultChecked={detail.state === 1}
                        onChange={this.onChangeState}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="限制抽奖次数">
                    {getFieldDecorator('num',
                      {
                        initialValue: detail.num || 1,
                      })(
                      <InputNumber autoComplete="off" style={{width: '100%'}} min={1} />
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="邀请奖励人数">
                    {getFieldDecorator('invitation',
                      {
                        initialValue: detail.invitation || 10,
                      })(
                      <InputNumber autoComplete="off" style={{width: '100%'}} min={1} />
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

      </div>
    )
  }
}

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
  Avatar,
  Button,
  Icon,
  Select,
  Switch,
  Checkbox,
  DatePicker,
  Radio,
  Modal,
  Message,
} from 'antd';
import styles from './GoodsForm.less';

import UploadImageList from '@/components/Form/UploadImageList';
import Ueditor from '@/components/Form/Ueditor';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
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
      offset: 0,
      span: 24,
    },
    md: {
      offset: 4,
      span: 20,
    },
  },
};

@connect(({ global }) => ({
  global,
}))
@Form.create()
export default class ArticleForm extends React.Component {
  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      detail: '',
    };
  }

  componentDidMount() {
    let { detail, action } = this.props;
    if (action === 'add') return;
    let cateArr = [];
    for (let i in detail.category) {
      cateArr.push(detail.category[i].name);
    }
    detail.cateArr = cateArr;
    this.setState({
      detail,
    });
  }

  //上传图片回调
  uploadCallback = list => {
    console.log(list);
  };

  //重置表单
  handleFormReset = e => {
    e.preventDefault();
    this.props.form.resetFields();
  };

  //表单确定
  handleFormSubmit = e => {
    e.preventDefault();

    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        this.save(values);
      }
    });
    setTimeout(() => {
      this.ajaxFlag = true;
    }, 500);
  };

  //保存
  save = values => {
    const { action, detail } = this.props;
    const api = action === 'add' ? '/api/goods/goods_add' : '/api/goods/goods_edit';
    values.image = JSON.stringify(values.image);
    let data = values;
    data.uid = this.props.global.currentUser.uid;
    if (action === 'edit') {
      data.id = detail.id;
    }
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          this.props.dispatch(routerRedux.push('/goods/list'));
        }
      },
    });
  };

  render() {
    const { detail } = this.state;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    return (
      <div className={styles.container}>
        {detail ? (
          <Form
            hideRequiredMark={true}
            onSubmit={this.handleFormSubmit}
            onReset={this.handleFormReset}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
                <FormItem {...formItemLayout} label="商品名称">
                  {getFieldDecorator('name', {
                    initialValue: detail.name || '',
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入商品名称' }],
                  })(<Input autoComplete="off" placeholder="商品名称" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品类型">
                  {getFieldDecorator('goods_type', {
                    initialValue: detail.goods_type,
                    validateFirst: true,
                    rules: [{ required: true, message: '请选择商品类型' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="文章所属分类"
                      onChange={this.onChangeCategory}
                    >
                      <Option value={'1'}>票务</Option>
                      <Option value={'2'}>实物商品</Option>
                      <Option value={'3'}>虚拟商品</Option>
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="商品图片">
                  {getFieldDecorator('image', {
                    initialValue: detail.image,
                    validateFirst: true,
                    rules: [{ required: true, message: '请选择商品图片' }],
                  })(<UploadImageList photoList={detail.image} callback={this.uploadCallback} />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品原价">
                  {getFieldDecorator('marketprice', {
                    initialValue: detail.marketprice,
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入商品原价' }],
                  })(<Input type="number" autoComplete="off" placeholder="商品原价" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品售价">
                  {getFieldDecorator('price', {
                    initialValue: detail.price,
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入商品原价' }],
                  })(<Input type="number" autoComplete="off" placeholder="商品售价" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="运费">
                  {getFieldDecorator('shipping_fee', {
                    initialValue: detail.shipping_fee,
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入商品运费' }],
                  })(<Input type="number" autoComplete="off" placeholder="商品运费" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="商品状态">
                  {getFieldDecorator('state', {
                    initialValue: detail.state,
                  })(
                    <Select style={{ width: '100%' }} placeholder="文章所属分类" disabled>
                      <Option value={'0'}>下架</Option>
                      <Option value={'1'}>正常</Option>
                      <Option value={'10'}>违规</Option>
                    </Select>
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
              </Col>

              <Col xs={0} sm={0} md={0} lg={8} />
            </Row>
          </Form>
        ) : null}
      </div>
    );
  }
}

import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {
  Row, Col, Form, Input, InputNumber, Avatar, Button, Icon,
  Select, Switch, Checkbox, DatePicker, Radio, Modal, Message
} from 'antd'
import styles from './ArticleForm.less'

//import UploadImage from '@/components/Form/UploadImage'
import Ueditor from '@/components/Form/Ueditor'

const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
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

@connect(({global}) => ({
  global,
}))
@Form.create()
export default class ArticleForm extends React.Component {

  constructor(props) {
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: false,
      detail: ''
    }
  }

  componentDidMount() {
    let {detail, action} = this.props;
    if (action === 'add') return;
    let cateArr = [];
    for(let i in detail.category){
      cateArr.push(detail.category[i].name);
    }
    detail.cateArr = cateArr;
    this.setState({
      detail
    })
  }

  //审核状态
  onChangeStatus = (status) => {
    const {id} = this.props.detail;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/portal/portal_edit',
      payload: {
        id,
        status,
      },
      callback: (res) => {
        if (res.code === '0') {
          Message.success('修改成功');
        }
      }
    });
  };

  //文章分类
  onChangeCategory = (value) => {
    console.log(value);
  };

  //富文本
  editorCallback = (content) => {
    this.props.form.setFieldsValue({'content': content});
  };

  //评论
  onChangeComment = (item) => {
    console.log(item)
    this.props.dispatch({
      type: 'global/post',
      url: '/api/portal/comment_edit',
      payload: {
        id: item.id,
        status: item.status === 1 ? 0 : 1 ,
      },
      callback: (res) => {

      }
    });
  };

  //重置表单
  handleFormReset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  };

  //表单确定
  handleFormSubmit = (e) => {
    e.preventDefault();

    if (!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.form.validateFields('', (err, values) => {
      if (!err) {
        this.save(values);
      }
    });
    setTimeout(() => {
      this.ajaxFlag = true
    }, 500);
  };

  //保存
  save = (values) => {
    const {action, detail} = this.props;
    const api = action === 'add' ? '/api/portal/portal_add' : '/api/portal/portal_edit';
    let data = {
      title: values.title,
      image: values.image || '',
    };
    if (action === 'edit') {
      data.portal_id = detail.id;
    }
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: (res) => {
        setTimeout(() => {
          this.ajaxFlag = true
        }, 500);
        if (res.code === '0') {
          this.props.dispatch(routerRedux.push('/content/article'))
        }
      }
    });
  };

  render() {

    const {detail} = this.state;
    const {getFieldDecorator, getFieldValue, getFieldsError} = this.props.form;

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <div className={styles.container}>

        {
          detail ?
            <Form
              hideRequiredMark={true}
              onSubmit={this.handleFormSubmit}
              onReset={this.handleFormReset}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={16}>

                  <FormItem {...formItemLayout} label="审核">
                    {getFieldDecorator('status',
                      {
                        initialValue: detail.status.toString(),
                        validateFirst: true,
                        rules: [],
                      })(
                      <Select onChange={this.onChangeStatus}>
                        <Option value="0">未发布</Option>
                        <Option value="1">已发布</Option>
                        <Option value="2">已下架</Option>
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="标题">
                    {getFieldDecorator('title',
                      {
                        initialValue: detail.title || '',
                        validateFirst: true,
                        rules: [
                          {required: true, message: '请输入文章标题'},
                        ],
                      })(
                      <Input autoComplete="off" placeholder="文章资讯标题"/>
                    )}
                  </FormItem>

                  {
                    detail.type === '3' ?
                      <FormItem {...formItemLayout} label="来源">
                        {getFieldDecorator('source_url',
                          {
                            initialValue: detail.source_url || '',
                            validateFirst: true,
                            rules: [
                              {required: true, message: '请输入原文来源'},
                            ],
                          })(
                          <Input autoComplete="off" placeholder="原文抓取地址" disabled={detail.source_url}/>
                        )}
                      </FormItem>
                      :
                      null
                  }

                  <FormItem {...formItemLayout} label="分类">
                    {getFieldDecorator('category',
                      {
                        initialValue: detail.cateArr,
                        validateFirst: true,
                        rules: [
                          {required: true, message: '请选择文章所属分类'},
                        ],
                      })(
                      <Select
                        mode="multiple"
                        style={{width: '100%'}}
                        placeholder="文章所属分类"
                        onChange={this.onChangeCategory}
                      >
                        {
                          detail.cateArr.map((item, index) => (
                            <Option key={index}>{item}</Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="内容" className={styles.ueditor}>
                    {getFieldDecorator('content',
                      {
                        initialValue: detail.content || '',
                        validateFirst: true,
                        rules: [
                          {required: true, message: '请输入内容'},
                        ],
                      })(
                      <Ueditor content={detail.content} callback={this.editorCallback}/>
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="评论" className={styles.comments}>
                      {
                        detail.reply === '0' ?
                          <p style={{padding: '0 10px', lineHeight: '40px'}}>暂无数据</p>
                          :
                          <ul>
                            {
                              detail.portal.map((item, index) => (
                                <li key={index}>
                                  <div className={styles.avatar}>
                                    {
                                      item.avatar ?
                                        <Avatar src={item.avatar} size={40}/>
                                        :
                                        <Avatar icon="user" size={40}/>
                                    }
                                  </div>

                                  <div className={styles.info}>
                                    <p className={styles.name}><strong>{item.name}</strong></p>
                                    <p className={styles.content}>{item.content}</p>
                                    <p className={styles.date}>{item.create_time}</p>
                                    <a className={styles.status}>
                                      <Switch
                                        checkedChildren="上架"
                                        unCheckedChildren="下架"
                                        defaultChecked={item.status}
                                        onChange={() => this.onChangeComment(item)}
                                      />
                                    </a>
                                  </div>

                                  {
                                    item.comments.length > 0 ?
                                      <div className={styles.comment}>
                                        {
                                          item.comments.map((topic, i) => (
                                            <p key={i}>
                                              <strong>{topic.name}</strong>
                                              <span>{topic.content}</span>
                                              <a className={styles.status}>
                                                <Switch
                                                  checkedChildren="上架"
                                                  unCheckedChildren="下架"
                                                  defaultChecked={topic.status}
                                                  onChange={() => this.onChangeComment(topic)}
                                                />
                                              </a>
                                            </p>
                                          ))
                                        }
                                      </div>
                                      :
                                      null
                                  }

                                </li>
                              ))
                            }
                          </ul>
                      }
                  </FormItem>

                </Col>

                <Col xs={0} sm={0} md={0} lg={8}>
                  <div className={styles.author}>
                    <a className={styles.avatar}>
                      {
                        detail.avatar ?
                          <Avatar src={detail.avatar} size={64}/>
                          :
                          <Avatar icon="user" size={64}/>
                      }
                    </a>
                    <div className={styles.userinfo}>
                      <p className={styles.p1}>{detail.author}</p>
                      <p className={styles.p2}>
                        <span>{detail.nickname}</span>
                        <span>阅读 {detail.view}</span>
                        <span>评论 {detail.reply}</span>
                        <span>喜欢 {detail.like}</span>
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
            :
            null
        }

      </div>
    )
  }
}

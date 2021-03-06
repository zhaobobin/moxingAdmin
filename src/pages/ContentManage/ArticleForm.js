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
  Table,
  Select,
  Switch,
  Checkbox,
  DatePicker,
  Radio,
  Modal,
  Message,
} from 'antd';
import styles from './ArticleForm.less';

//import UploadImage from '@/components/Form/UploadImage'
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
      detail: '',
      modalVisible: false,

      currentCategoryNames: '',
      currentCategoryIds: '',
      currentCategoryIdsBeifen: '',
      category: [],
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    let { detail, action } = this.props;
    if (action === 'add') return;
    let currentCategoryNames = [],
      currentCategoryIds = [],
      currentCategoryIdsBeifen = [];
    for (let i in detail.category) {
      currentCategoryNames.push(detail.category[i].name);
      currentCategoryIds.push(detail.category[i].category_id);
      currentCategoryIdsBeifen.push(detail.category[i].category_id);
    }
    this.setState({
      detail,
      currentCategoryNames,
      currentCategoryIds,
      currentCategoryIdsBeifen,
    });
  }

  //审核状态
  onChangeStatus = status => {
    const { id } = this.props.detail;
    this.props.dispatch({
      type: 'global/post',
      url: '/api/portal/portal_edit',
      payload: {
        id,
        status,
      },
      callback: res => {
        if (res.code === '0') {
          Message.success('修改成功');
        }
      },
    });
  };

  queryCategory = () => {
    this.props.dispatch({
      type: 'global/post',
      url: '/api/portal/category',
      payload: {},
      callback: res => {
        if (res.code === '0') {
          this.setState({
            modalVisible: true,
            category: res.data,
          });
        }
      },
    });
  };

  //选择分类
  onShowCategory = () => {
    const { category } = this.state;
    if (category.length > 0) {
      this.setState({
        modalVisible: true,
      });
    } else {
      this.queryCategory();
    }
  };

  onCloseCategory = () => {
    const { currentCategoryIds } = this.state;
    this.setState({
      currentCategoryIdsBeifen: currentCategoryIds,
      modalVisible: false,
    });
  };

  onSelectChange = keys => {
    const currentCategoryIdsBeifen = keys.length > 3 ? keys.slice(-3) : keys;
    //console.log(currentCategoryIdsBeifen)
    this.setState({ currentCategoryIdsBeifen });
  };

  onSubmitCategory = () => {
    const { currentCategoryIdsBeifen, category } = this.state;
    let currentCategoryNames = [];
    for (let j in currentCategoryIdsBeifen) {
      for (let i in category) {
        if (category[i].id === currentCategoryIdsBeifen[j]) {
          currentCategoryNames.push(category[i].name);
        }
        for (let k in category[i].children) {
          if (category[i].children[k].id === currentCategoryIdsBeifen[j]) {
            currentCategoryNames.push(category[i].children[k].name);
          }
        }
      }
    }

    currentCategoryNames = currentCategoryNames.join(',');
    // console.log(currentCategoryNames)
    // console.log(currentCategoryIdsBeifen)
    this.props.form.setFields({
      'category': {
        value: currentCategoryNames,
        errors: ''
      }
    });

    this.setState({
      currentCategoryNames,
      currentCategoryIds: currentCategoryIdsBeifen,
      modalVisible: false,
    });
  };

  //富文本
  editorCallback = content => {
    this.props.form.setFieldsValue({ content: content });
  };

  //评论
  onChangeComment = item => {
    //console.log(item)
    this.props.dispatch({
      type: 'global/post',
      url: '/api/portal/comment_edit',
      payload: {
        id: item.id,
        status: item.status === 1 ? 0 : 1,
      },
      callback: res => {},
    });
  };

  //匹配文章图片
  filterImages = str => {
    let images = [];
    let imgReg = /<img.*?(?:>|\/>)/gi;
    //匹配src属性
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    let arr = str.match(imgReg);
    
    if(arr){
      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg);
        //获取图片地址
        if (src[1] && images.length < 3) images.push(src[1]);
      }
    };
    return images.join(',');
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
    const api = action === 'add' ? '/api/portal/add_portal' : '/api/portal/portal_edit';
    let data = values;
    data.uid = this.props.global.currentUser.uid;
    if (action === 'edit') {
      data.id = detail.id;
    }
    data.category_id = this.state.currentCategoryIds.join(',');
    data.img = this.filterImages(data.content); // 截取文章图片
    // console.log(data)
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: data,
      callback: res => {
        setTimeout(() => {
          this.ajaxFlag = true;
        }, 500);
        if (res.code === '0') {
          history.go(-1);
        }
      },
    });
  };

  render() {
    const { action, type } = this.props;
    const {
      detail,
      modalVisible,
      currentCategoryNames,
      currentCategoryIdsBeifen,
      category,
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分类介绍',
        dataIndex: 'explain',
        key: 'explain',
        align: 'center',
      },
      {
        title: '排序',
        dataIndex: 'list_order',
        key: 'list_order',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: status => <span>{status === 1 ? '正常' : ''}</span>,
      },
    ];

    return (
      <div className={styles.container}>
        {action === 'edit' && !detail ? null : (
          <Form
            hideRequiredMark={true}
            onSubmit={this.handleFormSubmit}
            onReset={this.handleFormReset}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
                <FormItem {...formItemLayout} label="审核">
                  {getFieldDecorator('status', {
                    initialValue: detail && detail.status ? detail.status.toString() : '0',
                    validateFirst: true,
                    rules: [],
                  })(
                    <Select onChange={this.onChangeStatus} placeholder="请选择">
                      <Option value="0">未发布</Option>
                      <Option value="1">已发布</Option>
                      <Option value="2">已下架</Option>
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="标题">
                  {getFieldDecorator('title', {
                    initialValue: detail.title || undefined,
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入文章标题' }],
                  })(<Input autoComplete="off" placeholder="文章资讯标题" />)}
                </FormItem>

                {detail.type === '3' ? (
                  <FormItem {...formItemLayout} label="来源">
                    {getFieldDecorator('source_url', {
                      initialValue: detail.source_url || undefined,
                      validateFirst: true,
                      rules: [{ required: true, message: '请输入原文来源' }],
                    })(
                      <Input
                        autoComplete="off"
                        placeholder="原文抓取地址"
                        disabled={detail.source_url !== ''}
                      />
                    )}
                  </FormItem>
                ) : null}

                <FormItem {...formItemLayout} label="分类">
                  {getFieldDecorator('category', {
                    initialValue: currentCategoryNames || undefined,
                    validateFirst: true,
                    rules: [
                      {required: true, message: '请选择文章所属分类'},
                    ],
                  })(
                    <Input
                      autoComplete="off"
                      onClick={this.onShowCategory}
                      placeholder="文章所属分类"
                    />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="内容" className={styles.ueditor}>
                  {getFieldDecorator('content', {
                    initialValue: detail.content || undefined,
                    validateFirst: true,
                    rules: [{ required: true, message: '请输入内容' }],
                  })(
                    <Ueditor
                      height={400}
                      type={type}
                      content={detail.content}
                      callback={this.editorCallback}
                    />
                  )}
                </FormItem>

                {action === 'edit' && detail.portal ? (
                  <FormItem {...formItemLayout} label="评论" className={styles.comments}>
                    {detail.reply === '0' ? (
                      <p style={{ padding: '0 10px', lineHeight: '40px' }}>暂无数据</p>
                    ) : (
                      <ul>
                        {detail.portal.map((item, index) => (
                          <li key={index}>
                            <div className={styles.avatar}>
                              {item.avatar ? (
                                <Avatar src={item.avatar} size={40} />
                              ) : (
                                <Avatar icon="user" size={40} />
                              )}
                            </div>

                            <div className={styles.info}>
                              <p className={styles.name}>
                                <strong>{item.name}</strong>
                              </p>
                              <p className={styles.content}>{item.content}</p>
                              <p className={styles.date}>{item.create_time}</p>
                              <a className={styles.status}>
                                <Switch
                                  checkedChildren="上架"
                                  unCheckedChildren="下架"
                                  defaultChecked={item.status === 1}
                                  onChange={() => this.onChangeComment(item)}
                                />
                              </a>
                            </div>

                            {item.comments.length > 0 ? (
                              <div className={styles.comment}>
                                {item.comments.map((topic, i) => (
                                  <p key={i}>
                                    <strong>{topic.name}</strong>
                                    <span>{topic.content}</span>
                                    <a className={styles.status}>
                                      <Switch
                                        checkedChildren="上架"
                                        unCheckedChildren="下架"
                                        defaultChecked={topic.status === 1}
                                        onChange={() => this.onChangeComment(topic)}
                                      />
                                    </a>
                                  </p>
                                ))}
                              </div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
                  </FormItem>
                ) : null}

                <FormItem {...btnItemLayout}>
                  <div className={styles.btns}>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                    <Button htmlType="reset">重置</Button>
                  </div>
                </FormItem>
              </Col>

              <Col xs={0} sm={0} md={0} lg={8}>
                {action === 'edit' ? (
                  <div className={styles.author}>
                    <a className={styles.avatar}>
                      {detail.avatar ? (
                        <Avatar src={detail.avatar} size={64} />
                      ) : (
                        <Avatar icon="user" size={64} />
                      )}
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
                ) : null}
              </Col>
            </Row>
          </Form>
        )}

        <Modal
          title="文章分类"
          width={800}
          visible={modalVisible}
          onOk={this.onSubmitCategory}
          onCancel={this.onCloseCategory}
          className={styles.articleCategory}
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={category}
            pagination={{
              pageSize: 5,
            }}
            rowSelection={{
              selectedRowKeys: currentCategoryIdsBeifen,
              onChange: this.onSelectChange,
            }}
          />
        </Modal>
      </div>
    );
  }
}

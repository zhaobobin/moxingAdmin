import React from 'react';
import { connect } from 'dva';
import Moment from 'moment'
import { Link, routerRedux } from 'dva/router'
import { Row, Col, Card, Table, Tabs, Spin, Modal } from 'antd';
import styles from './MemberDetail.less'

import Loading from '@/components/Common/Loading'

@connect(({ global }) => ({
  global,
}))
export default class MemberDetail extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      loading: true,
      detail: '',

      modalTitle: '',
      modalVisible: false,
      currentImg: ''
    }
  }

  componentDidMount(){
    this.queryDetail(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id) {
      this.queryDetail(nextProps.match.params.id);
    }
  }

  //查询详情
  queryDetail(id){

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/member/user_edit',
      payload: {
        id,
        edit: 0
      },
      callback: (res) => {
        setTimeout(() => { this.ajaxFlag = true }, 500);
        if(res.code === '0'){
          this.setState({
            loading: false,
            detail: res.data,
          })
        }
      }
    });
  }

  showImg = (title, img) => {
    this.setState({
      modalTitle: title,
      modalVisible: true,
      currentImg: img
    })
  };
  hideImg = () => {
    this.setState({
      modalVisible: false,
    })
  };

  render(){

    const { loading, detail } = this.state;

    const rowItemLayout = {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 24},
      lg: {span: 8},
    };
    const rowItemLayout2 = {
      xs: {span: 24},
      sm: {span: 24},
      md: {span: 24},
      lg: {span: 16},
    };

    const accoutInfo = detail ?
      <div className={styles.section + " " +styles.accoutInfo}>
        {/*<h2><span>账号信息</span></h2>*/}
        <div className={styles.con}>
          <Row>
            <Col {...rowItemLayout}><p><label>手机号码</label><span>{detail.mobile}</span></p></Col>
            <Col {...rowItemLayout}><p><label>姓名</label><span>{detail.name}</span></p></Col>
            <Col {...rowItemLayout}>
              <p>
                <label>账号邀请码</label>
                <span>{detail.referral_code}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col {...rowItemLayout}>
              <p>
                <label>注册时间</label>
                <span>{detail.create_ts ? Moment(detail.create_ts * 1000).format('YYYY-MM-DD') : null}</span>
              </p>
            </Col>
          </Row>
        </div>
      </div>
      : null;

    const personInfo = detail ?
      <div className={styles.section + " " +styles.personInfo}>
        <h2><span>实名认证</span></h2>
        <div className={styles.con}>
          <Row>
            <Col {...rowItemLayout}>
              <p>
                <label>真实姓名</label>
                <span>{detail.id_card ? detail.id_card.name : ''}</span>
              </p>
            </Col>
            <Col {...rowItemLayout}>
              <p>
                <label>证件号码</label>
                <span>{detail.id_card ? detail.id_card.id_number : ''}</span>
              </p>
            </Col>
            <Col {...rowItemLayout}>
              <p>
                <label>出生日期</label>
                <span>
                  {
                    detail.id_card && detail.id_card.birth ?
                      Moment(detail.id_card.birth * 1000).format('YYYY-MM-DD')
                      :
                      null
                  }
                </span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col {...rowItemLayout}>
              <p>
                <label>性别</label>
                <span>
                  {detail.id_card && detail.id_card.gender === 0 ? '男' : null}
                  {detail.id_card && detail.id_card.gender === 1 ? '女' : null}
                </span>
              </p>
            </Col>
            <Col {...rowItemLayout2}>
              <p>
                <label>身份证所在地</label>
                <span>{detail.id_card ? detail.id_card.address : ''}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col {...rowItemLayout}>
              {
                detail.id_card && detail.id_card.front_img ?
                  <p>
                    <label>身份证正面</label>
                    <span className={styles.img}>
                    <img src={detail.id_card.front_img} alt="身份证正面"/>
                    <a onClick={() => this.showImg("身份证正面", detail.id_card.front_img)}>点击查看大图</a>
                  </span>
                  </p>
                  : null
              }
            </Col>
            <Col {...rowItemLayout}>
              {
                detail.id_card && detail.id_card.back_img ?
                  <p>
                    <label>身份证反面</label>
                    <span className={styles.img}>
                    <img src={detail.id_card.back_img} alt="身份证反面"/>
                    <a onClick={() => this.showImg("身份证反面", detail.id_card.back_img)}>点击查看大图</a>
                  </span>
                  </p>
                  : null
              }
            </Col>
          </Row>
        </div>
      </div>
      : null;

    return(
      <div>
        {
          loading ?
            <Loading/>
            :
            <div className={styles.detail}>
              {accoutInfo}
              {personInfo}
            </div>
        }

        <Modal
          width={800}
          title={this.state.modalTitle}
          visible={this.state.modalVisible}
          footer={null}
          onCancel={this.hideImg}
        >
          <p><img src={this.state.currentImg} width="100%" height="auto" alt=""/></p>
        </Modal>

      </div>
    )
  }
}

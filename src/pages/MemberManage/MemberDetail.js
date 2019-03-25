import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router'
import styles from './MemberDetail.less'

import Loading from '@/components/Common/Loading'

@connect(({ global }) => ({
  global,
}))
export default class MemberDetail extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      detail: ''
    }
  }

  componentDidMount(){
    //this.queryDetail(this.state.params);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.state.id) {
      this.queryDetail({
        ...this.state.params,
        id: nextProps.match.params.id
      });
    }
  }

  //查询详情
  queryDetail(params){
    this.props.dispatch({
      type: 'fetch/post',
      url: '/api/member/detail',
      payload: params,
      callback: (res) => {
        this.setState({
          loading: false,
          detail: res.data,
        })
      }
    });
  }

  render(){

    const { loading, detail } = this.props;

    const personInfo = detail ?
      <div className={styles.section + " " +styles.personInfo}>
        <h2><span>实名认证</span></h2>
        <div className={styles.con}>
          <Row>
            <Col {...rowItemLayout}>
              <p>
                <label>真实姓名</label>
                <span>{detail.id_card.name}</span>
              </p>
            </Col>
            <Col {...rowItemLayout}>
              <p>
                <label>证件号码</label>
                <span>{detail.id_card.id_number}</span>
              </p>
            </Col>
            <Col {...rowItemLayout}>
              <p>
                <label>出生日期</label>
                <span>{detail.id_card.birth ? Moment(detail.id_card.birth * 1000).format('YYYY-MM-DD') : null}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col {...rowItemLayout}>
              <p>
                <label>性别</label>
                <span>
                  {detail.id_card.gender === 0 ? '男' : null}
                  {detail.id_card.gender === 1 ? '女' : null}
                </span>
              </p>
            </Col>
            <Col {...rowItemLayout2}>
              <p>
                <label>身份证所在地</label>
                <span>{detail.id_card.address}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col {...rowItemLayout}>
              {
                detail.id_card.front_img ?
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
                detail.id_card.back_img ?
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
            <div>
              {personInfo}
            </div>
        }
      </div>
    )
  }
}

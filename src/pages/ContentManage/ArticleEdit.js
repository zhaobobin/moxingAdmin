import React from 'react';
import { connect } from 'dva';

import Loading from '@/components/Common/Loading'
import ArticleForm from './ArticleForm'

@connect(({ global }) => ({
  global,
}))
export default class ArticleEdit extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      detail: ''
    }
  }

  componentDidMount(){
    let id = this.props.match.params.id;
    this.queryDetail(id);
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id){
      let id = nextProps.match.params.id;
      this.queryDetail(id);
    }
  }

  queryDetail(id){
    this.props.dispatch({
      type: 'global/post',
      url: '/api/portal/portal_details',
      payload: {
        portal_id: id,
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.setState({
            loading: false,
            detail: res.data
          })
        }
      }
    });
  }

  render(){

    const { loading, detail } = this.state;
    const type = this.props.match.params.type;

    return(
      <div>
        {
          loading && !detail ?
            <Loading/>
            :
            <ArticleForm detail={detail} action="edit" type={type}/>
        }
      </div>
    )
  }
}

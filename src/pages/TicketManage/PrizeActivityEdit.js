import React from 'react';
import { connect } from 'dva';

import Loading from '@/components/Common/Loading'
import PrizeActivityForm from './PrizeActivityForm'

@connect(({ global }) => ({
  global,
}))
export default class PrizeActivityEdit extends React.Component {

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
      url: '/api/prize/prize_edit',
      payload: {
        id,
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

    return(
      <div>
        {
          loading && !detail ?
            <Loading/>
            :
            <PrizeActivityForm detail={detail} action="edit"/>
        }
      </div>
    )
  }
}

import React from 'react';
import { connect } from 'dva';

import Loading from '@/components/Common/Loading'
import ActivityForm from './ActivityForm'

@connect(({ global }) => ({
  global,
}))
export default class ExhibitionEdit extends React.Component {

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
      url: '/api/activity/activity_edit',
      payload: {
        id,
        is_edit: 1
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
            <ActivityForm detail={detail} action="edit"/>
        }
      </div>
    )
  }
}

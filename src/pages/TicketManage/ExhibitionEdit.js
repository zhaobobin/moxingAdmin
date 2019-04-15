import React from 'react';
import { connect } from 'dva';

import Loading from '@/components/Common/Loading'
import TicketForm from './TicketForm'

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
      url: '/api/exhibition/exhibition_edit',
      payload: {
        id,
      },
      callback: (res) => {
        setTimeout(() => {this.ajaxFlag = true}, 500);
        if(res.code === '0'){
          this.setState({
            loading: false,
            detail: res.data.length > 0 ? res.data : ''
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
            <TicketForm detail={detail} action="edit"/>
        }
      </div>
    )
  }
}

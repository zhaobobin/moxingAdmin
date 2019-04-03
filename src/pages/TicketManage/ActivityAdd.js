import React from 'react';

import ActivityForm from './ActivityForm'

export default class ActivityAdd extends React.Component {

  render(){

    return(
      <div>
        <ActivityForm action="add"/>
      </div>
    )
  }
}

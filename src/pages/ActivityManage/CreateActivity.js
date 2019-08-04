import React from 'react';

import FormActivity from './FormActivity'

export default class CreateActivity extends React.Component {

  render(){

    return(
      <div>
        <FormActivity action="add" keys={this.props.match.params.keys}/>
      </div>
    )
  }
}

import React from 'react';

import FormLucky from './FormLucky'

export default class CreateActivity extends React.Component {

  render(){

    return(
      <div>
        <FormLucky action="add" keys={this.props.match.params.keys}/>
      </div>
    )
  }
}

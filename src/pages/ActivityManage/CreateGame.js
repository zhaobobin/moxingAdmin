import React from 'react';

import FormGame from './FormGame'

export default class CreateGame extends React.Component {

  render(){

    return(
      <div>
        <FormGame action="add" keys={this.props.match.params.keys}/>
      </div>
    )
  }
}

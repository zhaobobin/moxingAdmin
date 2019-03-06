import React from 'react';

import TicketForm from './TicketForm'

export default class ExhibitionAdd extends React.Component {

  render(){

    return(
      <div>
        <TicketForm action="add"/>
      </div>
    )
  }
}

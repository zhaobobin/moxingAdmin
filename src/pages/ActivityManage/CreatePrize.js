import React from 'react';

import FormPrize from './FormPrize';

export default class CreateActivity extends React.Component {
  render() {
    return (
      <div>
        <FormPrize action="add" keys={this.props.match.params.keys} />
      </div>
    );
  }
}

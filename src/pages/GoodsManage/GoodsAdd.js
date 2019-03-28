import React from 'react';

import GoodsForm from './GoodsForm'

export default class ArticleAdd extends React.Component {

  render(){

    return(
      <div>
        <GoodsForm action="add"/>
      </div>
    )
  }
}

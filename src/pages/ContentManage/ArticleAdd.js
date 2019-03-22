import React from 'react';

import ArticleForm from './ArticleForm'

export default class ArticleAdd extends React.Component {

  render(){

    return(
      <div>
        <ArticleForm action="add"/>
      </div>
    )
  }
}

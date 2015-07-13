import React from 'react';
import DocumentTitle from './documentTitle.js';

export default class BlogPost extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Blog Post'/>
      BlogPost {this.props.params.id}!
    </div>;
  }
}

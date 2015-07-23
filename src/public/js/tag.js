import React from 'react';

export default class BlogPost extends React.Component {
  get tagUrl() {
    return `/blog/tagged/${this.props.name}`;
  }

  render() {
    return <a href={this.tagUrl} className='tag'>{this.props.name}</a>;
  }
}

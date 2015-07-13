import React from 'react';

export default class BlogPost extends React.Component {
  render() {
    return <div>BlogPost {this.props.params.id}!</div>;
  }
}

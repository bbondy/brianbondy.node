import React from 'react';
import Router from 'react-router';

export default class Blog extends React.Component {
  render() {
    return <div>
      {this.props.children}
    </div>;
  }
}

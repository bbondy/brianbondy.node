import React from 'react';

export default class DocumentTitle extends React.Component {
  componentDidMount() {
    document.title = this.props.title + ' - Brian R. Bondy';
  }

  render() {
    return null;
  }
}


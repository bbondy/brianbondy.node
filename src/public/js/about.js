import React from 'react';
import DocumentTitle from './documentTitle.js';

export default class About extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='About'/>
      About
    </div>;
  }
}

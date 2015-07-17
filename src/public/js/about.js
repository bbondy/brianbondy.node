import React from 'react';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

export default class About extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='About'/>
      <RemoteMarkdownViewer src='about.markdown'/>
    </div>;
  }
}

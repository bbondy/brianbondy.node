import React from 'react';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

export default class Compression extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Compression'/>
      <RemoteMarkdownViewer src='compression.markdown'/>
    </div>;
  }
}


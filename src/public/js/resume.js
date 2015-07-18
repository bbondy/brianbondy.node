import React from 'react';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

export default class Resume extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Resume'/>
      <RemoteMarkdownViewer src='resume.markdown'/>
    </div>;
  }
}

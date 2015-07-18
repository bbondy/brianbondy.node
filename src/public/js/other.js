import React from 'react';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

export default class Other extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Other'/>
      <RemoteMarkdownViewer src='other.markdown'/>
    </div>;
  }
}

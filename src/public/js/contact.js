import React from 'react';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

export default class Contact extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Contact'/>
      <RemoteMarkdownViewer src='contact.markdown'/>
    </div>;
  }
}

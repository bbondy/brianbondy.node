import React from 'react';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

export default class Projects extends React.Component {
  render() {
    return <div>
      <DocumentTitle title='Projects'/>
      <RemoteMarkdownViewer src='projects.markdown'/>
    </div>;
  }
}

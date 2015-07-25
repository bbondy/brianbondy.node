import React from 'react';
import Router from 'react-router';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

let RouteHandler = Router.RouteHandler;

export default class Compression extends React.Component {
  render() {
    return <div className='compression'>
      <DocumentTitle title='Compression'/>
      <RemoteMarkdownViewer src='compression.markdown'/>
      <RouteHandler/>
    </div>;
  }
}

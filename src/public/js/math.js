import React from 'react';
import Router from 'react-router';
import DocumentTitle from './documentTitle.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

let RouteHandler = Router.RouteHandler;

export default class Math extends React.Component {
  render() {
    return <div className='math'>
      <DocumentTitle title='Math'/>
      <RemoteMarkdownViewer src='math.markdown'/>
      <RouteHandler/>
    </div>;
  }
}


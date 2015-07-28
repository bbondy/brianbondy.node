import React from 'react';
import Router from 'react-router';
import RemoteViewer from './remoteViewer.js';

let RouteHandler = Router.RouteHandler;

export default class Compression extends React.Component {
  render() {
    return <div className='compression'>
      <RemoteViewer src='compression.markdown'/>
      <RouteHandler/>
    </div>;
  }
}

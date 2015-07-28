import React from 'react';
import Router from 'react-router';
import RemoteViewer from './remoteViewer.js';

let RouteHandler = Router.RouteHandler;

export default class Math extends React.Component {
  render() {
    return <div className='math'>
      <RemoteViewer src='math.markdown'/>
      <RouteHandler/>
    </div>;
  }
}


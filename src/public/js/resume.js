import React from 'react';
import Router from 'react-router';
import RemoteViewer from './remoteViewer.js';

let RouteHandler = Router.RouteHandler;

export default class Resume extends React.Component {
  render() {
    return <div className='resume'>
      <a href='/pdf/BrianRBondy_Resume.pdf'><span className='fa fa-file-pdf-o'/> PDF</a><br/>
      <RemoteViewer src='resume.markdown'/>
      <RouteHandler/>
    </div>;
  }
}

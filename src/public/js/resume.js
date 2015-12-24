import React from 'react';
import RemoteViewer from './remoteViewer.js';

export default class Resume extends React.Component {
  render() {
    return <div className='resume'>
      <a style={{float: 'right'}} href='/pdf/BrianRBondy_Resume.pdf'><span className='fa fa-file-pdf-o'/> PDF</a>
      <RemoteViewer src='resume.markdown'/>
      {this.props.children}
    </div>;
  }
}

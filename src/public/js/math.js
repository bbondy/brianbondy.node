import React from 'react';
import RemoteViewer from './remoteViewer.js';

export default class Math extends React.Component {
  render() {
    return <div className='math'>
      <RemoteViewer src='math.markdown'/>
      {this.props.children}
    </div>;
  }
}


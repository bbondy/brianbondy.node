import React from 'react'
import RemoteViewer from './remoteViewer.js'

export default class Compression extends React.Component {
  render () {
    return <div className='compression'>
      <RemoteViewer src='compression.markdown'/>
      {this.props.children}
    </div>
  }
}

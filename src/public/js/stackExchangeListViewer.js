import React from 'react'
import {fetchHtml} from './client.js'
import RemoteViewer from './remoteViewer.js'

export default class StackExchangeListViewer extends React.Component {
  get src () {
    let socialTag = `${this.props.params.social}-`
    if (this.props.params.social === 'twitter') {
      socialTag = ''
    }
    return `/StackExchangeTwitter/${socialTag}${this.props.params.page}.html`
  }
  render () {
    return <div>
      <RemoteViewer src={this.src} fetchFunc={fetchHtml}/>
    </div>
  }
}

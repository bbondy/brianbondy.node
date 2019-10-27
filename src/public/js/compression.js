import React from 'react'
import RemoteViewer from './remoteViewer.js'
import { Route, Switch } from 'react-router-dom'

export default class Compression extends React.Component {
  render () {
    return (
      <div className='compression'>
        <RemoteViewer src='compression.markdown' />
        <Switch>
          <Route path='/compression/huffman' exact component={RemoteViewer} />
          <Route path='/compression/BWT' exact component={RemoteViewer} />
          <Route path='/compression/PPM' exact component={RemoteViewer} />
        </Switch>
      </div>)
  }
}

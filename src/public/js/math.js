import React from 'react'
import RemoteViewer from './remoteViewer.js'
import { Route, Switch } from 'react-router-dom'

export default class Math extends React.Component {
  render () {
    return (
      <div className='math'>
        <RemoteViewer src='math.markdown' />
        <Switch>
          <Route path='/math/main' exact component={RemoteViewer} />
          <Route path='/math/pi' exact component={RemoteViewer} />
          <Route path='/math/primes' exact component={RemoteViewer} />
          <Route path='/math/numberTheory' exact component={RemoteViewer} />
          <Route path='/math/graphTheory' exact component={RemoteViewer} />
          <Route path='/math/mathTricks' exact component={RemoteViewer} />
        </Switch>
      </div>)
  }
}

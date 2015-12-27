import React from 'react'
import DocumentTitle from './documentTitle.js'
import TopBar from './topBar.js'

export default class Main extends React.Component {
  render () {
    return <div>
      <DocumentTitle pathname={window.location.pathname}/>
      <TopBar/>
      <div className='mainBody'>
        {this.props.children}
      </div>
    </div>
  }
}

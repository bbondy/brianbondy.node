import React from 'react';
import {RouteHandler} from 'react-router';
import DocumentTitle from './documentTitle.js';
import TopBar from './topBar.js';

export default class Main extends React.Component {
  render() {
    return <div>
      <DocumentTitle pathname={window.location.pathname}/>
      <TopBar/>
      <div className='mainBody'>
        <RouteHandler/>
      </div>
    </div>;
  }
}

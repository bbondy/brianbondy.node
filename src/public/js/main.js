import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

class TopBar extends React.Component {
  render() {
    return <ul className='tobBar'>
      <li><a>Blog</a></li>
      <li><a>Projects</a></li>
      <li><a>Resume</a></li>
      <li><a>Other</a></li>
      <li><a>About</a></li>
      <li><a>Contact</a></li>
    </ul>;
  }
}

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <TopBar/>
        <RouteHandler/>
      </div>
    )
  }
}

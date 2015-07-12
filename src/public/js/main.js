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
      <li className='social fa fa-twitter'></li>
      <li className='social fa fa-rss'></li>
      <li className='social fa fa-github'></li>
      <li className='social fa fa-linkedin'></li>
      <li className='social fa fa-youtube-play'></li>
      <li className='social fa fa fa-stack-overflow'></li>
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

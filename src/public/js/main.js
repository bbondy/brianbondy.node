import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

class TopBar extends React.Component {
  render() {
    return <ul className='tobBar'>
      <li><a href='/'>Blog</a></li>
      <li><a href='/#/projects'>Projects</a></li>
      <li><a href='/#/resume'>Resume</a></li>
      <li><a href='/#/other'>Other</a></li>
      <li><a href='/#/about'>About</a></li>
      <li><a href='/#/contact'>Contact</a></li>
      <li className='social'><a href='https://twitter.com/brianbondy'><span className='fa fa-twitter'/></a></li>
      <li className='social'><a href='/feeds/rss/'><span className='fa fa-rss'/></a></li>
      <li className='social'><a href='https://github.com/bbondy'><span className='fa fa-github'/></a></li>
      <li className='social'><a href='http://ca.linkedin.com/in/bbondy'><span className='fa fa-linkedin'/></a></li>
      <li className='social'><a href='https://www.youtube.com/user/bbondy'><span className='fa fa-youtube-play'/></a></li>
      <li className='social'><a href='http://stackoverflow.com/users/3153/brian-r-bondy'><span className='fa fa fa-stack-overflow'/></a></li>
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

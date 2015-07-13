import React from 'react';
import Router from 'react-router';

let RouteHandler = Router.RouteHandler;

class TopBar extends React.Component {
  render() {
    return <ul className='tobBar'>
      <li><a href='/#/'>Blog</a></li>
      <li><a href='/#/projects'>Projects</a></li>
      <li><a href='/#/resume'>Resume</a></li>
      <li><a href='/#/other'>Other</a></li>
      <li><a href='/#/about'>About</a></li>
      <li><a href='/#/contact'>Contact</a></li>
      <li className='social'><a href='https://twitter.com/brianbondy' target='_blank'><span className='fa fa-twitter'/></a></li>
      <li className='social'><a href='/feeds/rss/' target='_blank'><span className='fa fa-rss'/></a></li>
      <li className='social'><a href='https://github.com/bbondy' target='_blank'><span className='fa fa-github'/></a></li>
      <li className='social'><a href='http://ca.linkedin.com/in/bbondy' target='_blank'><span className='fa fa-linkedin'/></a></li>
      <li className='social'><a href='https://www.youtube.com/user/bbondy' target='_blank'><span className='fa fa-youtube-play'/></a></li>
      <li className='social'><a href='http://stackoverflow.com/users/3153/brian-r-bondy' target='_blank'><span className='fa fa fa-stack-overflow'/></a></li>
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

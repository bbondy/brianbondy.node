import React from 'react';
import {RouteHandler, Link} from 'react-router';

class TopBar extends React.Component {
  render() {
    return <ul className='topBar'>
      <li><Link to="blog-index">Blog</Link></li>
      <li><Link to='projects'>Projects</Link></li>
      <li><Link to='resume'>Resume</Link></li>
      <li><Link to='other'>Other</Link></li>
      <li><Link to='about'>About</Link></li>
      <li><Link to='contact'>Contact</Link></li>
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
    return <div>
      <img style={{
        width: 36,
        float: 'left',
        paddingTop: 7,
        marginLeft: 3,
      }} src='/img/logo.png'/>
      <TopBar/>
      <div className='mainBody'>
        <RouteHandler/>
      </div>
    </div>;
  }
}

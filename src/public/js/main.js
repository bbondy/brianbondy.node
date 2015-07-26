import React from 'react';
import {RouteHandler, Link} from 'react-router';

class TopBar extends React.Component {
  render() {
    return <div className='topBar'>
      <Link to='blog-index'><img src='/img/logo.png'/></Link>
      <ul className='topBarLinks'>
      <Link to="blog-index"><li>Blog</li></Link>
      <Link to="blog-filters"><li>Filters</li></Link>
      <Link to='projects'><li>Projects</li></Link>
      <Link to='resume'><li>Resume</li></Link>
      <Link to='other'><li>Other</li></Link>
      <Link to='about'><li>About</li></Link>
      <Link to='contact'><li>Contact</li></Link>

      <a href='https://twitter.com/brianbondy' target='_blank'><li className='social'><span title='Twitter' className='fa fa-twitter'/></li></a>
      <a href='/feeds/rss' target='_blank'><li className='social'><span title='RSS' className='fa fa-rss'/></li></a>

      <a href='https://github.com/bbondy' target='_blank'><li className='social'><span title='GitHub' className='fa fa-github'/></li></a>

      <a href='http://ca.linkedin.com/in/bbondy' target='_blank'><li className='social'><span title='LinkedIn' className='fa fa-linkedin'/></li></a>
      <a href='https://www.youtube.com/user/bbondy' target='_blank'><li className='social'><span title='YouTube' className='fa fa-youtube-play'/></li></a>
      <a href='http://stackoverflow.com/users/3153/brian-r-bondy' target='_blank'><li className='social'><span title='StackOverflow' className='fa fa fa-stack-overflow'/></li></a>
    </ul>
    </div>;
  }
}


export default class Main extends React.Component {
  render() {
    return <div>
      <TopBar/>
      <div className='mainBody'>
        <RouteHandler/>
      </div>
    </div>;
  }
}

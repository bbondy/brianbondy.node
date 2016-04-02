import React from 'react'
import {cx} from './class-set.js'
import {Link} from 'react-router'

export default class TopBar extends React.Component {
  get basePath () {
    if (window.location.pathname.substring(1) === 'blog/filters') {
      return window.location.pathname.substring(1)
    }
    return window.location.pathname.substring(1).split('/')[0]
  }

  render () {
    return <div className='topBar'>
      <Link to='/'><img title='Brian R. Bondy' src='/img/logo.png'/></Link>
      <ul className='topBarLinks'>
      <Link to='/'><li className={cx({current: this.basePath === 'blog' || this.basePath === ''})}>Blog</li></Link>
      <Link to='/blog/filters'><li className={cx({current: this.basePath === 'blog/filters'})}>Filters</li></Link>
      <Link to='/projects'><li className={cx({current: this.basePath === 'projects'})}>Projects</li></Link>
      <Link to='/other'><li className={cx({current: this.basePath === 'other'})}>Other</li></Link>
      <Link to='/about'><li className={cx({current: this.basePath === 'about'})}>About</li></Link>
      <Link to='/contact'><li className={cx({current: this.basePath === 'contact'})}>Contact</li></Link>

      <a href='https://twitter.com/brianbondy' target='_blank'><li className='social'><span title='Twitter' className='fa fa-twitter'/></li></a>
      <a href='/feeds/rss' target='_blank'><li className='social'><span title='RSS' className='fa fa-rss'/></li></a>

      <a href='https://github.com/bbondy' target='_blank'><li className='social'><span title='GitHub' className='fa fa-github'/></li></a>

      <a href='https://www.linkedin.com/in/bbondy' target='_blank'><li className='social'><span title='LinkedIn' className='fa fa-linkedin'/></li></a>
      <a href='https://www.youtube.com/user/bbondy' target='_blank'><li className='social'><span title='YouTube' className='fa fa-youtube-play'/></li></a>
      <a href='https://bugzilla.mozilla.org/user_profile?login=netzen%40gmail.com' target='_blank'><li className='social'><span title='Bugzilla profile' className='fa fa fa-bug'/></li></a>
      <a href='https://stackoverflow.com/users/3153/brian-r-bondy' target='_blank'><li className='social'><span title='StackOverflow' className='fa fa fa-stack-overflow'/></li></a>
    </ul>
    </div>
  }
}

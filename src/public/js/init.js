import React from 'react';
import {Router, Route, Redirect, IndexRoute} from 'react-router';
console.log('Router', Router);
console.log('Route', Route);
console.log('Redirect', Redirect);
console.log('IndexRoute', IndexRoute);

import Main from './main.js';

import Blog from './blog.js';
import BlogPost from './blogPost.js';
import BlogPostList from './blogPostList.js';
import BlogFilters from './blogFilters.js';
import Compression from './compression.js';
import Resume from './resume.js';
import Math from './math.js';
import RemoteViewer from './remoteViewer.js';
import StackExchangeListViewer from './stackExchangeListViewer.js';

/**
 * Turns admin mode on with the specified password
 */
window.adminMode = function(pass) {
  document.querySelector('body').className += ' adminMode';
  window.adminModePass = pass;
};

/**
 * Indicates if admin mode is enabled or not.
 * It is enabled even if a wrong password was added so this
 * doesn't necessarily mean any command will work.
 */
window.isAdminModeEnabled = function() {
  return !!window.adminModePass;
};

window.addEventListener('load', () => {
  window.Router = Router;
  window.Route = Route;
  window.IndexRoute = IndexRoute;
  window.BlogFilters = BlogFilters;
  window.BlogPostList = BlogPostList;
  window.Blog = Blog;
  React.render(
  <Router>
    <Route path='/' component={Main}>
      <IndexRoute name='blog-index' component={BlogPostList}/>
      <Route path='blog' component={Blog}>
        <IndexRoute component={BlogPostList}/>
        <Route name='blog-filters' path='filters' component={BlogFilters}/>

        <Route path='posted/:year' component={BlogPostList}/>
        <Route path='tagged/:tag' component={BlogPostList}/>

        <Route path='/page/:page' component={BlogPostList}/>
        <Route path='page/:page' component={BlogPostList}/>
        <Route path='posted/:year/page/:page' component={BlogPostList}/>
        <Route path='tagged/:tag/page/:page' component={BlogPostList}/>

        <Route path=':id/:slug' component={BlogPost}/>
      </Route>

      <Route name='projects' path='projects' component={RemoteViewer}/>
      <Route name='resume' path='resume' component={Resume}/>
      <Route name='other' path='other' component={RemoteViewer}/>
      <Route name='about' path='about' component={RemoteViewer}/>
      <Route name='contact' path='contact' component={RemoteViewer}/>

      <Route name='compression' path='compression' component={Compression}>
       <Route path='huffman' component={RemoteViewer}/>
       <Route path='BWT' component={RemoteViewer}/>
       <Route path='PPM' component={RemoteViewer}/>
      </Route>
      <Route name='math' path='math' component={Math}>
        <Route path='main' component={RemoteViewer}/>
        <Route path='pi' component={RemoteViewer}/>
        <Route path='primes' component={RemoteViewer}/>
        <Route path='numberTheory' component={RemoteViewer}/>
        <Route path='graphTheory' component={RemoteViewer}/>
        <Route path='mathTricks' component={RemoteViewer}/>
      </Route>
      <Route name='faq' path='faq' component={RemoteViewer}/>
      <Route name='khanacademy' path='khanacademy' component={RemoteViewer}/>
      <Route name='links' path='links' component={RemoteViewer}/>
      <Route name='books' path='books' component={RemoteViewer}/>
      <Route name='articles' path='articles' component={RemoteViewer}/>
      <Route name='advice' path='advice' component={RemoteViewer}/>
      <Route name='mozilla' path='mozilla' component={RemoteViewer}/>
      <Route name='mozilla-new' path='mozilla/new' component={RemoteViewer}/>
      <Route name='universityClasses' path='universityClasses' component={RemoteViewer}/>
      <Route name='braille' path='braille' component={RemoteViewer}/>
      <Route name='morseCode' path='morseCode' component={RemoteViewer}/>
      <Route name='running' path='running' component={RemoteViewer}/>
      <Route name='stackexchnage' path='stackexchange' component={RemoteViewer}/>

      <Route path='/stackexchange-:social/:page' component={StackExchangeListViewer}/>
      <Route path='/stackexchange-:social/:page' component={StackExchangeListViewer}/>
      <Route path='/stackexchange-:social/:page' component={StackExchangeListViewer}/>

      <Redirect from='other/compression' to='compression' />
      <Redirect from='other/faq' to='faq' />
      <Redirect from='other/khanacademy' to='khanacademy' />
      <Redirect from='other/links' to='links' />
      <Redirect from='other/books' to='books' />
      <Redirect from='other/articles' to='articles' />
      <Redirect from='other/advice' to='advice' />
      <Redirect from='other/mozilla' to='mozilla' />
      <Redirect from='other/universityClasses' to='universityClasses' />
      <Redirect from='other/morseCode' to='morseCode' />
      <Redirect from='other/stackexchange' to='stackexchange' />
    </Route>
  </Router>, document.body);
});

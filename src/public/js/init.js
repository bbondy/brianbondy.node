import React from 'react';
import Router from 'react-router';

import Main from './main.js';

import Blog from './blog.js';
import BlogPost from './blogPost.js';
import BlogPostList from './blogPostList.js';
import BlogFilters from './blogFilters.js';
import Compression from './compression.js';
import Resume from './resume.js';
import NotFound from './notFound.js';
import Math from './math.js';
import RemoteViewer from './remoteViewer.js';
import StackExchangeListViewer from './stackExchangeListViewer.js';

/**
 * Turns admin mode on with the specified password
 */
window.adminMode = function(pass) {
  document.querySelector('body').className += ' adminMode';
  window.adminPass = pass;
}

/**
 * Indicates if admin mode is enabled or not.
 * It is enabled even if a wrong password was added so this
 * doesn't necessarily mean any command will work.
 */
window.isAdminModeEnabled = function() {
  return !!window.adminPass;
}

let {Route, Redirect, DefaultRoute, NotFoundRoute} = Router;

// declare our routes and their hierarchy
let routes =
  <Route handler={Main}>
    <NotFoundRoute handler={NotFound} />
    <DefaultRoute name='blog-index' handler={BlogPostList}/>
    <Route path='blog' handler={Blog}>
      <DefaultRoute handler={BlogPostList}/>
      <Route name='blog-filters' path='filters' handler={BlogFilters}/>
      <Route path=':id' handler={BlogPost}/>

      <Route path='posted/:year' handler={BlogPostList}/>
      <Route path='tagged/:tag' handler={BlogPostList}/>

      <Route path='/page/:page' handler={BlogPostList}/>
      <Route path='page/:page' handler={BlogPostList}/>
      <Route path='posted/:year/page/:page' handler={BlogPostList}/>
      <Route path='tagged/:tag/page/:page' handler={BlogPostList}/>
      <NotFoundRoute handler={NotFound} />
    </Route>

    <Route name='projects' path='projects' handler={RemoteViewer}/>
    <Route name='resume' path='resume' handler={Resume}/>
    <Route name='other' path='other' handler={RemoteViewer}/>
    <Route name='about' path='about' handler={RemoteViewer}/>
    <Route name='contact' path='contact' handler={RemoteViewer}/>

    <Route name='compression' path='compression' handler={Compression}>
     <Route path='huffman' handler={RemoteViewer}/>
     <Route path='BWT' handler={RemoteViewer}/>
     <Route path='PPM' handler={RemoteViewer}/>
    </Route>
    <Route name='math' path='math' handler={Math}>
      <Route path='main' handler={RemoteViewer}/>
      <Route path='pi' handler={RemoteViewer}/>
      <Route path='primes' handler={RemoteViewer}/>
      <Route path='numberTheory' handler={RemoteViewer}/>
      <Route path='graphTheory' handler={RemoteViewer}/>
      <Route path='mathTricks' handler={RemoteViewer}/>
      <NotFoundRoute handler={NotFound} />
    </Route>
    <Route name='faq' path='faq' handler={RemoteViewer}/>
    <Route name='khanacademy' path='khanacademy' handler={RemoteViewer}/>
    <Route name='links' path='links' handler={RemoteViewer}/>
    <Route name='books' path='books' handler={RemoteViewer}/>
    <Route name='articles' path='articles' handler={RemoteViewer}/>
    <Route name='advice' path='advice' handler={RemoteViewer}/>
    <Route name='mozilla' path='mozilla' handler={RemoteViewer}/>
    <Route name='mozilla-new' path='mozilla/new' handler={RemoteViewer}/>
    <Route name='universityClasses' path='universityClasses' handler={RemoteViewer}/>
    <Route name='braille' path='braille' handler={RemoteViewer}/>
    <Route name='morseCode' path='morseCode' handler={RemoteViewer}/>
    <Route name='stackexchnage' path='stackexchange' handler={RemoteViewer}/>

    <Route path='/stackexchange-:social/:page' handler={StackExchangeListViewer}/>
    <Route path='/stackexchange-:social/:page' handler={StackExchangeListViewer}/>
    <Route path='/stackexchange-:social/:page' handler={StackExchangeListViewer}/>

    <Redirect from="other/compression" to="compression" />
    <Redirect from="other/faq" to="faq" />
    <Redirect from="other/khanacademy" to="khanacademy" />
    <Redirect from="other/links" to="links" />
    <Redirect from="other/books" to="books" />
    <Redirect from="other/articles" to="articles" />
    <Redirect from="other/advice" to="advice" />
    <Redirect from="other/mozilla" to="mozilla" />
    <Redirect from="other/universityClasses" to="universityClasses" />
    <Redirect from="other/morseCode" to="morseCode" />
    <Redirect from="other/stackexchange" to="stackexchange" />
  </Route>;

window.addEventListener('load', () => {
  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
});

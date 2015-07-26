import React from 'react';
import Router from 'react-router';

import Main from './main.js';

import Blog from './blog.js';
import BlogPost from './blogPost.js';
import BlogPostList from './blogPostList.js';
import BlogFilters from './blogFilters.js';
import Compression from './compression.js';
import Math from './math.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

let Route = Router.Route;
let Redirect = Router.Redirect;
let DefaultRoute = Router.DefaultRoute;

// declare our routes and their hierarchy
let routes =
  <Route handler={Main}>
    <DefaultRoute name='blog-index' handler={BlogPostList}/>
    <Route path='blog' handler={Blog}>
     <Route name='blog-filters' path='filters' handler={BlogFilters}/>
     <DefaultRoute handler={BlogPostList}/>
     <Route path=':id' handler={BlogPost}/>

     <Route path='posted/:year' handler={BlogPostList}/>
     <Route path='tagged/:tag' handler={BlogPostList}/>

     <Route path='/page/:page' handler={BlogPostList}/>
     <Route path='page/:page' handler={BlogPostList}/>
     <Route path='posted/:year/page/:page' handler={BlogPostList}/>
     <Route path='tagged/:tag/page/:page' handler={BlogPostList}/>
    </Route>

    <Route name='projects' path='projects' handler={RemoteMarkdownViewer}/>
    <Route name='resume' path='resume' handler={RemoteMarkdownViewer}/>
    <Route name='other' path='other' handler={RemoteMarkdownViewer}/>
    <Route name='about' path='about' handler={RemoteMarkdownViewer}/>
    <Route name='contact' path='contact' handler={RemoteMarkdownViewer}/>

    <Route name='compression' path='compression' handler={Compression}>
     <Route path='huffman' handler={RemoteMarkdownViewer}/>
     <Route path='BWT' handler={RemoteMarkdownViewer}/>
     <Route path='PPM' handler={RemoteMarkdownViewer}/>
    </Route>
    <Route name='math' path='math' handler={Math}>
     <Route path='main' handler={RemoteMarkdownViewer}/>
     <Route path='pi' handler={RemoteMarkdownViewer}/>
     <Route path='primes' handler={RemoteMarkdownViewer}/>
     <Route path='numberTheory' handler={RemoteMarkdownViewer}/>
     <Route path='graphTheory' handler={RemoteMarkdownViewer}/>
     <Route path='mathTricks' handler={RemoteMarkdownViewer}/>
    </Route>
    <Route name='faq' path='faq' handler={RemoteMarkdownViewer}/>
    <Route name='khanacademy' path='khanacademy' handler={RemoteMarkdownViewer}/>
    <Route name='links' path='links' handler={RemoteMarkdownViewer}/>
    <Route name='books' path='books' handler={RemoteMarkdownViewer}/>
    <Route name='articles' path='articles' handler={RemoteMarkdownViewer}/>
    <Route name='advice' path='advice' handler={RemoteMarkdownViewer}/>
    <Route name='mozilla' path='mozilla' handler={RemoteMarkdownViewer}/>
    <Route name='universityClasses' path='universityClasses' handler={RemoteMarkdownViewer}/>
    <Route name='braille' path='braille' handler={RemoteMarkdownViewer}/>

    <Redirect from="other/compression" to="compression" />
    <Redirect from="other/faq" to="faq" />
    <Redirect from="other/khanacademy" to="khanacademy" />
    <Redirect from="other/links" to="links" />
    <Redirect from="other/books" to="books" />
    <Redirect from="other/articles" to="articles" />
    <Redirect from="other/advice" to="advice" />
    <Redirect from="other/mozilla" to="mozilla" />
    <Redirect from="other/universityClasses" to="universityClasses" />
    <Redirect from="other/braille" to="braille" />
  </Route>;

window.addEventListener('load', () => {
  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
});

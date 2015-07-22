import React from 'react';
import Router from 'react-router';

import Main from './main.js';

import Blog from './blog.js';
import BlogPost from './blogPost.js';
import BlogPostList from './blogPostList.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

let Route = Router.Route;
let Redirect = Router.Redirect;
let DefaultRoute = Router.DefaultRoute;

// declare our routes and their hierarchy
let routes =
  <Route handler={Main}>
    <DefaultRoute name='blog-index' handler={Blog}/>
    <Route path='blog' handler={Blog}>
     <Route path=':id' handler={BlogPost}/>
     <Route path='posted/:year' handler={BlogPostList}/>
     <Route path='modified/:year' handler={BlogPostList}/>
    </Route>

    <Route name='projects' path='projects' handler={RemoteMarkdownViewer}/>
    <Route name='resume' path='resume' handler={RemoteMarkdownViewer}/>
    <Route name='other' path='other' handler={RemoteMarkdownViewer}/>
    <Route name='about' path='about' handler={RemoteMarkdownViewer}/>
    <Route name='contact' path='contact' handler={RemoteMarkdownViewer}/>

    <Route name='compression' path='compression' handler={RemoteMarkdownViewer}/>
    <Route name='faq' path='faq' handler={RemoteMarkdownViewer}/>
    <Route name='khanacademy' path='khanacademy' handler={RemoteMarkdownViewer}/>
    <Route name='links' path='links' handler={RemoteMarkdownViewer}/>
    <Route name='math' path='math' handler={RemoteMarkdownViewer}/>
    <Route name='books' path='books' handler={RemoteMarkdownViewer}/>
    <Route name='articles' path='articles' handler={RemoteMarkdownViewer}/>
    <Route name='advice' path='advice' handler={RemoteMarkdownViewer}/>
    <Route name='mozilla' path='mozilla' handler={RemoteMarkdownViewer}/>
    <Route name='universityClasses' path='universityClasses' handler={RemoteMarkdownViewer}/>

    <Redirect from="other/compression" to="compression" />
    <Redirect from="other/faq" to="faq" />
    <Redirect from="other/khanacademy" to="khanacademy" />
    <Redirect from="other/links" to="links" />
    <Redirect from="other/books" to="books" />
    <Redirect from="other/articles" to="articles" />
    <Redirect from="other/advice" to="advice" />
    <Redirect from="other/mozilla" to="mozilla" />
    <Redirect from="other/universityClasses" to="universityClasses" />
  </Route>;

window.addEventListener('load', () => {
  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
});

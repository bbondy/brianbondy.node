import React from 'react';
import Router from 'react-router';

import Main from './main.js';

import Blog from './blog.js';
import BlogPost from './blogPost.js';
import RemoteMarkdownViewer from './remoteMarkdownViewer.js';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

// declare our routes and their hierarchy
let routes =
  <Route handler={Main}>
    <DefaultRoute name='blog-index' handler={Blog}/>
    <Route path='blog' handler={Blog}>
     <Route path=':id' handler={BlogPost}/>
    </Route>
    <Route name='projects' path='projects' handler={RemoteMarkdownViewer}/>
    <Route name='resume' path='resume' handler={RemoteMarkdownViewer}/>
    <Route name='other' path='other' handler={RemoteMarkdownViewer}/>
    <Route name='about' path='about' handler={RemoteMarkdownViewer}/>
    <Route name='contact' path='contact' handler={RemoteMarkdownViewer}/>
    <Route name='compression' path='compression' handler={RemoteMarkdownViewer}/>

    <Route name='faq' path='faq' handler={RemoteMarkdownViewer}/>
    <Route name='links' path='links' handler={RemoteMarkdownViewer}/>
    <Route name='math' path='math' handler={RemoteMarkdownViewer}/>
    <Route name='books' path='books' handler={RemoteMarkdownViewer}/>
    <Route name='articles' path='articles' handler={RemoteMarkdownViewer}/>
  </Route>;

window.addEventListener('load', () => {
  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
});

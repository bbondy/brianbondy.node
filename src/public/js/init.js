import React from 'react';
import Router from 'react-router';

import Main from './main.js';

import About from './about.js';
import Contact from './contact.js';
import Other from './other.js';
import Resume from './resume.js';
import Projects from './projects.js';
import Blog from './blog.js';
import BlogPost from './blogPost.js';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

// declare our routes and their hierarchy
let routes =
  <Route handler={Main}>
    <DefaultRoute name='blog-index' handler={Blog}/>
    <Route path='blog' handler={Blog}>
     <Route path=':id' handler={BlogPost}/>
    </Route>
    <Route path='projects' handler={Projects}/>
    <Route path='resume' handler={Resume}/>
    <Route path='other' handler={Other}/>
    <Route path='about' handler={About}/>
    <Route path='contact' handler={Contact}/>
  </Route>;

window.addEventListener('load', () => {
  Router.run(routes, Router.HistoryLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
});

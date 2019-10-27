import React from 'react'
import { Route, Switch } from 'react-router-dom'
import BlogFilters from './blogFilters.js'
import BlogPostList from './blogPostList.js'
import BlogPost from './blogPost.js'

export default class Blog extends React.Component {
  render () {
    return (
      <div>
        <Switch>
          <Route path='/blog/filters' exact component={BlogFilters} />
          <Route path='/blog/posted/:year' component={BlogPostList} />
          <Route path='/blog/tagged/:tag' component={BlogPostList} />
          <Route path='/blog/page/:page' component={BlogPostList} />
          <Route path='/page/:page' component={BlogPostList} />
          <Route path='/blog/posted/:year/page/:page' component={BlogPostList} />
          <Route path='/blog/tagged/:tag/page/:page' component={BlogPostList} />
          <Route path='/blog/:id/:slug' component={BlogPost} />
        </Switch>
      </div>)
  }
}

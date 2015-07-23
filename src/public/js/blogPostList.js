import React from 'react';
import DocumentTitle from './documentTitle.js';
import {fetchBlogPosts} from './fetch.js';
import BlogPost from './blogPost.js';

export default class BlogPostList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    fetchBlogPosts({
      year: this.props.params.year,
      tag: this.props.params.tag,
    }).then((blogPosts) =>
      this.setState({
        blogPosts,
      }));
  }

  render() {
    if (!this.state.blogPosts) {
      return null;
    }

    return <div>
      <DocumentTitle title='Blog Posts in ${this.props.params.year}'/>
      {
        this.state.blogPosts.map(blogPost =>
          <BlogPost title={blogPost.title}
            body={blogPost.body}
            created={blogPost.created}
            tags={blogPost.tags}
            id={blogPost.id}
          />)
      }
    </div>;
  }
}

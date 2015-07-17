import React from 'react';
import DocumentTitle from './documentTitle.js';
import {fetchBlogPost} from './fetch.js';
import * as Markdown from 'markdown';

export default class BlogPost extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    fetchBlogPost(this.props.params.id).then((blogPost) =>
      this.setState({blogPost}));
  }

  render() {
    if (!this.state.blogPost) {
      return null;
    }

    return <div>
      <DocumentTitle title='Blog Post'/>
      BlogPost {this.props.params.id}!
      <div>{this.state.blogPost.title}</div>
      <div>{this.state.blogPost.created}</div>
      <div dangerouslySetInnerHTML={{__html: Markdown.markdown.toHTML(this.state.blogPost.body)}}/>
    </div>;
  }
}
